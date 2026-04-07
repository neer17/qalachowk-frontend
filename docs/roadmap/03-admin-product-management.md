# 03 — Admin Product Management (CRUD)

**Priority:** P0 — Launch Blocker
**Repos:** qalachowk-backend (minor), qalachowk-admin-frontend (major)
**Estimated effort:** 4–6 days
**Dependencies:** None (backend endpoints already exist)

---

## Problem

The admin panel has no way to create, edit, or delete products. Backend already exposes `POST /admin/products` and `PUT /admin/products/:id`, but the admin frontend has no UI for them. Products currently must be managed via direct API calls or database edits. This is unsustainable.

---

## Solution Overview

Build a complete product management section in the admin panel:

1. Product list page with search, filter, sort
2. Product create form
3. Product edit form
4. Image upload management
5. Category & collection assignment
6. Variant group management (link products as variants)
7. Stock & pricing management

---

## Backend: Verify / Extend Existing Endpoints

### Existing Endpoints (already built)

- `POST /v1/admin/products` — Create product
- `PUT /v1/admin/products/:id` — Update product
- `GET /v1/products` — List products (public, paginated)
- `GET /v1/products/:id` — Get product details (public)

### New Endpoints Needed

#### `DELETE /v1/admin/products/:id`

Soft delete (set `isActive: false`) rather than hard delete. Products may be referenced by existing orders.

```typescript
// Response
{ data: { id: string, isActive: false } }
```

#### `GET /v1/admin/products` (Admin-specific list)

The public `GET /v1/products` filters out inactive products. Admin needs to see all products including inactive ones, with admin-only fields (makingCost, stock, etc.).

```typescript
// Query params
{
  page?: number;
  limit?: number;
  search?: string;       // name, SKU search
  categoryId?: string;
  collectionId?: string;
  isActive?: boolean;
  sortBy?: "name" | "price" | "stock" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  lowStock?: boolean;    // stock < 5
}

// Response: paginated list with admin fields
{
  data: AdminProductResponse[];
  pagination: { page, limit, total, totalPages };
}
```

#### `POST /v1/admin/products/:id/images` (Image upload)

Handle multipart image upload to Supabase Storage.

```typescript
// Request: multipart/form-data
// Fields: file (image), alt (string), isMain (boolean), sortOrder (number)

// Response
{
  data: {
    (id, url, alt, isMain, sortOrder);
  }
}
```

#### `DELETE /v1/admin/products/:id/images/:imageId`

Remove image from Supabase Storage and database.

#### `PUT /v1/admin/products/:id/images/:imageId`

Update image metadata (alt text, isMain flag, sortOrder).

#### `GET /v1/admin/categories`

List all categories for dropdown in product form.

#### `GET /v1/admin/collections`

List all collections for dropdown in product form.

#### `GET /v1/admin/metal-types`

List all metal types for dropdown in product form.

#### `GET /v1/admin/vendors`

List all vendors for dropdown in product form.

---

## Admin Frontend: New Pages & Components

### File Structure

```
src/app/admin/products/
├── page.tsx                    # Product list
├── new/page.tsx                # Create product
└── [productId]/
    ├── page.tsx                # Edit product
    └── images/page.tsx         # Manage images (optional, can be tab)

src/components/admin/products/
├── ProductsTable.tsx           # List view with columns
├── ProductsFilterForm.tsx      # Filter sidebar/bar
├── ProductForm.tsx             # Shared create/edit form
├── ProductImageManager.tsx     # Image upload & reorder
├── ProductStatusBadge.tsx      # Active/Inactive badge
└── ProductStockIndicator.tsx   # Low stock warning

src/lib/api/products.ts         # API functions
src/lib/types/products.ts       # TypeScript types
```

### Product List Page (`/admin/products`)

**Layout:**

- Header: "Products" title + "Add Product" button
- Filter bar: search input, category dropdown, status toggle (all/active/inactive), low stock filter
- Table columns: Image (thumbnail) | Name | SKU | Price | Stock | Category | Status | Updated | Actions
- Pagination controls
- Bulk actions: activate/deactivate selected (stretch goal)

**Data fetching:**

```typescript
const products = await withAuth(() =>
  apiWithAuth<PaginatedProducts>(`/v1/admin/products?${queryString}`),
);
```

### Product Create Page (`/admin/products/new`)

**Form fields (ProductForm.tsx):**

| Field                | Type     | Required    | Notes                                      |
| -------------------- | -------- | ----------- | ------------------------------------------ |
| name                 | text     | yes         |                                            |
| slug                 | text     | yes         | Auto-generated from name, editable         |
| description          | textarea | yes         | Rich text (stretch: use a markdown editor) |
| price                | number   | yes         | INR, 2 decimal places                      |
| sku                  | text     | yes         | Unique                                     |
| stock                | number   | yes         | Default 0                                  |
| categoryId           | select   | yes         | From `/admin/categories`                   |
| collectionId         | select   | no          | From `/admin/collections`                  |
| metalTypeId          | select   | no          | From `/admin/metal-types`                  |
| vendorId             | select   | no          | From `/admin/vendors`                      |
| weight               | number   | no          | Grams                                      |
| makingCost           | number   | no          | Internal cost field                        |
| isActive             | toggle   | yes         | Default true                               |
| isOnSale             | toggle   | no          |                                            |
| salePrice            | number   | conditional | Required if isOnSale                       |
| discountedPercentage | number   | no          | Calculated from price & salePrice          |
| allowBackOrder       | toggle   | no          |                                            |
| backOrderLimit       | number   | conditional | If allowBackOrder                          |
| minOrderQuantity     | number   | no          | Default 1                                  |
| maxOrderQuantity     | number   | no          |                                            |
| careInstructions     | textarea | no          |                                            |
| customizationOptions | textarea | no          | JSON or structured                         |
| metaTitle            | text     | no          | SEO                                        |
| metaDescription      | textarea | no          | SEO                                        |

**Auto-slug generation:**

```typescript
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
```

**Form validation:**

- Price > 0
- Stock >= 0
- SKU format: alphanumeric + hyphens
- If isOnSale, salePrice < price
- Slug unique (validate on blur via API)

### Product Edit Page (`/admin/products/[productId]`)

Same form as create, pre-populated with existing data. Additional sections:

- **Image Manager** tab/section
- **Variant Group** section (link/unlink variants)
- **Danger Zone**: Deactivate product button

### Image Manager (`ProductImageManager.tsx`)

**Features:**

- Drag-and-drop upload area
- Thumbnail grid of existing images
- Set main image (radio selection)
- Edit alt text inline
- Reorder via drag-and-drop (update sortOrder)
- Delete image with confirmation

**Upload flow:**

1. User drops/selects file
2. Client-side preview shown immediately
3. Upload to `POST /admin/products/:id/images`
4. On success, add to grid
5. Show error toast on failure

**Image constraints:**

- Max 10 images per product
- Max 5MB per image
- Formats: JPEG, PNG, WebP
- Client-side validation before upload

---

## API Layer (`src/lib/api/products.ts`)

```typescript
export async function fetchAdminProducts(params?: ProductFilters) {
  const query = new URLSearchParams(
    params as Record<string, string>,
  ).toString();
  return apiWithAuth<PaginatedProducts>(`/v1/admin/products?${query}`);
}

export async function fetchAdminProduct(id: string) {
  return apiWithAuth<AdminProductResponse>(`/v1/admin/products/${id}`);
}

export async function createProduct(data: CreateProductRequest) {
  return apiWithAuth<AdminProductResponse>("/v1/admin/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: string, data: UpdateProductRequest) {
  return apiWithAuth<AdminProductResponse>(`/v1/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string) {
  return apiWithAuth<{ id: string }>(`/v1/admin/products/${id}`, {
    method: "DELETE",
  });
}

export async function uploadProductImage(
  productId: string,
  formData: FormData,
) {
  return apiWithAuth<ProductImageResponse>(
    `/v1/admin/products/${productId}/images`,
    {
      method: "POST",
      body: formData,
      // Don't set Content-Type — let browser set multipart boundary
    },
  );
}

export async function deleteProductImage(productId: string, imageId: string) {
  return apiWithAuth(`/v1/admin/products/${productId}/images/${imageId}`, {
    method: "DELETE",
  });
}
```

---

## Navigation Update

Update `src/components/layout/AdminLayout.tsx` sidebar:

- Add "Products" nav item linking to `/admin/products`
- Icon: `Package` from lucide-react

---

## Testing Plan

- [ ] Create product with all fields → verify in database
- [ ] Create product with minimum fields → verify defaults
- [ ] Edit product → verify changes persist
- [ ] Deactivate product → verify hidden from public API, visible in admin
- [ ] Upload images → verify in Supabase Storage
- [ ] Delete image → verify removed from storage and database
- [ ] Set main image → verify `isMain` flag
- [ ] Search by name/SKU → verify results
- [ ] Filter by category → verify results
- [ ] Low stock filter → verify products with stock < 5
- [ ] Pagination → verify page navigation
- [ ] Slug uniqueness → verify error on duplicate

---

## Future Enhancements

- **Bulk import/export** (CSV upload for initial catalog)
- **Rich text editor** for descriptions (Tiptap or similar)
- **Variant management UI** (color/size picker, shared attributes)
- **Category/collection CRUD** (separate admin pages)
- **Product duplication** (clone existing product as template)
