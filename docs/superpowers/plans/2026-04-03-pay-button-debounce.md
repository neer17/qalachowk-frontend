# Pay Button In-Flight Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent duplicate order creation by disabling the "Place Order" button and showing a loading label while `handlePayNow` is in flight.

**Architecture:** Add a single `isPlacingOrder` boolean state to `checkout/page.tsx`. Set it to `true` at the start of `handlePayNow` and reset it in a `finally` block so it always resets on success, error, or throw. Disable the button and swap its label while the state is true.

**Tech Stack:** React `useState`, Next.js App Router, CSS Modules

---

## File Map

| File                               | Change                                                                                                                            |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/checkout/page.tsx`        | Add `isPlacingOrder` state; add guard + `finally` to `handlePayNow`; add `disabled` prop and label swap to the Place Order button |
| `src/app/checkout/page.module.css` | Add `:disabled` rule to `.placeOrderBtn`                                                                                          |

---

### Task 1: Add `isPlacingOrder` state and guard `handlePayNow`

**Files:**

- Modify: `src/app/checkout/page.tsx`

- [ ] **Step 1: Add the `isPlacingOrder` state**

  In `src/app/checkout/page.tsx`, find the existing state declarations near the top of the `Checkout` component (around line 31). Add after `const [selectedPayment, setSelectedPayment] = useState<string>("upi");`:

  ```ts
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  ```

- [ ] **Step 2: Wrap `handlePayNow` with guard + `finally`**

  The current `handlePayNow` function starts at line 309. Replace the function signature and opening with the guarded version. The full new function body:

  ```ts
  const handlePayNow = async (data: DeliveryFormValues) => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    try {
      const {
        shippingFirstName,
        shippingLastName,
        email,
        shippingAddress,
        shippingLandmark,
        shippingCity,
        shippingState,
        shippingPhone,
        shippingPinCode,
        billingFirstName,
        billingLastName,
        billingAddress,
        billingLandmark,
        billingCity,
        billingState,
        billingPinCode,
        billingPhone,
        useDifferentBilling,
      } = data;

      const shippingAddressObj = {
        firstName: shippingFirstName,
        lastName: shippingLastName,
        address: shippingAddress!,
        city: shippingCity!,
        street: shippingLandmark,
        state: shippingState || "",
        country: ACTIVE_COUNTRIES.INDIA,
        pinCode: shippingPinCode || "",
        phone: shippingPhone,
      };
      let billingAddressObj;
      if (useDifferentBilling === true) {
        billingAddressObj = {
          firstName: billingFirstName!,
          lastName: billingLastName!,
          address: billingAddress!,
          city: billingCity!,
          street: billingLandmark || "",
          state: billingState!,
          country: ACTIVE_COUNTRIES.INDIA,
          pinCode: billingPinCode!,
          phone: billingPhone!,
        };
      }

      let userIdForOrder: string;

      if (authUser) {
        userIdForOrder = authUser.id;
      } else {
        let createdUser: CreateUserResponse;
        try {
          createdUser = await createUser({
            firstName: shippingFirstName,
            lastName: shippingLastName,
            phone: shippingPhone,
          });

          await login(
            {
              userId: createdUser.userId!,
              firstName: createdUser.firstName || shippingFirstName,
              lastName: createdUser.lastName || shippingLastName,
              phone: shippingPhone,
            },
            "phone",
          );
        } catch (error) {
          console.error("Error in user creation: ", { error });
          notifications.show({
            title: "Error",
            message: "Failed to save your details. Please try again.",
            color: "red",
            position: "top-right",
          });
          return;
        }
        userIdForOrder = createdUser!.userId!;
      }

      const cartValues = cartData.values();

      const items: { productId: string; quantity: number }[] = [];
      cartValues.forEach(({ id, quantity }) => {
        items.push({
          productId: id,
          quantity,
        });
      });

      const orderData = {
        userId: userIdForOrder,
        items,
        paymentId: "PAYMENT_ID_PLACEHOLDER",
        email: email,
        ...(appliedDiscountResponse?.isValid && {
          discountCode: appliedDiscountCode,
        }),
        paymentMethod: "PREPAID" as const,
        paymentStatus: "PAID" as const,
        shippingAddress: {
          address: shippingAddressObj.address,
          city: shippingAddressObj.city,
          state: shippingAddressObj.state,
          country: shippingAddressObj.country,
          pinCode: shippingAddressObj.pinCode,
        },
        ...(useDifferentBilling === true && {
          billingAddress: {
            address: billingAddressObj!.address,
            city: billingAddressObj!.city,
            state: billingAddressObj!.state,
            country: billingAddressObj!.country,
            pinCode: billingAddressObj!.pinCode,
          },
        }),
      };

      const orderDetails = await OrderService.createOrder(orderData);
      const orderId = orderDetails.orderId;

      await clearCart();
      router.push(`/order-confirmed?orderId=${orderId}`);
    } catch (error) {
      console.error("Error in order creation: ", { error });
      notifications.show({
        title: "Error",
        message: "Failed to place your order. Please try again.",
        color: "red",
        position: "top-right",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };
  ```

  > Note: The original function had two separate try/catch blocks for user creation and order creation. This consolidates them under one outer try/catch + finally. The user-creation error path still returns early (via `return` inside the inner try/catch) before the order creation block, preserving the original error toast behaviour.

---

### Task 2: Update the Place Order button

**Files:**

- Modify: `src/app/checkout/page.tsx`

- [ ] **Step 1: Add `disabled` prop and loading label to the button**

  Find the Place Order button (around line 648). Replace it with:

  ```tsx
  <button
    className={styles.placeOrderBtn}
    onClick={handleFormSubmit}
    aria-label="Place Order"
    disabled={isPlacingOrder}
  >
    {isPlacingOrder ? (
      "Placing Order..."
    ) : (
      <>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          aria-hidden="true"
        >
          <path d="M7 1L1 4v6l6 3 6-3V4L7 1z" />
        </svg>
        Place Order · Pay <Rupee />
        {total.toLocaleString("en-IN")}
      </>
    )}
  </button>
  ```

---

### Task 3: Add disabled CSS

**Files:**

- Modify: `src/app/checkout/page.module.css`

- [ ] **Step 1: Add `:disabled` rule after `.placeOrderBtn:hover`**

  Find the `.placeOrderBtn:hover` rule (around line 305). Add immediately after it:

  ```css
  .placeOrderBtn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  ```

---

### Task 4: Verify and commit

- [ ] **Step 1: Run the build to confirm no TypeScript errors**

  ```bash
  yarn build
  ```

  Expected: build completes with no errors (warnings about `<img>` and exhaustive-deps are pre-existing and acceptable).

- [ ] **Step 2: Manual smoke test checklist**

  In dev (`yarn dev`):
  1. Fill out the checkout form fully (valid phone, OTP verified or logged in).
  2. Click "Place Order" once — button should immediately show "Placing Order..." and be unclickable.
  3. Click "Place Order" rapidly 3–4 times — only one order request fires (verify in Network tab: a single POST to the orders endpoint).
  4. Simulate failure by temporarily returning a 500 from the backend — button re-enables and the error toast appears after the failure.

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/checkout/page.tsx src/app/checkout/page.module.css
  git commit -m "feat: add in-flight guard to Place Order button to prevent duplicate orders"
  ```
