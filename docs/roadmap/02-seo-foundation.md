# 02 — SEO Foundation

**Priority:** P0 — Launch Blocker
**Repos:** qalachowk-frontend
**Estimated effort:** 2–3 days
**Dependencies:** None

---

## Problem

The storefront has zero SEO infrastructure. No sitemap, no robots.txt, no dynamic metadata, no structured data. Google cannot properly index or rank any page. For a handicraft e-commerce brand competing on organic search, this is a launch blocker.

---

## Solution Overview

1. Dynamic metadata for every page (title, description, og:image)
2. `sitemap.xml` auto-generated from product/category data
3. `robots.txt` allowing full crawl
4. JSON-LD structured data (Product, Organization, BreadcrumbList)
5. Canonical URLs

---

## 1. Dynamic Metadata per Page

Next.js App Router supports `generateMetadata()` for server components.

### Home (`src/app/page.tsx`)

```typescript
export const metadata: Metadata = {
  title: "Qala Chowk — Handcrafted Indian Artisan Jewellery & Decor",
  description:
    "Discover handcrafted brass, silver, and copper jewellery and home decor from Rajasthani artisans. Free shipping across India.",
  openGraph: {
    title: "Qala Chowk — Preserving Heritage Through Handcrafted Excellence",
    description:
      "Authentic Indian handicrafts, handmade by artisans in Jaipur.",
    url: "https://qalachowk.com",
    siteName: "Qala Chowk",
    images: [{ url: "/og-home.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://qalachowk.com",
  },
};
```

### Shop (`src/app/shop/page.tsx`)

```typescript
export const metadata: Metadata = {
  title: "Shop All Products — Qala Chowk",
  description:
    "Browse our complete collection of handcrafted jewellery, home decor, and artisan goods.",
  alternates: { canonical: "https://qalachowk.com/shop" },
};
```

### Product Detail (`src/app/categories/[category]/[productName]/page.tsx`)

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await fetchProduct(params.productName);
  return {
    title: `${product.name} — Qala Chowk`,
    description: product.metaDescription || product.description?.slice(0, 160),
    openGraph: {
      title: product.metaTitle || product.name,
      description:
        product.metaDescription || product.description?.slice(0, 160),
      images: [{ url: product.images[0]?.url }],
      type: "website",
    },
    alternates: {
      canonical: `https://qalachowk.com/categories/${params.category}/${params.productName}`,
    },
  };
}
```

### Category (`src/app/categories/[category]/page.tsx`)

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.category).replace(/-/g, " ");
  return {
    title: `${categoryName} — Qala Chowk`,
    description: `Explore our ${categoryName} collection. Handcrafted by Indian artisans.`,
    alternates: {
      canonical: `https://qalachowk.com/categories/${params.category}`,
    },
  };
}
```

### Static Pages

Apply static metadata to: `/craft`, `/contact`, `/privacy-policy`, `/terms`, `/return-policy`, `/shipping-policy`, `/account`, `/wishlist`.

Pattern:

```typescript
export const metadata: Metadata = {
  title: "Page Name — Qala Chowk",
  description: "...",
  alternates: { canonical: "https://qalachowk.com/page-slug" },
};
```

---

## 2. Sitemap

Create `src/app/sitemap.ts` (Next.js auto-serves at `/sitemap.xml`):

```typescript
import type { MetadataRoute } from "next";

const BASE_URL = "https://qalachowk.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    "",
    "/shop",
    "/craft",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/return-policy",
    "/shipping-policy",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.7,
  }));

  // Dynamic: products
  const productsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v1/products?limit=1000`,
  );
  const products = (await productsRes.json()).data || [];
  const productPages = products.map((p: any) => ({
    url: `${BASE_URL}/categories/${p.category?.slug || "all"}/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Dynamic: categories
  const categorySlugs = [
    ...new Set(products.map((p: any) => p.category?.slug).filter(Boolean)),
  ];
  const categoryPages = categorySlugs.map((slug) => ({
    url: `${BASE_URL}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
```

---

## 3. Robots.txt

Create `src/app/robots.ts`:

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cart",
          "/checkout",
          "/account",
          "/order-confirmed",
          "/order-details",
        ],
      },
    ],
    sitemap: "https://qalachowk.com/sitemap.xml",
  };
}
```

---

## 4. JSON-LD Structured Data

### Organization (root layout)

```typescript
// src/app/layout.tsx — add to <head>
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Qala Chowk",
  url: "https://qalachowk.com",
  logo: "https://qalachowk.com/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8769931749",
    contactType: "customer service",
    email: "care@qalachowk.com",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "7/ma/144, Indira Gandhi Nagar, Jagatpura",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    postalCode: "302017",
    addressCountry: "IN",
  },
  sameAs: [
    // Add social media URLs when available
  ],
};
```

### Product (product detail page)

```typescript
const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.images.map((img) => img.url),
  sku: product.sku,
  brand: {
    "@type": "Brand",
    name: "Qala Chowk",
  },
  offers: {
    "@type": "Offer",
    url: canonicalUrl,
    priceCurrency: "INR",
    price: product.isOnSale ? product.salePrice : product.price,
    availability:
      product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    seller: { "@type": "Organization", name: "Qala Chowk" },
  },
  // Add when reviews exist:
  // aggregateRating: { ... }
};
```

### BreadcrumbList (product & category pages)

```typescript
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://qalachowk.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: category.name,
      item: `https://qalachowk.com/categories/${category.slug}`,
    },
    { "@type": "ListItem", position: 3, name: product.name },
  ],
};
```

### Render JSON-LD

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

---

## 5. Additional SEO Improvements

### Image Alt Text

Ensure all `<Image>` tags have descriptive `alt` attributes:

- Product images: `alt={product.name}`
- Category images: `alt={category.name + " collection"}`
- Hero/editorial: descriptive alt text

### Heading Hierarchy

Audit each page for proper `<h1>` → `<h2>` → `<h3>` nesting. Each page should have exactly one `<h1>`.

### URL Structure

Current: `/categories/[category]/[productName]` — good.
Ensure all slugs are lowercase, hyphenated, no special characters.

### Favicon & App Icons

Ensure `src/app/favicon.ico` and `src/app/icon.png` exist for browser tabs and social shares.

---

## Testing Plan

- [ ] Run Lighthouse SEO audit — target score 95+
- [ ] Validate sitemap.xml loads and lists all products
- [ ] Validate robots.txt via Google Search Console
- [ ] Test structured data with Google Rich Results Test
- [ ] Verify Open Graph previews with Facebook Sharing Debugger
- [ ] Check all pages have unique `<title>` and `<meta description>`
- [ ] Verify canonical URLs resolve correctly
- [ ] Mobile-friendly test via Google Search Console

---

## Post-Launch

- Submit sitemap to Google Search Console
- Submit sitemap to Bing Webmaster Tools
- Monitor Core Web Vitals in Search Console
- Track organic traffic growth in GA4
