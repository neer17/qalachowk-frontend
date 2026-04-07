# 11 — Inventory Management & Low-Stock Alerts

**Priority:** P2 — Operations & Scale
**Repos:** qalachowk-backend, qalachowk-admin-frontend
**Estimated effort:** 3–4 days
**Dependencies:** 09-job-queue-infra.md (for scheduled checks), 03-admin-product-management.md

---

## Problem

Stock tracking is a single `stock` integer on the Product model. No audit trail of stock changes, no low-stock alerts, no reservation system, no bulk stock updates. As the catalog grows, inventory mismatches and stockouts will cause overselling and customer frustration.

---

## Solution Overview

1. **Stock movement ledger** — every stock change is recorded with reason
2. **Stock reservation** — hold stock during checkout, release on timeout/cancellation
3. **Low-stock alerts** — admin notification when stock falls below threshold
4. **Bulk stock update** — CSV upload or multi-product form
5. **Admin inventory dashboard** — stock overview, movement history

---

## Backend Changes

### New Schema

```prisma
model StockMovement {
  id          String        @id @default(uuid())
  productId   String
  product     Product       @relation(fields: [productId], references: [id])
  quantity    Int           // positive = inbound, negative = outbound
  type        StockMoveType
  reason      String?       // e.g., "Order #QC-001", "Manual restock", "Damaged"
  referenceId String?       // orderId, adjustmentId, etc.
  balanceAfter Int          // stock level after this movement
  createdBy   String?       // userId of admin who made the change
  createdAt   DateTime      @default(now())
}

enum StockMoveType {
  SALE              // order placed
  SALE_REVERSAL     // order cancelled/refund
  RESTOCK           // new inventory received
  ADJUSTMENT        // manual correction
  RESERVATION       // held for pending payment
  RESERVATION_RELEASE // payment timeout
  DAMAGE            // damaged/lost
  RETURN            // customer return received
}

model StockReservation {
  id          String   @id @default(uuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id])
  quantity    Int
  expiresAt   DateTime // 30 minutes from creation
  released    Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model Product {
  // Add:
  lowStockThreshold  Int  @default(5)
  stockMovements     StockMovement[]
  reservations       StockReservation[]
}
```

### Stock Movement Service

```typescript
class InventoryService {
  // Core method — all stock changes go through this
  async recordMovement(params: {
    productId: string;
    quantity: number; // positive or negative
    type: StockMoveType;
    reason?: string;
    referenceId?: string;
    createdBy?: string;
  }): Promise<[StockMovement | undefined, Error?]> {
    // Transaction:
    // 1. Update Product.stock += quantity
    // 2. Create StockMovement with balanceAfter = new stock
    // 3. If new stock <= lowStockThreshold → enqueue low-stock alert
  }

  // Reservation flow
  async reserveStock(
    productId: string,
    quantity: number,
    orderId: string,
  ): Promise<[StockReservation?, Error?]>;
  async releaseReservation(reservationId: string): Promise<void>;
  async convertReservation(reservationId: string): Promise<void>; // reservation → sale

  // Bulk operations
  async bulkRestock(
    items: { productId: string; quantity: number; reason?: string }[],
    adminId: string,
  ): Promise<void>;
  async bulkAdjust(
    items: { productId: string; newStock: number; reason: string }[],
    adminId: string,
  ): Promise<void>;
}
```

### API Endpoints

#### `GET /v1/admin/inventory` (Admin)

```typescript
// Query: page, limit, search, lowStock (boolean), sortBy (stock_asc, stock_desc, name)
// Response
{
  data: {
    products: {
      id: string;
      name: string;
      sku: string;
      stock: number;
      lowStockThreshold: number;
      isLowStock: boolean;
      reservedQuantity: number;  // sum of active reservations
      availableQuantity: number; // stock - reserved
      lastRestocked: string;     // date of last RESTOCK movement
    }[];
    summary: {
      totalProducts: number;
      lowStockCount: number;
      outOfStockCount: number;
    };
    pagination: { ... };
  }
}
```

#### `GET /v1/admin/inventory/:productId/movements` (Admin)

```typescript
// Query: page, limit, type, startDate, endDate
// Response: paginated list of StockMovement records
```

#### `POST /v1/admin/inventory/restock` (Admin)

```typescript
// Request
{
  items: { productId: string; quantity: number; reason?: string }[];
}
```

#### `POST /v1/admin/inventory/adjust` (Admin)

```typescript
// Request — set absolute stock level
{
  items: {
    productId: string;
    newStock: number;
    reason: string;
  }
  [];
}
```

#### `PUT /v1/admin/products/:id/low-stock-threshold` (Admin)

```typescript
// Request
{
  threshold: number;
}
```

### Scheduled Job: Release Expired Reservations

```typescript
// Runs every 5 minutes (via BullMQ repeatable job)
async function releaseExpiredReservations() {
  const expired = await findReservations({
    expiresAt: { lt: new Date() },
    released: false,
  });
  for (const reservation of expired) {
    await inventoryService.releaseReservation(reservation.id);
    // This adds stock back and records a RESERVATION_RELEASE movement
  }
}
```

### Low-Stock Alert

When stock falls below threshold:

1. Enqueue notification job
2. Create admin notification (in-app)
3. Optional: send WhatsApp/email to admin

---

## Admin Frontend Changes

### New Page: `/admin/inventory`

**Dashboard view:**

- Summary cards: Total SKUs | Low Stock (amber) | Out of Stock (red)
- Table: Product | SKU | Stock | Reserved | Available | Threshold | Status | Last Restocked | Actions
- Status badges: In Stock (green), Low Stock (amber), Out of Stock (red)
- Quick actions: Adjust stock (inline), View history

**Filters:**

- Status: All / Low Stock / Out of Stock
- Search by name/SKU
- Category filter

### Stock Adjustment Modal

Click "Adjust" on any product:

```
Current Stock: 12
○ Add Stock (restock): [quantity input] Reason: [dropdown: New shipment | Return received | Other]
○ Set Stock (adjustment): [quantity input] Reason: [required text input]
[Save]
```

### Bulk Restock Page (`/admin/inventory/restock`)

**Option 1:** Multi-row form

- Table with: Product (searchable dropdown) | Quantity | Reason
- "Add Row" button
- Submit all at once

**Option 2:** CSV upload

```csv
sku,quantity,reason
QC-BR-001,50,Vendor shipment #V-2026-42
QC-SR-015,25,Vendor shipment #V-2026-42
```

### Stock Movement History (`/admin/inventory/:productId`)

Timeline view of all stock changes:

```
Apr 6, 2:30 PM  | -1 | SALE          | Order #QC-2026-27/00045  | Balance: 11
Apr 5, 10:00 AM | +25| RESTOCK       | Vendor shipment          | Balance: 12
Apr 4, 3:15 PM  | -2 | SALE          | Order #QC-2026-27/00044  | Balance: -13
Apr 3, 9:00 AM  | -1 | DAMAGE        | Packaging damage         | Balance: 15
```

### Navigation

Add "Inventory" to admin sidebar, with badge showing low-stock count.

---

## Order Flow Integration

### On Order Creation (after payment verified):

```typescript
// Convert reservation → sale
await inventoryService.convertReservation(reservationId);
// This records a SALE movement
```

### On Order Cancellation:

```typescript
// Reverse stock
for (const item of order.items) {
  await inventoryService.recordMovement({
    productId: item.productId,
    quantity: item.quantity, // positive = add back
    type: "SALE_REVERSAL",
    reason: `Order #${order.orderNumber} cancelled`,
    referenceId: order.id,
  });
}
```

### On Refund Approved (with item return):

```typescript
// Don't add stock back until item physically received
// Admin marks "item received" → triggers RETURN movement
```

---

## Testing Plan

- [ ] Restock → stock increases, movement recorded
- [ ] Order placed → stock decreases (SALE), movement recorded
- [ ] Order cancelled → stock restored (SALE_REVERSAL)
- [ ] Reservation created → available quantity decreases
- [ ] Reservation expired → stock released, movement recorded
- [ ] Reservation converted → becomes permanent SALE
- [ ] Low stock threshold breach → alert triggered
- [ ] Bulk restock → all products updated with individual movements
- [ ] Stock adjustment → absolute value set, movement with reason
- [ ] Movement history → accurate chronological ledger
- [ ] Concurrent orders on last item → only one succeeds (no overselling)

---

## Future Enhancements

- **Reorder point automation**: auto-generate purchase order when stock hits threshold
- **Multi-warehouse**: track stock per location
- **Forecasting**: predict restock needs based on sales velocity
- **Vendor integration**: auto-notify vendor at low stock
