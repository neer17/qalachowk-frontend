# 15 — Email Marketing Integration

**Priority:** P3 — Growth & Retention
**Repos:** qalachowk-backend
**Estimated effort:** 1–2 days
**Dependencies:** 12-notifications-overhaul.md

---

## Problem

No email marketing capability. Can't send newsletters, product announcements, sale alerts, or nurture sequences. For a niche artisan brand, email is a low-cost, high-ROI channel to drive repeat purchases and brand building.

---

## Solution Overview

Integrate with **Brevo** (formerly Sendinblue) — free tier supports 300 emails/day, has marketing automation, and is popular in India.

### Why Brevo (vs alternatives)

| Option           | Free Tier          | Automation | India Pricing      |
| ---------------- | ------------------ | ---------- | ------------------ |
| **Brevo**        | 300/day            | ✅         | Competitive        |
| Mailchimp        | 500 contacts       | ✅         | Expensive at scale |
| MSG91 (existing) | Transactional only | ❌         | Already using      |

Use MSG91 for transactional (order updates), Brevo for marketing (newsletters, campaigns).

---

## Implementation

### Contact Sync

On user creation / order completion:

```typescript
await brevoClient.contacts.createOrUpdate({
  email: user.email,
  attributes: {
    FIRSTNAME: user.firstName,
    LASTNAME: user.lastName,
    PHONE: user.phone,
    TOTAL_ORDERS: orderCount,
    TOTAL_SPENT: totalSpent,
    LAST_ORDER_DATE: lastOrderDate,
    LOYALTY_TIER: tier,
  },
  listIds: [MAIN_LIST_ID],
});
```

### Automated Flows (configured in Brevo dashboard, not code)

1. **Welcome series**: 3 emails over 7 days (brand story, craft process, first-order discount)
2. **Post-purchase**: Thank you + care instructions (3 days after delivery)
3. **Win-back**: "We miss you" (60 days since last order)
4. **Birthday**: Loyalty points + discount (if birthday collected)

### Newsletter (manual via Brevo dashboard)

- New collection launches
- Artisan spotlights
- Festival/seasonal campaigns
- Sale announcements

### Opt-in

- Checkout: "Subscribe to updates" checkbox (checked by default, but clearly visible)
- Footer: email signup form
- Account preferences: toggle marketing emails

---

## Backend Changes

### Brevo SDK Integration

```bash
npm install @getbrevo/brevo
```

### Sync Events

- User created → add to Brevo contacts
- Order completed → update contact attributes
- User unsubscribes → remove from list
- Loyalty tier change → update attribute

### Webhook

Brevo sends unsubscribe/bounce webhooks → update `NotificationPreference.marketing = false`.

---

## Testing Plan

- [ ] New user → synced to Brevo
- [ ] Order placed → attributes updated
- [ ] Unsubscribe → removed from marketing list
- [ ] Welcome series → triggers on new contact
