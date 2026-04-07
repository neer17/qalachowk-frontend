# 04 — Product Search & Filtering

**Priority:** P1 — Revenue & Conversion
**Repos:** qalachowk-backend, qalachowk-frontend
**Estimated effort:** 3–4 days
**Dependencies:** None

---

## Problem

There is no way for customers to search for products. The shop page lists products with basic category tabs but no text search, price filtering, or sort options beyond basic sorting. For a catalog that will grow beyond 50+ products, search is essential for discoverability and conversion.

---

## Solution Overview

**Phase 1 (this doc):** PostgreSQL full-text search + frontend search bar + filter UI
**Phase 2 (future):** Algolia/Typesense if catalog exceeds 10K products or search latency exceeds 200ms

---

## Backend Changes

### Enhance `GET /v1/products` endpoint

#### New Query Parameters

```typescript
interface ProductSearchParams {
  // Existing
  page?: number; // default 1
  limit?: number; // default 12
  categoryId?: string;

  // New
  q?: string; // full-text search query
  minPrice?: number;
  maxPrice?: number;
  metalTypeId?: string;
  collectionId?: string;
  isOnSale?: boolean;
  inStock?: boolean; // stock > 0
  sortBy?: "relevance" | "price_asc" | "price_desc" | "newest" | "popularity";
  tags?: string[]; // future: product tags
}
```

#### PostgreSQL Full-Text Search

Add a generated tsvector column to the Product table:

```sql
-- Migration
ALTER TABLE "Product" ADD COLUMN "searchVector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("name", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("description", '')), 'B') ||
    setweight(to_tsvector('english', coalesce("sku", '')), 'A')
  ) STORED;

CREATE INDEX idx_product_search ON "Product" USING GIN ("searchVector");
```

Since Prisma doesn't natively support tsvector, use `$queryRawUnsafe` for search:

```typescript
// In product.repository.ts
async searchProducts(params: ProductSearchParams): Promise<[PaginatedResult, Error?]> {
  const { q, minPrice, maxPrice, metalTypeId, collectionId, isOnSale, inStock, sortBy, page, limit } = params;

  let whereClause = `WHERE p."isActive" = true`;
  const values: any[] = [];
  let paramIdx = 1;

  if (q) {
    whereClause += ` AND p."searchVector" @@ plainto_tsquery('english', $${paramIdx})`;
    values.push(q);
    paramIdx++;
  }

  if (minPrice !== undefined) {
    whereClause += ` AND p."price" >= $${paramIdx}`;
    values.push(minPrice);
    paramIdx++;
  }

  if (maxPrice !== undefined) {
    whereClause += ` AND p."price" <= $${paramIdx}`;
    values.push(maxPrice);
    paramIdx++;
  }

  if (metalTypeId) {
    whereClause += ` AND p."metalTypeId" = $${paramIdx}`;
    values.push(metalTypeId);
    paramIdx++;
  }

  if (isOnSale) {
    whereClause += ` AND p."isOnSale" = true`;
  }

  if (inStock) {
    whereClause += ` AND p."stock" > 0`;
  }

  // Sort
  let orderClause = "ORDER BY ";
  switch (sortBy) {
    case "price_asc":  orderClause += `p."price" ASC`; break;
    case "price_desc": orderClause += `p."price" DESC`; break;
    case "newest":     orderClause += `p."createdAt" DESC`; break;
    case "popularity": orderClause += `order_count DESC NULLS LAST`; break;
    case "relevance":
    default:
      orderClause += q
        ? `ts_rank(p."searchVector", plainto_tsquery('english', $1)) DESC`
        : `p."createdAt" DESC`;
  }

  // ... execute with pagination
}
```

#### Cache Strategy

- Cache search results in Redis with key: `search:{hash(params)}`, TTL 5 minutes
- Invalidate on product create/update/delete

#### Response Format

```typescript
{
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    priceRange: { min: number; max: number };  // global min/max for slider
    categories: { id: string; name: string; count: number }[];
    metalTypes: { id: string; name: string; count: number }[];
    collections: { id: string; name: string; count: number }[];
  };
}
```

The `filters` object provides available filter values and counts for the current search context, enabling dynamic filter UI.

---

## Frontend Changes

### Search Bar Component (`src/components/search/SearchBar.tsx`)

**Location:** Navbar (always visible on desktop, expandable icon on mobile)

**Behavior:**

- Debounced input (300ms)
- Shows instant results dropdown (top 5 matches) while typing
- Enter or "See all results" navigates to `/shop?q={query}`
- Recent searches stored in localStorage (last 5)

```typescript
// Instant search — lightweight endpoint or reuse /v1/products?q=...&limit=5
const [results, setResults] = useState<Product[]>([]);
const [query, setQuery] = useState("");

const debouncedSearch = useDebouncedCallback(async (q: string) => {
  if (q.length < 2) return setResults([]);
  const res = await fetch(
    `${API}/v1/products?q=${encodeURIComponent(q)}&limit=5`,
  );
  const data = await res.json();
  setResults(data.data || []);
}, 300);
```

**Dropdown UI:**

- Product thumbnail | Name | Price
- "See all results for '{query}'" link at bottom
- "No results found" state with suggestions

### Shop Page Filter Sidebar (`src/app/shop/page.tsx`)

**Desktop:** Sticky left sidebar (240px)
**Mobile:** Bottom sheet / drawer triggered by "Filter" button

**Filter controls:**
| Filter | Control | Notes |
|--------|---------|-------|
| Search | Text input | Pre-filled from URL `?q=` |
| Category | Checkbox list | With result counts |
| Price Range | Dual-handle slider | Min/max from API |
| Metal Type | Checkbox list | With result counts |
| Sale Items | Toggle | "On Sale" filter |
| In Stock | Toggle | Default on |

**Sort dropdown (top of results):**

- Relevance (default when searching)
- Price: Low to High
- Price: High to Low
- Newest First
- Popularity

**URL state:**
All filters sync to URL params for shareable/bookmarkable filtered views:

```
/shop?q=silver+ring&categoryId=abc&minPrice=500&maxPrice=5000&sortBy=price_asc
```

Use `useSearchParams` + `useRouter` to manage URL state.

### Active Filters Bar

Show active filters as dismissible chips above results:

```
Showing results for "silver ring" | Category: Rings ✕ | ₹500–₹5,000 ✕ | Clear All
```

### Empty State

When no products match:

- "No products found for '{query}'"
- Suggest: "Try a different search term" / "Browse all products" / "Check out our collections"

---

## Search Analytics (GA4)

Track search queries for demand signal:

```typescript
sendGAEvent("search", { search_term: query });

// On filter apply
sendGAEvent("view_item_list", {
  item_list_name: "search_results",
  items: products.map((p) => ({ item_id: p.id, item_name: p.name })),
});
```

---

## Testing Plan

- [ ] Search by product name → returns relevant results
- [ ] Search by SKU → returns exact match
- [ ] Search with typo → still returns reasonable results (stemming)
- [ ] Empty search → returns all products
- [ ] Price filter → only products in range
- [ ] Category filter → only products in category
- [ ] Combined filters → intersection of all filters
- [ ] Sort by price → correct order
- [ ] Sort by relevance → best match first
- [ ] Pagination with filters → maintains filter state
- [ ] Mobile filter drawer → opens/closes correctly
- [ ] URL params → filters restored on page load
- [ ] Search bar instant results → shows top 5
- [ ] Performance: search < 200ms for 500 products

---

## Future Enhancements

- **Search suggestions / autocomplete** (popular queries, category names)
- **Synonym mapping** ("earrings" = "ear rings" = "jhumka")
- **Hindi search support** (if customer base warrants it)
- **Visual search** (upload photo, find similar — far future)
- **Algolia migration** if PostgreSQL search becomes a bottleneck
