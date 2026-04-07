# 07 — Abandoned Cart Recovery

**Priority:** P1 — Revenue & Conversion
**Repos:** qalachowk-backend, qalachowk-frontend
**Estimated effort:** 3–4 days
**Dependencies:** 09-job-queue-infra.md (for scheduled jobs), 12-notifications-overhaul.md (for WhatsApp/email)

---

## Problem

Cart data lives in IndexedDB on the client. If a user adds items and leaves, there's no way to reach them. Industry average cart abandonment is ~70%. For a niche handicraft brand, recovering even 5–10% of abandoned carts could be a significant revenue lift.

---

## Solution Overview

1. **Server-side cart persistence** for logged-in users (already partially exists — `Cart` model in schema)
2. **Cart sync**: client IndexedDB ↔ server cart on login
3. **Abandonment detection**: flag carts inactive for >1 hour with items
4. **Recovery nudges**: WhatsApp message at 1 hour, email at 24 hours
5. **Recovery link**: deep link back to cart with items restored

---

## Backend Changes

### Enhance Cart Endpoints

The `Cart` and `CartItem` models exist in schema. The backend has basic `/v1/cart` endpoints. Extend them:

#### `POST /v1/cart/sync` (New)

Merge client-side cart with server-side cart on login.

```typescript
// Request
{
  items: {
    productId: string;
    quantity: number;
  }
  [];
}

// Logic:
// 1. Fetch server cart for user
// 2. For each client item:
//    - If product exists in server cart → use max(client qty, server qty)
//    - If not in server cart → add
// 3. Return merged cart
// 4. Frontend replaces IndexedDB with merged result
```

#### `GET /v1/cart` (Enhance)

Return cart with product details (name, price, image, stock) for recovery emails.

### Abandoned Cart Detection

#### New Model

```prisma
model CartReminder {
  id          String   @id @default(uuid())
  cartId      String
  cart        Cart     @relation(fields: [cartId], references: [id])
  userId      String
  channel     String   // "whatsapp" | "email"
  stage       Int      // 1 = 1hr, 2 = 24hr
  sentAt      DateTime
  clickedAt   DateTime?
  convertedAt DateTime?  // placed order
  recoveryToken String @unique  // for deep link
}
```

#### Background Job: `checkAbandonedCarts` (runs every 15 min)

```typescript
// Pseudo-code
async function checkAbandonedCarts() {
  // Stage 1: carts inactive 1–2 hours, no stage 1 reminder sent
  const stage1Carts = await findCarts({
    lastUpdated: { lt: 1_hour_ago, gt: 2_hours_ago },
    isFulfilled: false,
    hasItems: true,
    noReminder: { stage: 1 },
  });

  for (const cart of stage1Carts) {
    const user = await getUser(cart.userId);
    if (user.phone) {
      await sendWhatsAppReminder(user, cart, 1);
    }
  }

  // Stage 2: carts inactive 24+ hours, no stage 2 reminder sent
  const stage2Carts = await findCarts({
    lastUpdated: { lt: 24_hours_ago },
    isFulfilled: false,
    hasItems: true,
    noReminder: { stage: 2 },
  });

  for (const cart of stage2Carts) {
    const user = await getUser(cart.userId);
    await sendEmailReminder(user, cart, 2);
  }
}
```

### Recovery Link

Generate a unique `recoveryToken` per reminder. Link format:

```
https://qalachowk.com/cart?recover={recoveryToken}
```

Backend endpoint: `GET /v1/cart/recover/:token`

- Validates token
- Returns cart items
- Marks `clickedAt` timestamp
- If user places order, mark `convertedAt`

### MSG91 Templates

**WhatsApp (Stage 1 — 1 hour):**

```
Hi {firstName}! 👋

You left some beautiful pieces in your cart at Qala Chowk:
{item1Name} - ₹{item1Price}
{item2Name} - ₹{item2Price}

Complete your order before they're gone:
{recoveryLink}

— Team Qala Chowk
```

**Email (Stage 2 — 24 hours):**

```
Subject: Your handcrafted picks are waiting, {firstName}

[Product images]

You left {itemCount} item(s) in your cart worth ₹{totalValue}.
Handcrafted pieces are limited — don't miss out.

[Complete Your Order →]

Use code COMEBACK10 for 10% off (valid 48 hours)
```

---

## Frontend Changes

### Cart Sync on Login

In `CartContext.tsx`, after successful login:

```typescript
const syncCart = async () => {
  const localItems = await getCartFromIDB();
  const { data } = await cartService.syncCart(localItems);
  if (data) {
    await setCartInIDB(data.items); // replace local with merged
    setCartData(data.items);
  }
};
```

### Recovery Link Handler

In `/cart/page.tsx`, check for `?recover=` param:

```typescript
const searchParams = useSearchParams();
const recoveryToken = searchParams.get("recover");

useEffect(() => {
  if (recoveryToken) {
    recoverCart(recoveryToken).then((data) => {
      if (data?.items) {
        setCartInIDB(data.items);
        setCartData(data.items);
      }
    });
  }
}, [recoveryToken]);
```

### Cart Updated Timestamp

Track `lastUpdated` locally and send to server on cart changes:

```typescript
const updateCart = async (items) => {
  await setCartInIDB(items);
  setCartData(items);
  // If logged in, sync to server
  if (user) {
    await cartService.updateCart(items);
  }
};
```

---

## Analytics

Track in GA4 and admin dashboard:

- Cart abandonment rate
- Recovery message sent count
- Recovery link click rate
- Recovery conversion rate
- Revenue recovered

Admin dashboard widget: "₹{X} recovered from abandoned carts this month"

---

## Testing Plan

- [ ] Cart sync on login → merges correctly (no duplicates, max quantity)
- [ ] Recovery link → restores cart items
- [ ] Stage 1 WhatsApp → sent after 1 hour of inactivity
- [ ] Stage 2 email → sent after 24 hours
- [ ] No duplicate reminders → same stage not sent twice
- [ ] Fulfilled cart → no reminders sent
- [ ] Empty cart → no reminders sent
- [ ] Recovery conversion tracking → order linked to reminder

---

## Privacy & Compliance

- Only send reminders to users who have interacted with the platform (implicit consent via account creation)
- Include unsubscribe/opt-out link in emails
- Respect DND hours (no WhatsApp between 9 PM – 9 AM IST)
- CartReminder data retained for 90 days, then purged
