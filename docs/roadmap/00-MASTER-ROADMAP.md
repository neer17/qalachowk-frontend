# Qala Chowk — Platform Improvement Roadmap

**Date:** 2026-04-06
**Scope:** Frontend (storefront), Backend (API), Admin Panel, Business Strategy
**Goal:** Take Qala Chowk from MVP to a production-grade, revenue-optimized e-commerce platform

---

## Current State Summary

| Area            | Status                                  | Key Gaps                                                   |
| --------------- | --------------------------------------- | ---------------------------------------------------------- |
| **Storefront**  | Functional MVP — browse, cart, checkout | Payment is placeholder, no search, no SEO, no reviews      |
| **Backend**     | Solid architecture, good analytics      | No job queue, no shipping API, no real payment webhooks    |
| **Admin Panel** | Order management + analytics            | No product/customer/coupon/category CRUD                   |
| **Business**    | Single-channel, no retention loops      | No loyalty, no email marketing, no abandoned cart recovery |

---

## Priority Tiers

### P0 — Launch Blockers (Must have before accepting real money)

| #   | Initiative                                                  | Repo(s)           | Doc                                                                |
| --- | ----------------------------------------------------------- | ----------------- | ------------------------------------------------------------------ |
| 1   | Razorpay Payment Integration                                | backend, frontend | [01-razorpay-integration.md](./01-razorpay-integration.md)         |
| 2   | SEO Foundation (sitemap, robots, metadata, structured data) | frontend          | [02-seo-foundation.md](./02-seo-foundation.md)                     |
| 3   | Admin Product Management (CRUD)                             | backend, admin    | [03-admin-product-management.md](./03-admin-product-management.md) |

### P1 — Revenue & Conversion (First 30 days post-launch)

| #   | Initiative                                   | Repo(s)                  | Doc                                                              |
| --- | -------------------------------------------- | ------------------------ | ---------------------------------------------------------------- |
| 4   | Product Search & Filtering                   | backend, frontend        | [04-product-search.md](./04-product-search.md)                   |
| 5   | Customer Reviews & Ratings                   | backend, frontend, admin | [05-reviews-ratings.md](./05-reviews-ratings.md)                 |
| 6   | Coupon & Discount Management (Admin UI)      | admin                    | [06-coupon-management.md](./06-coupon-management.md)             |
| 7   | Abandoned Cart Recovery                      | backend, frontend        | [07-abandoned-cart-recovery.md](./07-abandoned-cart-recovery.md) |
| 8   | Order Self-Service (Cancel / Return / Track) | frontend                 | [08-order-self-service.md](./08-order-self-service.md)           |

### P2 — Operations & Scale (Days 30–90)

| #   | Initiative                                           | Repo(s)        | Doc                                                            |
| --- | ---------------------------------------------------- | -------------- | -------------------------------------------------------------- |
| 9   | Background Job Infrastructure (BullMQ)               | backend        | [09-job-queue-infra.md](./09-job-queue-infra.md)               |
| 10  | Shipping Provider Integration                        | backend, admin | [10-shipping-integration.md](./10-shipping-integration.md)     |
| 11  | Inventory Management & Low-Stock Alerts              | backend, admin | [11-inventory-management.md](./11-inventory-management.md)     |
| 12  | Transactional Notifications (SMS + WhatsApp + Email) | backend        | [12-notifications-overhaul.md](./12-notifications-overhaul.md) |
| 13  | Admin Customer Management                            | backend, admin | [13-customer-management.md](./13-customer-management.md)       |

### P3 — Growth & Retention (Days 90+)

| #   | Initiative                  | Repo(s)                  | Doc                                              |
| --- | --------------------------- | ------------------------ | ------------------------------------------------ |
| 14  | Loyalty & Rewards Program   | backend, frontend, admin | [14-loyalty-program.md](./14-loyalty-program.md) |
| 15  | Email Marketing Integration | backend                  | [15-email-marketing.md](./15-email-marketing.md) |
| 16  | Content/Blog for SEO        | frontend                 | [16-content-seo.md](./16-content-seo.md)         |
| 17  | Referral System             | backend, frontend        | [17-referral-system.md](./17-referral-system.md) |
| 18  | PWA & Offline Support       | frontend                 | [18-pwa-offline.md](./18-pwa-offline.md)         |

---

## Architecture Principles

1. **Ship incrementally** — each initiative is a standalone PR or set of PRs
2. **Backend-first** — API endpoints before UI, always OpenAPI-spec'd
3. **Admin before storefront** — admin CRUD enables data entry; storefront consumes it
4. **Measure before optimizing** — analytics and tracking before growth experiments
5. **Indian-market defaults** — UPI-first payments, WhatsApp notifications, COD support, INR formatting

---

## Cross-Cutting Concerns (Apply to all initiatives)

- **Error handling**: Backend returns `[data, Error?]` tuples — maintain this pattern
- **Type safety**: Update `openapi.yaml` → regenerate types → consume in frontends
- **Caching**: Invalidate Redis product cache on any product mutation
- **Audit trail**: Extend `OrderHistory` pattern to products, customers where applicable
- **Rate limiting**: Per-endpoint limits for sensitive operations (payments, OTP)
- **Testing**: Unit tests for services, functional tests for critical API flows
