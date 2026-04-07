# 01 — Razorpay Payment Integration

**Priority:** P0 — Launch Blocker
**Repos:** qalachowk-backend, qalachowk-frontend
**Estimated effort:** 3–5 days
**Dependencies:** None

---

## Problem

Checkout currently hardcodes `paymentId: "PAYMENT_ID_PLACEHOLDER"` and sets `paymentStatus: "PAID"` immediately. No real money flows. The platform cannot launch without a working payment gateway.

---

## Solution Overview

Integrate Razorpay's standard checkout flow:

1. **Backend creates a Razorpay Order** when the customer initiates checkout
2. **Frontend opens Razorpay Checkout modal** with the order ID
3. **Backend verifies payment** via webhook + signature verification
4. **Order status transitions** from PENDING → PROCESSING only after verified payment

Support: UPI, Cards, Net Banking, Wallets, EMI, COD (phase 2).

---

## Backend Changes (qalachowk-backend)

### New Dependencies

```bash
npm install razorpay
```

### Environment Variables

```
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
```

### New Module: `src/payments/`

Follow existing hexagonal structure:

```
src/payments/
├── api/
│   ├── controllers/v1/
│   │   ├── payments.controller.ts
│   │   └── dto/
│   │       └── payments.ts
│   └── router/v1/
│       └── payments.router.ts
├── application/
│   ├── payments.service.ts
│   └── payments.port.ts        # Repository interface
├── domain/
│   └── entities/
│       └── payment.entity.ts
└── infrastructure/
    └── razorpay/
        └── razorpay.repository.ts
```

### API Endpoints

#### `POST /v1/orders/create` (Modify existing)

**Current:** Creates order with `PAID` status immediately.
**Change:** Create order with `paymentStatus: PENDING`, then create Razorpay order.

```typescript
// Response changes
{
  data: {
    orderId: string;
    orderNumber: string;
    razorpayOrderId: string; // NEW — frontend needs this
    amount: number; // in paise
    currency: "INR";
    key: string; // RAZORPAY_KEY_ID (public)
  }
}
```

#### `POST /v1/payments/verify` (New)

Called by frontend after Razorpay checkout success.

```typescript
// Request
{
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Response
{
  data: {
    orderId: string;
    paymentStatus: "PAID";
    orderStatus: "PROCESSING";
  }
}
```

**Logic:**

1. Verify signature: `HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, RAZORPAY_KEY_SECRET)`
2. If valid → update order: `paymentStatus = PAID`, `paymentId = razorpay_payment_id`, `status = PROCESSING`
3. Capture `gatewayFee` and `gatewayFeeRate` from Razorpay payment details API
4. Trigger order confirmation notification
5. If invalid → return 400, order stays PENDING

#### `POST /v1/payments/webhook` (New)

Razorpay server-to-server webhook for reliability.

```typescript
// Handles events:
// - payment.captured → mark PAID if not already
// - payment.failed → mark FAILED, notify user
// - refund.processed → update refund status
```

**Logic:**

1. Verify webhook signature using `RAZORPAY_WEBHOOK_SECRET`
2. Idempotent processing (check if already handled via `paymentId`)
3. No auth middleware — use webhook secret verification instead
4. Rate limit: 10 req/s from Razorpay IPs

### Schema Changes (prisma)

```prisma
model Order {
  // Add:
  razorpayOrderId    String?   @unique
  paymentAttempts    Int       @default(0)
  paymentFailReason  String?
}
```

### Order Service Changes

- `createOrder()`: Create Razorpay order via SDK, store `razorpayOrderId`
- Remove immediate `paymentStatus: PAID` — default to `PENDING`
- Add `verifyPayment()` method
- Add `handleWebhookEvent()` method

### Stock Reservation

- On order creation: **reserve stock** (decrement `stock`, track reservation)
- On payment failure after 30 min: **release stock** (needs job queue — see doc 09; for now, use a cron-like check)
- On payment success: reservation becomes permanent

---

## Frontend Changes (qalachowk-frontend)

### New Dependency

```bash
yarn add razorpay   # Only for types; SDK loaded via script tag
```

### Checkout Flow Rewrite (`src/app/checkout/page.tsx`)

**Current flow:**

1. User fills form → Submit → `createOrder()` → Redirect to order-confirmed

**New flow:**

1. User fills form → Submit → `createOrder()` → Receive `razorpayOrderId`
2. Open Razorpay Checkout modal
3. On success → `POST /v1/payments/verify` → Redirect to order-confirmed
4. On failure → Show error, allow retry
5. On dismiss → Show "complete payment" prompt, order stays PENDING

```typescript
// Razorpay checkout options
const options = {
  key: response.key,
  amount: response.amount,
  currency: response.currency,
  name: "Qala Chowk",
  description: `Order #${response.orderNumber}`,
  order_id: response.razorpayOrderId,
  prefill: {
    contact: user.phone,
    email: checkoutData.email,
  },
  theme: {
    color: "#6A2901", // brand primary
  },
  handler: async (razorpayResponse) => {
    // Verify with backend
    const result = await verifyPayment(razorpayResponse);
    if (result.data) {
      router.push(`/order-confirmed?orderId=${result.data.orderId}`);
    }
  },
  modal: {
    ondismiss: () => {
      // Show "payment incomplete" state
    },
  },
};

const razorpay = new window.Razorpay(options);
razorpay.open();
```

### Load Razorpay Script

Add to `src/app/layout.tsx` or checkout page:

```tsx
<Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="lazyOnload"
/>
```

### GA Events

```typescript
sendGAEvent("purchase", {
  transaction_id: orderId,
  value: total,
  currency: "INR",
  items: cartItems.map(...)
});
```

### Pending Payment State

Add a "Complete Payment" banner on `/order-details` for orders with `paymentStatus: PENDING`. Allow re-initiating Razorpay checkout with the same `razorpayOrderId`.

---

## Testing Plan

### Backend

- [ ] Unit: `verifyPayment()` with valid/invalid signatures
- [ ] Unit: Webhook handler with all event types
- [ ] Unit: Stock reservation and release
- [ ] Functional: Full order creation → payment verify → status update flow
- [ ] Functional: Webhook idempotency (same event twice)

### Frontend

- [ ] Manual: Complete checkout with test card
- [ ] Manual: Payment failure → retry flow
- [ ] Manual: Modal dismiss → pending payment → complete later
- [ ] Manual: UPI payment flow on mobile

### Razorpay Test Mode

- Use `rzp_test_` key prefix for staging
- Test cards: `4111 1111 1111 1111` (success), `4000 0000 0000 0002` (failure)
- Test UPI: `success@razorpay`

---

## Rollout Plan

1. Implement backend payment module with test keys
2. Wire up frontend checkout with Razorpay modal
3. Test end-to-end on staging with test credentials
4. Configure Razorpay webhook URL in Razorpay Dashboard → `{BACKEND_URL}/v1/payments/webhook`
5. Switch to live keys, enable on production
6. Monitor first 10 orders manually

---

## Future: COD Support (Phase 2)

- Add `paymentMethod: "COD"` option in checkout
- Backend skips Razorpay order creation, sets `paymentStatus: COD_PENDING`
- Order moves to PROCESSING immediately
- Admin marks `paymentStatus: PAID` on delivery confirmation
- COD fee (optional): configurable surcharge (e.g., ₹50)
