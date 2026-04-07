# 13 — Admin Customer Management

**Priority:** P2 — Operations & Scale
**Repos:** qalachowk-backend, qalachowk-admin-frontend
**Estimated effort:** 2–3 days
**Dependencies:** None

---

## Problem

The admin panel has no customer management. Can't view customer list, order history per customer, or customer lifetime value. For a growing e-commerce brand, understanding and managing customers is essential for support, marketing, and retention decisions.

---

## Solution Overview

1. Admin customer list with search and key metrics
2. Customer detail page with order history, lifetime value, and communication log
3. Backend endpoints to support admin customer views

---

## Backend Changes

### New Endpoints

#### `GET /v1/admin/customers`

```typescript
// Query params
{
  page?: number;
  limit?: number;
  search?: string;          // name, phone, email
  sortBy?: "name" | "orders" | "spent" | "lastOrder" | "created";
  sortOrder?: "asc" | "desc";
  hasOrders?: boolean;      // filter to customers with at least 1 order
}

// Response
{
  data: {
    customers: {
      id: string;
      firstName: string;
      lastName: string;
      phone: string;
      email: string | null;
      orderCount: number;
      totalSpent: string;       // lifetime value
      lastOrderDate: string | null;
      createdAt: string;
    }[];
    summary: {
      totalCustomers: number;
      customersWithOrders: number;
      averageLifetimeValue: string;
    };
    pagination: { page, limit, total, totalPages };
  }
}
```

#### `GET /v1/admin/customers/:id`

```typescript
// Response
{
  data: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
    role: string;
    createdAt: string;
    metrics: {
      orderCount: number;
      totalSpent: string;
      averageOrderValue: string;
      firstOrderDate: string;
      lastOrderDate: string;
      refundCount: number;
      refundAmount: string;
    };
    recentOrders: Order[];    // last 10 orders
    addresses: Address[];
    reviews: Review[];        // last 5 reviews
  }
}
```

#### `GET /v1/admin/customers/:id/orders`

Paginated order history for a specific customer.

#### `PUT /v1/admin/customers/:id/notes` (Stretch)

Admin notes on a customer (support context, VIP flag, etc.).

---

## Admin Frontend

### New Page: `/admin/customers`

**Table columns:** Name | Phone | Email | Orders | Total Spent | Last Order | Joined | Actions
**Search:** by name, phone, or email
**Sort:** by any column
**Quick stats:** Total customers, customers with orders, average LTV

### Customer Detail Page: `/admin/customers/[customerId]`

**Header:** Customer name, phone, email, member since date

**Metrics cards:**

- Total Orders
- Lifetime Value (₹)
- Average Order Value
- Refund Rate

**Tabs:**

1. **Orders** — paginated order list with status, date, amount
2. **Addresses** — saved addresses
3. **Reviews** — reviews left by this customer
4. **Notes** — admin notes (stretch)

**Quick actions:**

- View any order → links to `/admin/orders/[orderId]`
- Contact via WhatsApp (opens `wa.me/{phone}`)

### Navigation

Add "Customers" to admin sidebar.

---

## Testing Plan

- [ ] Customer list → shows all users with order metrics
- [ ] Search by phone → finds customer
- [ ] Sort by total spent → correct order
- [ ] Customer detail → accurate metrics
- [ ] Order history → matches actual orders
- [ ] Empty state → "No customers yet" when no users

---

## Future Enhancements

- **Customer segments**: tag customers (VIP, repeat buyer, at-risk)
- **Customer timeline**: unified activity feed (orders, reviews, support, notifications)
- **Export**: CSV export of customer list with metrics
- **Merge duplicates**: merge accounts with same phone
