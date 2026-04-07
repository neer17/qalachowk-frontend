# 16 — Content/Blog for SEO

**Priority:** P3 — Growth & Retention
**Repos:** qalachowk-frontend
**Estimated effort:** 2–3 days (infra), ongoing (content)
**Dependencies:** 02-seo-foundation.md

---

## Problem

Organic search is the cheapest customer acquisition channel for niche e-commerce. The site has no content beyond product listings. A blog targeting long-tail keywords ("brass jewellery care tips", "Rajasthani handicraft history", "best gifts for Diwali") would drive discovery and establish brand authority.

---

## Solution Overview

**MDX-based blog** using Next.js App Router. Lightweight, no CMS needed initially — content as code, deployed with the app.

---

## Implementation

### Directory Structure

```
src/app/blog/
├── page.tsx                    # Blog listing
├── [slug]/page.tsx             # Individual post
└── layout.tsx                  # Blog layout (optional)

content/blog/
├── brass-jewellery-care.mdx
├── rajasthani-craft-heritage.mdx
└── gift-guide-diwali-2026.mdx
```

### Dependencies

```bash
yarn add @next/mdx @mdx-js/loader @mdx-js/react
```

### Post Frontmatter

```mdx
---
title: "How to Care for Brass Jewellery"
description: "A complete guide to cleaning, storing, and maintaining your brass jewellery pieces."
date: "2026-04-10"
author: "Qala Chowk"
category: "Care Guide"
tags: ["brass", "jewellery care", "maintenance"]
image: "/blog/brass-care-hero.jpg"
---
```

### Blog Listing Page

- Card grid: image, title, excerpt, date, category
- Category filter tabs
- Sorted by date (newest first)
- 12 posts per page with pagination

### Post Page

- Hero image
- Title, date, author, category
- MDX content (supports React components inline)
- Related products section (manual or tag-based)
- "Share" buttons (WhatsApp, copy link)
- Schema.org `BlogPosting` structured data

### SEO

- Each post generates dynamic metadata
- Posts included in sitemap.xml
- Internal linking to product pages from content

### Content Strategy (first 10 posts)

| Topic                                      | Target Keyword                 | Type          |
| ------------------------------------------ | ------------------------------ | ------------- |
| How to Care for Brass Jewellery            | brass jewellery care           | Guide         |
| The Art of Rajasthani Handicrafts          | rajasthani handicrafts         | Brand story   |
| Diwali Gift Guide 2026                     | diwali gifts online            | Seasonal      |
| Silver vs Brass: Which Jewellery Is Right? | silver vs brass jewellery      | Comparison    |
| Behind the Craft: Meet Our Artisans        | handcrafted jewellery india    | Brand story   |
| How to Style Statement Earrings            | statement earrings styling     | Guide         |
| The History of Thewa Art                   | thewa art rajasthan            | Educational   |
| Wedding Season Jewellery Picks             | wedding jewellery ideas        | Seasonal      |
| Sustainable Fashion: Why Handmade Matters  | sustainable handmade jewellery | Thought piece |
| Home Decor Ideas with Brass Accents        | brass home decor ideas         | Guide         |

---

## Future: Headless CMS

When content volume > 30 posts, migrate to a headless CMS (Sanity, Contentful, or Strapi) for non-developer content management. The Next.js rendering layer stays the same — only the data source changes.
