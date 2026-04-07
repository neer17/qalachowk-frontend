# 10 — Shipping Provider Integration

**Priority:** P2 — Operations & Scale
**Repos:** qalachowk-backend, qalachowk-admin-frontend
**Estimated effort:** 4–5 days
**Dependencies:** 09-job-queue-infra.md (for webhook processing)

---

## Problem

Shipping is entirely manual. Admin enters tracking numbers by hand, customers get a link to India Post's generic tracking page. No rate calculation, no label generation, no real-time status updates. This doesn't scale beyond 5–10 orders/day.

---

## Solution Overview

Integrate with **Shiprocket** (India's largest shipping aggregator) to get:

- Multi-carrier rate comparison (India Post, Delhivery, BlueDart, DTDC, etc.)
- Automatic label & AWB generation
- Real-time tracking webhooks
- Pickup scheduling
- RTO (Return to Origin) handling
- COD remittance tracking

### Why Shiprocket (vs direct carrier integration)

| Option           | Pros                                             | Cons                                |
| ---------------- | ------------------------------------------------ | ----------------------------------- |
| **Shiprocket**   | 17+ carriers, one API, dashboard, COD management | ~₹25–30/order platform fee          |
| Direct Delhivery | Cheaper per shipment                             | Single carrier, more code           |
| Shipway          | Good tracking                                    | Less carrier coverage               |
| ClickPost        | Enterprise-grade                                 | Expensive, overkill for early stage |

Shiprocket is the pragmatic choice: one integration, all major Indian carriers, and a free tier for < 5 orders/day.

---

## Backend Changes

### New Module: `src/shipping/`

```
src/shipping/
├── api/
│   ├── controllers/v1/
│   │   ├── shipping.controller.ts
│   │   ├── admin.shipping.controller.ts
│   │   └── dto/
│   │       └── shipping.ts
│   └── router/v1/
│       ├── shipping.router.ts
│       └── admin.router.ts
├── application/
│   ├── shipping.service.ts
│   └── shipping.port.ts
└── infrastructure/
    └── shiprocket/
        └── shiprocket.repository.ts
```

### Environment Variables

```
SHIPROCKET_EMAIL=admin@qalachowk.com
SHIPROCKET_PASSWORD=xxxxx
SHIPROCKET_WEBHOOK_SECRET=xxxxx
```

### Shiprocket API Integration

#### Auth

Shiprocket uses email/password → JWT token (valid 10 days). Cache token in Redis.

#### Key API Calls

**1. Rate Calculation**

```typescript
async getShippingRates(params: {
  pickupPincode: string;     // warehouse pincode
  deliveryPincode: string;   // customer pincode
  weight: number;            // grams
  codAmount?: number;        // if COD
}): Promise<ShippingRate[]>

// Returns: array of { courierId, courierName, estimatedDays, rate, codCharges }
```

**2. Create Shipment**

```typescript
async createShipment(order: {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: Address;
  items: { name: string; sku: string; quantity: number; price: number; weight: number }[];
  paymentMethod: "prepaid" | "cod";
  subTotal: number;
  weight: number;
  courierId?: number;        // preferred carrier, or auto-select
}): Promise<{
  shiprocketOrderId: number;
  shipmentId: number;
  awbCode: string;           // tracking number
  courierName: string;
  labelUrl: string;          // shipping label PDF
  manifestUrl: string;
}>
```

**3. Track Shipment**

```typescript
async trackShipment(awbCode: string): Promise<TrackingEvent[]>

// Returns: array of { date, status, location, description }
```

**4. Cancel Shipment**

```typescript
async cancelShipment(shiprocketOrderId: number): Promise<void>
```

**5. Schedule Pickup**

```typescript
async schedulePickup(shipmentId: number, pickupDate: string): Promise<void>
```

### Schema Changes

```prisma
model Order {
  // Add:
  shiprocketOrderId    Int?
  shipmentId           Int?
  awbCode              String?
  courierName          String?
  labelUrl             String?
  shippingRate         Decimal?    @db.Decimal(10, 2)
  estimatedDeliveryDate DateTime?
}

model ShippingEvent {
  id          String   @id @default(uuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id])
  status      String   // "pickup_scheduled", "in_transit", "out_for_delivery", "delivered", "rto"
  location    String?
  description String?
  eventDate   DateTime
  rawPayload  Json?
  createdAt   DateTime @default(now())
}
```

### API Endpoints

#### `GET /v1/shipping/rates` (Authenticated)

Calculate shipping for customer's pincode during checkout.

```typescript
// Query: pincode, weight (derived from cart)
// Response: { rates: ShippingRate[] }
```

#### `POST /v1/admin/orders/:id/ship` (Admin)

Create shipment, generate label, get AWB.

```typescript
// Request
{ courierId?: number }  // optional carrier preference

// Response
{
  data: {
    awbCode: string;
    courierName: string;
    labelUrl: string;
    estimatedDelivery: string;
  }
}
```

#### `POST /v1/admin/orders/:id/schedule-pickup` (Admin)

```typescript
// Request
{
  pickupDate: string;
} // ISO date
```

#### `GET /v1/orders/:id/tracking` (Authenticated)

Returns tracking events for customer view.

```typescript
{
  data: {
    awbCode: string;
    courierName: string;
    currentStatus: string;
    estimatedDelivery: string;
    events: TrackingEvent[];
  }
}
```

#### `POST /v1/shipping/webhook` (Shiprocket webhook)

Receives status updates from Shiprocket.

```typescript
// Events: pickup_generated, in_transit, out_for_delivery, delivered, rto_initiated, rto_delivered
// Logic:
// 1. Verify webhook signature
// 2. Find order by awbCode
// 3. Create ShippingEvent record
// 4. Update order status if applicable (SHIPPED → DELIVERED)
// 5. Send customer notification (via job queue)
```

---

## Admin Frontend Changes

### Order Detail — Shipping Section

Replace manual tracking input with:

**Before shipping:**

```
[Ship Order] button
  → Select carrier (dropdown with rates: "Delhivery - ₹65 - 3-5 days", etc.)
  → [Create Shipment]
  → Shows: AWB code, label download link
  → [Schedule Pickup] with date picker
```

**After shipping:**

```
Carrier: Delhivery
AWB: 12345678901234
Status: In Transit
Estimated Delivery: Apr 8, 2026

[Download Label] [Track on Carrier Site]

Timeline:
● Shipment Created (Apr 2, 10:00 AM)
● Picked Up (Apr 2, 2:00 PM, Jaipur)
● In Transit (Apr 3, 6:00 AM, Mumbai Hub)
○ Out for Delivery
○ Delivered
```

### Bulk Shipping

On orders list page, add "Ship Selected" bulk action:

1. Select multiple PROCESSING orders
2. Click "Ship All"
3. Auto-create shipments for all (cheapest carrier or preferred)
4. Show success/failure per order

---

## Checkout Flow — Shipping Rate Display

On checkout page, after customer enters pincode:

```
Shipping to 302017 (Jaipur, Rajasthan)
○ Standard Delivery (3-5 days) — ₹65
○ Express Delivery (1-2 days) — ₹120
○ Free Shipping (5-7 days) — ₹0 [orders above ₹999]
```

Free shipping threshold: configurable (e.g., ₹999).

---

## Testing Plan

- [ ] Rate calculation → returns multiple carrier options
- [ ] Create shipment → AWB generated, label URL returned
- [ ] Schedule pickup → pickup confirmed
- [ ] Webhook: in_transit → ShippingEvent created, order status updated
- [ ] Webhook: delivered → order status → DELIVERED, notification sent
- [ ] Cancel shipment → Shiprocket order cancelled
- [ ] Customer tracking → shows timeline of events
- [ ] Bulk shipping → processes multiple orders
- [ ] Free shipping threshold → applies correctly at checkout

---

## Cost Analysis

- Shiprocket platform: Free (< 5 orders/day) or ₹20-30/order
- Average shipping cost: ₹50–100 per order (depends on weight/distance)
- Pass to customer or absorb above threshold (₹999)

---

## Future Enhancements

- **Auto-ship**: automatically create shipment when order moves to PROCESSING
- **Warehouse management**: multi-origin shipping
- **International shipping**: Shiprocket supports it but needs customs/duty handling
- **Return shipment**: auto-create return label when return approved
