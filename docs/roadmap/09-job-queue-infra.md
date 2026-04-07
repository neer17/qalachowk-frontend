# 09 — Background Job Infrastructure (BullMQ)

**Priority:** P2 — Operations & Scale
**Repos:** qalachowk-backend
**Estimated effort:** 2–3 days (infra), then incremental per job type
**Dependencies:** None (Redis already available)

---

## Problem

The backend has no background processing capability. Everything runs synchronously in request handlers:

- Email notifications block the order creation response
- No scheduled jobs for cart abandonment, stock alerts, analytics aggregation
- No retry mechanism for failed external API calls (MSG91, Razorpay)
- Stock reservation release requires a scheduled check

This limits reliability, scalability, and the ability to build features like abandoned cart recovery, scheduled notifications, and report generation.

---

## Solution Overview

Add BullMQ (Redis-backed job queue) with a worker process:

- **Immediate jobs**: notification sending, payment verification, invoice generation
- **Scheduled jobs**: abandoned cart checks, stock reservation release, analytics pre-computation
- **Retry logic**: automatic retries with exponential backoff for transient failures

---

## Why BullMQ

| Option          | Pros                                                                                             | Cons                              |
| --------------- | ------------------------------------------------------------------------------------------------ | --------------------------------- |
| **BullMQ**      | Redis-backed (already have Redis), mature, TypeScript native, scheduled jobs, retries, dashboard | Adds worker process               |
| pg-boss         | Uses PostgreSQL (no extra infra)                                                                 | Slower than Redis, less ecosystem |
| Agenda          | MongoDB-backed                                                                                   | Wrong DB                          |
| SQS/Cloud Tasks | Managed, scalable                                                                                | Vendor lock-in, cost, complexity  |

BullMQ is the right choice: we already have Redis, it's battle-tested, and it runs in the same Node.js process or as a separate worker.

---

## Architecture

```
┌─────────────┐     enqueue     ┌─────────┐     dequeue     ┌─────────────┐
│  API Server │ ──────────────→ │  Redis   │ ←────────────── │   Worker    │
│  (Express)  │                 │  (Queue) │                 │  (BullMQ)   │
└─────────────┘                 └─────────┘                 └─────────────┘
                                                                   │
                                                            ┌──────┴──────┐
                                                            │  Processors │
                                                            │ (per queue) │
                                                            └─────────────┘
```

**Deployment:**

- Development: worker runs in same process as API server
- Production: separate worker process via `npm run worker`
- Fly.io: separate worker machine in same app (scales independently)

---

## Implementation

### New Dependency

```bash
npm install bullmq
```

### Module Structure

```
src/jobs/
├── config/
│   └── queue.config.ts         # Queue connection, default options
├── queues/
│   ├── notification.queue.ts   # Email, SMS, WhatsApp jobs
│   ├── payment.queue.ts        # Payment verification, webhook retry
│   ├── order.queue.ts          # Invoice generation, stock release
│   └── analytics.queue.ts      # Scheduled aggregation
├── workers/
│   ├── notification.worker.ts
│   ├── payment.worker.ts
│   ├── order.worker.ts
│   └── analytics.worker.ts
├── processors/
│   ├── send-email.processor.ts
│   ├── send-whatsapp.processor.ts
│   ├── verify-payment.processor.ts
│   ├── generate-invoice.processor.ts
│   ├── check-abandoned-carts.processor.ts
│   └── release-stock-reservations.processor.ts
└── worker.ts                   # Worker entry point
```

### Queue Configuration

```typescript
// src/jobs/config/queue.config.ts
import { Queue, Worker, QueueScheduler } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB || 0),
};

export const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000, // 1s, 2s, 4s
  },
  removeOnComplete: { age: 86400 }, // keep completed for 24h
  removeOnFail: { age: 604800 }, // keep failed for 7 days
};

export { connection };
```

### Queue Definitions

```typescript
// Notification Queue
export const notificationQueue = new Queue("notifications", {
  connection,
  defaultJobOptions,
});

// Job types
type NotificationJob =
  | { type: "order_confirmation"; orderId: string }
  | { type: "order_shipped"; orderId: string }
  | { type: "order_delivered"; orderId: string }
  | { type: "refund_approved"; refundId: string }
  | { type: "abandoned_cart"; userId: string; cartId: string; stage: number }
  | { type: "review_reminder"; orderId: string };
```

### Worker Entry Point

```typescript
// src/jobs/worker.ts
import { notificationWorker } from "./workers/notification.worker";
import { paymentWorker } from "./workers/payment.worker";
import { orderWorker } from "./workers/order.worker";

// Start all workers
const workers = [notificationWorker, paymentWorker, orderWorker];

// Graceful shutdown
process.on("SIGTERM", async () => {
  await Promise.all(workers.map((w) => w.close()));
  process.exit(0);
});
```

### Scheduled Jobs (Repeatable)

```typescript
// Set up on application start
await notificationQueue.add(
  "check-abandoned-carts",
  {},
  { repeat: { every: 15 * 60 * 1000 } }, // every 15 minutes
);

await orderQueue.add(
  "release-expired-reservations",
  {},
  { repeat: { every: 5 * 60 * 1000 } }, // every 5 minutes
);

await analyticsQueue.add(
  "precompute-dashboard",
  {},
  { repeat: { pattern: "0 */6 * * *" } }, // every 6 hours
);
```

### Migration: Make Existing Notifications Async

**Before (in orders.service.ts):**

```typescript
await notificationService.sendOrderConfirmation(order);
return [order]; // blocked until email sent
```

**After:**

```typescript
await notificationQueue.add("order-confirmation", {
  type: "order_confirmation",
  orderId: order.getId(),
});
return [order]; // returns immediately
```

---

## Package.json Scripts

```json
{
  "worker": "node dist/jobs/worker.js",
  "worker:dev": "tsx watch src/jobs/worker.ts | pino-pretty"
}
```

---

## Fly.io Deployment

```toml
# fly.toml — add worker process
[processes]
  web = "node dist/bootstrap.js"
  worker = "node dist/jobs/worker.js"

[[services]]
  processes = ["web"]
  # ... existing web config

# Worker needs no HTTP port
```

---

## Monitoring

### BullMQ Dashboard (Bull Board)

Add admin-only dashboard route:

```bash
npm install @bull-board/express @bull-board/api
```

```typescript
// Mount at /v1/admin/queues (behind requireAdmin middleware)
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [
    new BullMQAdapter(notificationQueue),
    new BullMQAdapter(paymentQueue),
    new BullMQAdapter(orderQueue),
  ],
  serverAdapter,
});
```

### Logging

Each worker logs via Pino:

- Job started: `{ jobId, type, queue }`
- Job completed: `{ jobId, type, duration }`
- Job failed: `{ jobId, type, error, attempt }`

---

## Initial Job Types to Migrate

| Job                       | Queue        | Current State                | Priority                  |
| ------------------------- | ------------ | ---------------------------- | ------------------------- |
| Order confirmation email  | notification | Synchronous in order service | Migrate first             |
| Invoice generation        | order        | Synchronous                  | Migrate                   |
| Stock reservation release | order        | Not implemented              | New — needed for Razorpay |
| Abandoned cart check      | notification | Not implemented              | New — see doc 07          |
| Payment webhook retry     | payment      | Not implemented              | New — needed for Razorpay |

---

## Testing Plan

- [ ] Job enqueue → appears in queue
- [ ] Worker processes job → processor called
- [ ] Failed job → retried up to 3 times with backoff
- [ ] Permanent failure → moves to failed set
- [ ] Scheduled job → fires on schedule
- [ ] Graceful shutdown → in-progress jobs complete before exit
- [ ] Bull Board → accessible at /admin/queues
- [ ] Redis disconnection → worker reconnects automatically
