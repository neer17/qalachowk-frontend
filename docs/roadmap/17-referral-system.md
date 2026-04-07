# 17 — Referral System

**Priority:** P3 — Growth & Retention
**Repos:** qalachowk-backend, qalachowk-frontend
**Estimated effort:** 3–4 days
**Dependencies:** 06-coupon-management.md, 14-loyalty-program.md

---

## Problem

No word-of-mouth amplification mechanism. Handcrafted goods sell well through personal recommendations — "where did you get that?" moments. A referral program turns happy customers into a growth channel.

---

## Solution Overview

**"Share & Earn"**: Each customer gets a unique referral code/link. When a friend makes their first order using the code:

- **Referrer** gets 200 Qala Points (₹20 value) or a ₹200 coupon
- **Friend** gets ₹150 off their first order (min ₹999)

---

## Schema

```prisma
model ReferralCode {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  code        String   @unique  // e.g., "PRIYA200"
  link        String   // qalachowk.com/ref/PRIYA200
  uses        Int      @default(0)
  maxUses     Int      @default(50)  // prevent abuse
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model Referral {
  id            String   @id @default(uuid())
  referrerId    String   // who referred
  refereeId     String   // who was referred
  referralCodeId String
  orderId       String?  // the qualifying order
  status        ReferralStatus @default(PENDING)
  referrerReward String?  // "200_points" or coupon code
  refereeReward  String?  // coupon code used
  createdAt     DateTime @default(now())
  convertedAt   DateTime?
}

enum ReferralStatus {
  PENDING      // friend signed up but hasn't ordered
  CONVERTED    // friend placed qualifying order
  REWARDED     // both parties received rewards
  EXPIRED      // 30 days, no conversion
}
```

---

## API Endpoints

### Customer

- `GET /v1/referral/my-code` — get or generate referral code
- `GET /v1/referral/stats` — referrals sent, converted, rewards earned
- `POST /v1/referral/apply` — apply referral code at signup/checkout

### Admin

- `GET /v1/admin/referrals` — all referrals with conversion data
- `GET /v1/admin/referrals/stats` — program performance (conversion rate, CAC)

---

## Frontend

### Account Page — Referral Section

```
Share & Earn
Your code: PRIYA200
Your link: qalachowk.com/ref/PRIYA200
[Copy Link] [Share on WhatsApp]

You've referred 3 friends | 2 converted | 400 points earned
```

### Referral Landing Page (`/ref/[code]`)

- Branded landing page: "Your friend thinks you'll love Qala Chowk"
- Show referral benefit: "Get ₹150 off your first order"
- CTA: "Shop Now" (stores referral code in cookie/localStorage)
- Code auto-applies at checkout

### Checkout Integration

- If referral code stored, auto-apply as discount
- Show: "₹150 referral discount applied"

### Share via WhatsApp (primary channel)

```
Pre-filled message:
"I love my handcrafted pieces from Qala Chowk! ✨ Use my code PRIYA200 to get ₹150 off your first order: https://qalachowk.com/ref/PRIYA200"
```

---

## Business Rules

- Referral discount: ₹150 off, minimum order ₹999
- Referrer reward: 200 Qala Points (or ₹200 coupon if no loyalty program)
- Rewards granted only after friend's order is DELIVERED (prevent gaming)
- Max 50 referrals per user
- Self-referral blocked (same phone/device fingerprint)
- Referral code valid for 30 days after friend clicks link

---

## Testing Plan

- [ ] Generate referral code → unique, formatted correctly
- [ ] Share link → landing page shows benefit
- [ ] Friend signs up via link → referral tracked as PENDING
- [ ] Friend places order → status → CONVERTED
- [ ] Friend order delivered → rewards granted to both
- [ ] Self-referral → blocked
- [ ] Max uses reached → code deactivated
- [ ] Admin stats → accurate conversion rate
