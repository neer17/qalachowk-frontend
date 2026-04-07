# 14 — Loyalty & Rewards Program

**Priority:** P3 — Growth & Retention
**Repos:** qalachowk-backend, qalachowk-frontend, qalachowk-admin-frontend
**Estimated effort:** 5–7 days
**Dependencies:** 09-job-queue-infra.md, 12-notifications-overhaul.md

---

## Problem

No retention mechanism exists. Every order is a one-off transaction. For handcrafted goods with moderate repeat purchase potential (gifting, collection building), a loyalty program increases customer lifetime value and reduces acquisition cost.

---

## Solution Overview

**"Qala Points"** — a simple points-based loyalty program:

- Earn points on every purchase (1 point per ₹10 spent)
- Earn bonus points for reviews, referrals, birthdays
- Redeem points as discount on future orders (100 points = ₹10)
- Tiered membership: Bronze → Silver → Gold (based on lifetime spend)

---

## Schema

```prisma
model LoyaltyAccount {
  id             String   @id @default(uuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])
  pointsBalance  Int      @default(0)
  lifetimePoints Int      @default(0)  // total ever earned (for tier calc)
  lifetimeSpend  Decimal  @db.Decimal(10, 2) @default(0)
  tier           LoyaltyTier @default(BRONZE)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model PointTransaction {
  id          String   @id @default(uuid())
  accountId   String
  account     LoyaltyAccount @relation(fields: [accountId], references: [id])
  points      Int      // positive = earn, negative = redeem
  type        PointTransactionType
  description String
  referenceId String?  // orderId, reviewId, etc.
  expiresAt   DateTime? // points expire after 12 months
  createdAt   DateTime @default(now())
}

enum PointTransactionType {
  PURCHASE_EARN
  REVIEW_BONUS
  REFERRAL_BONUS
  BIRTHDAY_BONUS
  WELCOME_BONUS
  REDEMPTION
  EXPIRY
  ADMIN_ADJUSTMENT
}

enum LoyaltyTier {
  BRONZE   // 0–4,999 lifetime spend
  SILVER   // 5,000–14,999
  GOLD     // 15,000+
}
```

### Tier Benefits

| Benefit                 | Bronze  | Silver    | Gold        |
| ----------------------- | ------- | --------- | ----------- |
| Points earn rate        | 1pt/₹10 | 1.5pt/₹10 | 2pt/₹10     |
| Birthday bonus          | 50 pts  | 100 pts   | 200 pts     |
| Free shipping threshold | ₹999    | ₹499      | Always free |
| Early access to sales   | —       | ✅        | ✅          |
| Exclusive products      | —       | —         | ✅          |

### Earning Rules

| Action                   | Points                       |
| ------------------------ | ---------------------------- |
| Purchase                 | 1 pt per ₹10 (tier-adjusted) |
| Write verified review    | 25 pts                       |
| First order (welcome)    | 100 pts                      |
| Referral (friend orders) | 200 pts                      |
| Birthday                 | Tier-based                   |

---

## API Endpoints

### Customer

- `GET /v1/loyalty` — account balance, tier, history
- `POST /v1/loyalty/redeem` — redeem points during checkout
- `GET /v1/loyalty/history` — point transaction history

### Admin

- `GET /v1/admin/loyalty/overview` — program stats (active accounts, total points, redemption rate)
- `GET /v1/admin/loyalty/:userId` — customer loyalty detail
- `POST /v1/admin/loyalty/:userId/adjust` — manual point adjustment

---

## Frontend

### Account Page — Loyalty Section

- Points balance
- Tier badge with progress bar to next tier
- "Earn more points" tips
- Transaction history

### Checkout Integration

- "Use Qala Points" toggle
- Points slider: choose how many to redeem
- Show discount applied

### Product Page

- "Earn X Qala Points with this purchase"

---

## Testing Plan

- [ ] Purchase → points earned at correct tier rate
- [ ] Redeem → points deducted, discount applied
- [ ] Tier upgrade → triggered at threshold
- [ ] Point expiry → expired after 12 months
- [ ] Review bonus → 25 points on verified review
- [ ] Welcome bonus → 100 points on first order
