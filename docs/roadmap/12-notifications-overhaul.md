# 12 — Transactional Notifications (SMS + WhatsApp + Email)

**Priority:** P2 — Operations & Scale
**Repos:** qalachowk-backend
**Estimated effort:** 3–4 days
**Dependencies:** 09-job-queue-infra.md (all notifications should be async)

---

## Problem

Currently only order confirmation emails are sent via MSG91. No SMS, no WhatsApp, no notifications for status changes (shipped, delivered, refund). Customers have no idea what's happening with their order unless they log in and check. WhatsApp is the dominant communication channel in India — not using it is leaving engagement on the table.

---

## Solution Overview

Build a unified notification system that sends messages across channels based on event type and customer preference.

### Notification Matrix

| Event                              | WhatsApp | Email | SMS |
| ---------------------------------- | -------- | ----- | --- |
| Order confirmed                    | ✅       | ✅    | ✅  |
| Order shipped (with tracking)      | ✅       | ✅    | ✅  |
| Out for delivery                   | ✅       | —     | —   |
| Order delivered                    | ✅       | ✅    | —   |
| Order cancelled                    | ✅       | ✅    | —   |
| Refund approved                    | ✅       | ✅    | —   |
| Refund processed (money sent)      | ✅       | ✅    | ✅  |
| Abandoned cart (1hr)               | ✅       | —     | —   |
| Abandoned cart (24hr)              | —        | ✅    | —   |
| Review reminder (7d post-delivery) | ✅       | ✅    | —   |
| Low stock alert (admin)            | ✅       | ✅    | —   |
| Payment failed / retry             | ✅       | ✅    | ✅  |

---

## Architecture

```
Event (order.shipped, etc.)
  │
  ▼
NotificationService.dispatch(event, context)
  │
  ▼
NotificationQueue (BullMQ)
  │
  ├── WhatsApp Worker → MSG91 WhatsApp API
  ├── Email Worker    → MSG91 Email API
  └── SMS Worker      → MSG91 SMS API
```

### Module Structure

```
src/notifications/
├── api/
│   └── controllers/v1/
│       └── notification.preferences.controller.ts
├── application/
│   ├── notification.service.ts          # Dispatch logic
│   ├── notification.port.ts             # Channel interface
│   └── templates/
│       ├── order-confirmed.template.ts
│       ├── order-shipped.template.ts
│       ├── order-delivered.template.ts
│       └── ... (one per event type)
├── domain/
│   └── entities/
│       └── notification.entity.ts
└── infrastructure/
    ├── msg91/
    │   ├── msg91-whatsapp.adapter.ts
    │   ├── msg91-email.adapter.ts
    │   └── msg91-sms.adapter.ts
    └── database/
        └── notification.repository.ts
```

### Schema

```prisma
model NotificationLog {
  id          String   @id @default(uuid())
  userId      String?
  channel     String   // "whatsapp" | "email" | "sms"
  eventType   String   // "order_confirmed", "order_shipped", etc.
  recipient   String   // phone number or email
  templateId  String?  // MSG91 template ID
  status      String   // "sent" | "delivered" | "failed" | "read"
  metadata    Json?    // template variables, error details
  orderId     String?  // for order-related notifications
  sentAt      DateTime @default(now())
  deliveredAt DateTime?
  readAt      DateTime?
}

model NotificationPreference {
  id        String  @id @default(uuid())
  userId    String  @unique
  user      User    @relation(fields: [userId], references: [id])
  whatsapp  Boolean @default(true)
  email     Boolean @default(true)
  sms       Boolean @default(true)
  marketing Boolean @default(false)  // opt-in for promotional
}
```

---

## MSG91 Integration

### WhatsApp Business API via MSG91

MSG91 provides WhatsApp Business API integration. Each message type needs a **pre-approved template** registered with Meta.

**Template examples (submit to MSG91 for approval):**

**Order Confirmed:**

```
Hi {{1}}! 🎉

Your order #{{2}} has been placed successfully.

Items: {{3}}
Total: ₹{{4}}

We'll notify you when it ships.
Track: {{5}}

— Qala Chowk
```

**Order Shipped:**

```
Hi {{1}}! 📦

Your order #{{2}} has been shipped!

Carrier: {{3}}
Tracking: {{4}}
Track here: {{5}}

Estimated delivery: {{6}}
```

**Order Delivered:**

```
Hi {{1}}! ✅

Your order #{{2}} has been delivered!

We hope you love your handcrafted pieces.
Leave a review: {{3}}

Need help? Reply to this message.
```

### SMS via MSG91

Use MSG91's SMS API with DLT-registered templates (mandatory in India).

**DLT registration required:**

- Register sender ID: QLACHK (6 chars)
- Register each template with TRAI DLT portal
- Use template IDs in API calls

### Email via MSG91

Already partially implemented. Extend with:

- HTML email templates (branded, responsive)
- Order detail tables with product images
- Tracking links
- Unsubscribe footer

---

## Notification Service

```typescript
class NotificationService {
  async dispatch(event: NotificationEvent): Promise<void> {
    const { type, userId, data } = event;

    // Get user preferences
    const prefs = await this.getPreferences(userId);

    // Get channels for this event type
    const channels = NOTIFICATION_MATRIX[type];

    // Enqueue per channel (async via BullMQ)
    for (const channel of channels) {
      if (!prefs[channel]) continue; // user opted out

      const template = this.getTemplate(type, channel);
      const payload = template.render(data);

      await notificationQueue.add(`${channel}-${type}`, {
        channel,
        type,
        userId,
        recipient: channel === "email" ? data.email : data.phone,
        templateId: template.id,
        variables: payload,
      });
    }
  }
}
```

---

## Admin Features

### Notification Logs (`/admin/notifications`)

**Table:** Date | Customer | Channel | Event | Status | Actions
**Filters:** Channel, event type, status, date range
**Detail view:** Full template rendered, delivery status, read receipt (WhatsApp)

### Resend Notification

On order detail page, "Resend Notification" dropdown:

- Resend order confirmation (WhatsApp / Email / SMS)
- Send shipping update
- Send custom message (stretch goal)

---

## Customer Preferences

### API Endpoint

`PUT /v1/users/:id/notification-preferences`

```typescript
{
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
  marketing: boolean;
}
```

### Frontend: Account Page

Add "Notification Preferences" section to `/account`:

```
Communication Preferences
☑ WhatsApp notifications
☑ Email notifications
☐ SMS notifications
☐ Marketing messages & offers
[Save]
```

---

## Testing Plan

- [ ] Order confirmed → WhatsApp + Email + SMS sent
- [ ] Order shipped → WhatsApp + Email + SMS with tracking
- [ ] Order delivered → WhatsApp + Email with review link
- [ ] User opts out of WhatsApp → only email/SMS sent
- [ ] Failed delivery → logged with error, retried
- [ ] Notification log → accurate record in database
- [ ] Admin resend → successfully re-sends chosen channel
- [ ] DND hours → WhatsApp/SMS queued for morning delivery

---

## Compliance

- **TRAI DLT**: All SMS templates must be DLT-registered (mandatory in India)
- **WhatsApp Business**: Templates must be Meta-approved
- **DND hours**: No promotional SMS/WhatsApp between 9 PM – 9 AM IST
- **Unsubscribe**: Every email includes unsubscribe link
- **Opt-in**: Marketing messages require explicit opt-in
- **Data retention**: Notification logs retained for 1 year

---

## MSG91 Cost Estimate

| Channel   | Cost per message | Monthly (100 orders) |
| --------- | ---------------- | -------------------- |
| WhatsApp  | ~₹0.50–0.80      | ~₹200–400            |
| Email     | ~₹0.10–0.15      | ~₹50–100             |
| SMS       | ~₹0.15–0.25      | ~₹75–150             |
| **Total** |                  | **~₹325–650/month**  |
