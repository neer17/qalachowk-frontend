# 06 — Coupon & Discount Management (Admin)

**Priority:** P1 — Revenue & Conversion
**Repos:** qalachowk-backend (minor), qalachowk-admin-frontend (major)
**Estimated effort:** 2–3 days
**Dependencies:** None (Coupon model and discount application already exist)

---

## Problem

Backend already has a `Coupon` model and `POST /v1/products/discounts/apply` endpoint. Storefront has a discount code input in checkout. But there's no way for admins to create, edit, or manage coupons — they must be inserted directly in the database.

---

## Solution Overview

Build admin CRUD for coupons with analytics on usage.

---

## Backend: New Endpoints

### `GET /v1/admin/coupons`

```typescript
// Query params
{ page?, limit?, status?: "active" | "expired" | "disabled", search?: string }

// Response
{
  data: Coupon[];
  pagination: { page, limit, total, totalPages };
}
```

### `GET /v1/admin/coupons/:id`

Full coupon detail with usage statistics.

```typescript
{
  data: {
    ...Coupon,
    stats: {
      totalUsed: number;
      totalDiscountGiven: string;  // sum of discount amounts
      recentOrders: { orderId: string; orderNumber: string; discountAmount: string; date: string }[];
    }
  }
}
```

### `POST /v1/admin/coupons`

```typescript
{
  code: string;                    // uppercase, alphanumeric + hyphens
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;           // percentage (e.g., 10) or fixed amount (e.g., 200)
  minPurchase?: number;            // minimum cart value
  maxDiscount?: number;            // cap for percentage discounts
  startDate?: string;              // ISO date, default now
  endDate?: string;                // ISO date, null = no expiry
  usageLimit?: number;             // total uses allowed, null = unlimited
  isActive: boolean;               // default true
  applicableProducts?: string[];   // product IDs, empty = all products
  applicableCategories?: string[]; // category IDs, empty = all categories
}
```

### `PUT /v1/admin/coupons/:id`

Update any field. Cannot change `code` after creation (to preserve audit trail).

### `DELETE /v1/admin/coupons/:id`

Soft delete — set `isActive: false`. Coupons may be referenced by existing orders.

---

## Admin Frontend

### New Page: `/admin/coupons`

**File Structure:**

```
src/app/admin/coupons/
├── page.tsx                  # Coupon list
├── new/page.tsx              # Create coupon
└── [couponId]/page.tsx       # Edit coupon + usage stats

src/components/admin/coupons/
├── CouponTable.tsx
├── CouponForm.tsx
└── CouponUsageStats.tsx

src/lib/api/coupons.ts
src/lib/types/coupons.ts
```

### Coupon List Page

**Table columns:** Code | Type | Value | Min Purchase | Usage (used/limit) | Status | Expires | Actions
**Status badges:** Active (green), Expired (gray), Disabled (red), Fully Used (amber)
**Quick actions:** Toggle active/inactive, Copy code, Edit, Delete

### Coupon Create/Edit Form

| Field                 | Control                           | Validation                    |
| --------------------- | --------------------------------- | ----------------------------- |
| Code                  | Text input + "Generate" button    | Required, uppercase, unique   |
| Description           | Textarea                          | Optional                      |
| Discount Type         | Radio (Percentage / Fixed Amount) | Required                      |
| Discount Value        | Number input                      | > 0; if %, <= 100             |
| Min Purchase          | Number input                      | Optional, >= 0                |
| Max Discount          | Number input                      | Required if percentage type   |
| Start Date            | Date picker                       | Default today                 |
| End Date              | Date picker                       | Optional, must be after start |
| Usage Limit           | Number input                      | Optional, >= 1                |
| Active                | Toggle                            | Default on                    |
| Applicable Products   | Multi-select with search          | Optional                      |
| Applicable Categories | Multi-select                      | Optional                      |

**Code generator:** Random 8-char alphanumeric code (e.g., `QC-SPRING26`)

### Usage Stats (Edit page)

- Total uses
- Total discount given (₹)
- Chart: usage over time (last 30 days)
- Recent orders table using this coupon

### Navigation

Add "Coupons" to admin sidebar under a "Marketing" section.

---

## Testing Plan

- [ ] Create coupon with all fields → persists correctly
- [ ] Apply percentage coupon → discount capped at maxDiscount
- [ ] Apply fixed amount coupon → exact discount
- [ ] Apply coupon below minPurchase → error
- [ ] Apply expired coupon → error
- [ ] Apply fully-used coupon → error
- [ ] Apply disabled coupon → error
- [ ] Product-specific coupon on wrong product → error
- [ ] Usage stats → accurate count and amounts
- [ ] Toggle active/inactive → immediately effective

---

## Future Enhancements

- **Auto-generated codes** for campaigns (e.g., 1000 unique codes for influencer program)
- **First-order discount**: automatic 10% off for new customers
- **Stackable discounts**: allow combining coupon + sale price
- **Referral codes**: tied to referral system (see doc 17)
