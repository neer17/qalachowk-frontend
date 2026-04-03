# Pay Button In-Flight Guard — Design Spec

**Date:** 2026-04-03
**Scope:** `src/app/checkout/page.tsx` only

---

## Problem

The "Place Order" button in the checkout page has no protection against repeated clicks. `handlePayNow` chains async calls (`createUser` → `login` → `createOrder`), each of which can take several seconds. A second click during that window sends duplicate API requests, potentially creating duplicate orders.

## Goal

Block all subsequent clicks on the "Place Order" button from the moment it is first clicked until the submission resolves (success or error). Give the user immediate visual feedback that the submission is in progress.

## Non-goals

- Timeout-based debounce (delayed execution) — not applicable to a payment button
- Changes to `CheckoutForm.tsx` — the guard fires at the `handlePayNow` boundary, so the form layer is unaffected
- New hooks, utilities, or abstractions

---

## Design

### State

Add one boolean flag to `checkout/page.tsx`:

```ts
const [isPlacingOrder, setIsPlacingOrder] = useState(false);
```

### `handlePayNow` guard

Wrap the entire body with a guard check and a `finally` reset:

```ts
const handlePayNow = async (data: DeliveryFormValues) => {
  if (isPlacingOrder) return; // hard guard against in-flight re-entry
  setIsPlacingOrder(true);
  try {
    // ... existing logic unchanged ...
  } finally {
    setIsPlacingOrder(false); // resets on success, error, or throw
  }
};
```

The `finally` block guarantees the button re-enables regardless of outcome.

### Button changes

The "Place Order" button (`page.tsx:648`) receives:

1. `disabled={isPlacingOrder}` — prevents click events at the DOM level
2. Label swap while loading:
   - Normal: `Place Order · Pay ₹{total}`
   - Loading: `Placing Order...`

No new CSS class is needed. A `&:disabled { opacity: 0.6; cursor: not-allowed; }` rule will be added to `page.module.css` under `.placeOrderBtn` if one does not already exist.

---

## Files changed

| File                               | Change                                                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/app/checkout/page.tsx`        | Add `isPlacingOrder` state; wrap `handlePayNow` with guard + finally; add `disabled` + label swap to button |
| `src/app/checkout/page.module.css` | Add `&:disabled` style to `.placeOrderBtn` if missing                                                       |

---

## Error handling

- If any step in `handlePayNow` throws, the existing `notifications.show(...)` error toasts fire as before.
- The `finally` block resets `isPlacingOrder` to `false` after the error toast, so the user can retry.

## Testing

- Click "Place Order" once — button becomes disabled and shows "Placing Order..."
- Click "Place Order" rapidly — only one order is created
- Simulate API failure — button re-enables after the error toast, allowing retry
