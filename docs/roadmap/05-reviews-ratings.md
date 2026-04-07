# 05 — Customer Reviews & Ratings

**Priority:** P1 — Revenue & Conversion
**Repos:** qalachowk-backend, qalachowk-frontend, qalachowk-admin-frontend
**Estimated effort:** 4–5 days
**Dependencies:** None (Review model already exists in Prisma schema)

---

## Problem

The backend already has a `Review` model (userId, productId, rating, title, comment, isVerified, images), but there is no API endpoint to create/read reviews, no frontend UI to display or submit them, and no admin moderation. Reviews are the #1 conversion driver for artisan/handicraft e-commerce — customers need social proof before purchasing handmade items.

---

## Solution Overview

1. Backend: Review CRUD API endpoints
2. Frontend: Display reviews on product detail page + post-purchase review submission
3. Admin: Review moderation queue

---

## Backend Changes

### New Module: `src/reviews/`

```
src/reviews/
├── api/
│   ├── controllers/v1/
│   │   ├── reviews.controller.ts
│   │   ├── admin.reviews.controller.ts
│   │   └── dto/
│   │       ├── reviews.ts
│   │       └── admin.reviews.ts
│   └── router/v1/
│       ├── reviews.router.ts
│       └── admin.router.ts
├── application/
│   └── reviews.service.ts
├── domain/
│   └── entities/
│       └── review.entity.ts
└── infrastructure/
    └── database/
        └── repository/
            └── review.repository.ts
```

### API Endpoints

#### Customer Endpoints

**`GET /v1/products/:productId/reviews`** (Public)

```typescript
// Query params
{ page?: number; limit?: number; sortBy?: "newest" | "highest" | "lowest" | "most_helpful" }

// Response
{
  data: {
    reviews: ReviewResponse[];
    summary: {
      averageRating: number;    // e.g., 4.3
      totalReviews: number;
      distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
    };
    pagination: { page, limit, total, totalPages };
  }
}
```

**`POST /v1/products/:productId/reviews`** (Authenticated)

```typescript
// Request
{
  rating: number;       // 1–5
  title?: string;       // max 100 chars
  comment: string;      // max 2000 chars
  images?: string[];    // uploaded image URLs (max 5)
}

// Validation:
// - User must have a DELIVERED order containing this product
// - User can only review a product once
// - Rating 1–5 integer
```

**`PUT /v1/reviews/:reviewId`** (Authenticated, owner only)

```typescript
// Request: same as POST (update existing review)
```

**`DELETE /v1/reviews/:reviewId`** (Authenticated, owner only)

#### Admin Endpoints

**`GET /v1/admin/reviews`**

```typescript
// Query params
{ page?, limit?, status?: "pending" | "approved" | "rejected", productId?, userId?, minRating?, maxRating? }
```

**`PATCH /v1/admin/reviews/:reviewId`**

```typescript
// Request
{ status: "approved" | "rejected"; moderationNote?: string }
```

### Schema Changes

```prisma
model Review {
  // Existing fields stay
  // Add:
  status          ReviewStatus @default(PENDING)
  moderationNote  String?
  helpfulCount    Int          @default(0)
  reportCount     Int          @default(0)
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### Business Logic

- **Auto-verify**: If user has a DELIVERED order for the product, set `isVerified: true`
- **Moderation**: New reviews start as `PENDING`. Auto-approve if `isVerified` and rating >= 3 and no profanity detected. Otherwise queue for admin moderation.
- **Profanity filter**: Basic word list check (expandable). Flag for moderation if triggered.
- **Aggregate update**: On review create/update/delete, recalculate product's aggregate rating. Store on Product model for fast reads:

```prisma
model Product {
  // Add:
  averageRating   Decimal?  @db.Decimal(2, 1)
  reviewCount     Int       @default(0)
}
```

---

## Frontend Changes (qalachowk-frontend)

### Product Detail Page — Reviews Section

Add below product description on `/categories/[category]/[productName]`:

**Review Summary:**

```
★★★★☆  4.3 out of 5
Based on 47 reviews

5 ★ ████████████████ 28
4 ★ ████████        12
3 ★ ███              4
2 ★ █                2
1 ★ █                1
```

**Review List:**

```
★★★★★  "Beautiful craftsmanship"
By Priya S. | Verified Purchase | 2 weeks ago

The detailing on this piece is incredible. The brass finish
is exactly as shown in the photos...

[Photo] [Photo]

Helpful (5)  |  Report
```

**Components:**

```
src/components/reviews/
├── ReviewSummary.tsx        # Star breakdown bar chart
├── ReviewCard.tsx           # Individual review
├── ReviewList.tsx           # Paginated list of reviews
├── ReviewForm.tsx           # Submit/edit review form
├── StarRating.tsx           # Clickable star input + display
└── ReviewImageUpload.tsx    # Image attachment
```

### Post-Purchase Review Prompt

**Trigger:** On `/order-details` page, for orders with status `DELIVERED`, show a "Review your items" CTA for each product not yet reviewed.

**Flow:**

1. User clicks "Write a Review" on a delivered order item
2. Modal/page opens with star rating + form
3. Submit → success toast → review appears (or "pending moderation" message)

### Review Form Fields

- Star rating (required, clickable stars)
- Title (optional, text input)
- Comment (required, textarea)
- Images (optional, up to 5, drag-and-drop or file picker)
- Submit button

---

## Admin Frontend Changes (qalachowk-admin-frontend)

### New Page: `/admin/reviews`

**Layout:**

- Filter bar: status (pending/approved/rejected), product search, date range, rating range
- Table: Product | Customer | Rating | Title | Status | Date | Actions
- Quick actions: Approve / Reject buttons per row
- Click to expand full review text + images

**Moderation Flow:**

1. New reviews appear with status `PENDING` (highlighted)
2. Admin can approve (makes visible) or reject (hidden, notification to user)
3. Optional: add moderation note visible only to admins

### Dashboard Widget

Add to admin dashboard: "X reviews pending moderation" alert card.

---

## SEO Impact

Approved reviews generate `AggregateRating` structured data on product pages:

```json
{
  "@type": "Product",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.3",
    "reviewCount": "47"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Priya S." },
      "datePublished": "2026-03-20",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "The detailing on this piece is incredible..."
    }
  ]
}
```

This enables **star ratings in Google search results** — significant CTR improvement.

---

## Testing Plan

- [ ] Submit review for delivered order → review created with PENDING/auto-approved status
- [ ] Submit review for non-purchased product → rejected
- [ ] Submit duplicate review → error "You've already reviewed this product"
- [ ] Edit existing review → updated
- [ ] Delete review → removed, aggregate recalculated
- [ ] Admin approve → review visible on product page
- [ ] Admin reject → review hidden
- [ ] Aggregate rating → correct average and count
- [ ] Review images upload → stored and displayed
- [ ] Pagination → works with 50+ reviews
- [ ] Sort by newest/highest/lowest → correct order
- [ ] Star rating structured data → validates in Rich Results Test

---

## Future Enhancements

- **Review reminders**: Email/WhatsApp 7 days after delivery asking for review
- **Incentivized reviews**: Small discount code on verified review submission
- **Photo reviews gallery**: Dedicated section showing customer photos
- **Q&A section**: Customer questions on product pages (separate from reviews)
- **AI-generated review summaries**: "Customers love the craftsmanship and fast shipping"
