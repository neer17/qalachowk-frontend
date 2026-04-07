# 08 — Order Self-Service (Cancel / Return / Track)

**Priority:** P1 — Revenue & Conversion
**Repos:** qalachowk-frontend (major), qalachowk-backend (minor)
**Estimated effort:** 2–3 days
**Dependencies:** None (backend cancel/refund endpoints exist)

---

## Problem

The storefront's `/order-details` page shows order info but offers no self-service actions. Customers cannot:

- Cancel a pending order
- Request a return/refund
- Track their shipment in real-time
- Download their invoice

All of these require contacting support. This creates friction and support overhead.

---

## Solution Overview

Add self-service capabilities to the order details page:

1. **Cancel order** — for PENDING/PROCESSING orders
2. **Request return** — for DELIVERED orders within return window
3. **Track shipment** — real-time tracking embed/link
4. **Download invoice** — PDF download

---

## Backend: Verify Existing Endpoints

### Already Available

- `POST /v1/orders/cancel` — Cancel order (needs `orderId` + `reason`)
- `POST /v1/orders/refund` — Request refund (needs `orderId`, `reason`, items)
- `GET /v1/orders` — List user's orders
- Invoice generation exists (invoiceUrl on Order model)

### Minor Additions

#### `GET /v1/orders/:id/tracking` (New)

Returns tracking info for frontend display.

```typescript
// Response
{
  data: {
    trackingNumber: string | null;
    shippingProvider: string | null; // "india_post" | "delhivery" | "bluedart" etc.
    trackingUrl: string | null; // constructed URL
    status: string; // current shipping status if available
    estimatedDelivery: string | null; // ISO date
  }
}
```

Tracking URL construction:

```typescript
const trackingUrls: Record<string, (num: string) => string> = {
  india_post: (n) =>
    `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx?search=${n}`,
  delhivery: (n) => `https://www.delhivery.com/track/package/${n}`,
  bluedart: (n) =>
    `https://www.bluedart.com/tracking?handler=tref&amp;tracknumbers=${n}`,
  dtdc: (n) => `https://www.dtdc.in/trace.asp?stession=&amp;stression=${n}`,
};
```

#### `GET /v1/orders/:id/invoice` (New or verify existing)

Returns invoice PDF URL or generates on demand.

---

## Frontend Changes

### Order Details Page Enhancement (`/order-details`)

#### Order Status Timeline

Replace static status text with a visual timeline:

```
● Order Placed (Apr 1, 2:30 PM)
│
● Processing (Apr 1, 4:00 PM)
│
● Shipped (Apr 2, 10:00 AM)
│  Tracking: EE123456789IN
│
○ Out for Delivery (estimated Apr 5)
│
○ Delivered
```

Component: `OrderStatusTimeline.tsx`

#### Action Buttons (conditional)

| Order Status              | Available Actions                               |
| ------------------------- | ----------------------------------------------- |
| PENDING                   | Cancel Order                                    |
| PROCESSING                | Cancel Order (with warning: "may have shipped") |
| SHIPPED                   | Track Shipment                                  |
| DELIVERED (within 7 days) | Request Return, Download Invoice                |
| DELIVERED (after 7 days)  | Download Invoice                                |
| CANCELLED                 | —                                               |
| RETURNED                  | View Refund Status                              |

#### Cancel Order Flow

```
[Cancel Order] button
  → Modal: "Are you sure?"
    - Reason dropdown: "Changed my mind" | "Found cheaper" | "Ordered by mistake" | "Other"
    - Optional text field for details
    - [Confirm Cancellation] / [Keep Order]
  → API call: POST /v1/orders/cancel
  → Success: toast + refresh page (status updates)
  → Error: toast with error message
```

Rules:

- Cannot cancel if status is SHIPPED or later
- Show warning for PROCESSING: "Your order may have already been dispatched"

#### Request Return Flow

```
[Request Return] button
  → Modal/Page: Select items to return
    - Checkboxes for each order item
    - Quantity selector per item (if qty > 1)
    - Reason dropdown: "Defective" | "Wrong item" | "Not as described" | "Size issue" | "Other"
    - Description textarea
    - Photo upload (optional, recommended for defective items)
    - [Submit Return Request] / [Cancel]
  → API call: POST /v1/orders/refund
  → Success: "Return request submitted. We'll review within 24 hours."
```

Rules:

- Only available for DELIVERED orders
- Return window: 7 days from delivery (configurable constant)
- Items already refunded are excluded

#### Track Shipment

```
[Track Shipment] button
  → Opens tracking URL in new tab
  → OR embedded tracking widget (if provider supports iframe)
```

Show tracking number with copy-to-clipboard button.

#### Download Invoice

```
[Download Invoice] button
  → Fetch invoice URL from order data
  → Open in new tab (PDF) or trigger download
  → If no invoice yet: "Invoice will be available after order is shipped"
```

### Order List Page Enhancement (`/order-details` list view)

Add quick-action badges:

- PENDING/PROCESSING orders: "Cancel" link
- SHIPPED orders: "Track" link
- DELIVERED orders: "Return" link (if within window)

---

## Components

```
src/components/orders/
├── OrderStatusTimeline.tsx    # Visual status progression
├── CancelOrderModal.tsx       # Cancellation confirmation
├── ReturnRequestForm.tsx      # Item selection + reason
└── TrackingInfo.tsx           # Tracking number + link
```

---

## Testing Plan

- [ ] Cancel PENDING order → status changes to CANCELLED
- [ ] Cancel PROCESSING order → status changes with warning shown
- [ ] Cancel SHIPPED order → rejected with error
- [ ] Request return on DELIVERED order → refund created with PENDING status
- [ ] Request return after 7 days → rejected
- [ ] Request return for already-refunded item → item excluded
- [ ] Track shipment → opens correct tracking URL
- [ ] Download invoice → PDF opens/downloads
- [ ] Timeline → shows correct status progression with timestamps

---

## Future Enhancements

- **Real-time tracking**: Integrate with shipping provider APIs for live status (see doc 10)
- **Return label generation**: Auto-generate prepaid return shipping label
- **Exchange flow**: "Exchange" option alongside "Return" for size/color swaps
- **Order modification**: Change address before shipment
