# 18 — PWA & Offline Support

**Priority:** P3 — Growth & Retention
**Repos:** qalachowk-frontend
**Estimated effort:** 2–3 days
**Dependencies:** None

---

## Problem

Many Indian customers browse on slow mobile connections (3G/patchy 4G). A PWA enables:

- "Add to Home Screen" for app-like experience without app store
- Offline browsing of previously viewed products
- Faster subsequent loads via service worker caching
- Push notifications (future)

---

## Solution Overview

Convert the Next.js app to a Progressive Web App using `next-pwa` or `@serwist/next`.

---

## Implementation

### Dependencies

```bash
yarn add @serwist/next serwist
```

### Web App Manifest (`src/app/manifest.ts`)

```typescript
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Qala Chowk — Handcrafted Artisan Store",
    short_name: "Qala Chowk",
    description: "Handcrafted Indian artisan jewellery and decor",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFAF5",
    theme_color: "#6A2901",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
```

### Service Worker Caching Strategy

| Resource                       | Strategy               | TTL     |
| ------------------------------ | ---------------------- | ------- |
| Static assets (JS, CSS, fonts) | Cache First            | 30 days |
| Product images                 | Cache First            | 7 days  |
| API: product list              | Stale While Revalidate | 1 hour  |
| API: product detail            | Stale While Revalidate | 1 hour  |
| HTML pages                     | Network First          | —       |
| Cart/checkout/account          | Network Only           | —       |

### Offline Fallback

When offline and resource not cached:

- Show a branded offline page: "You're offline. Browse products you've viewed recently."
- Display cached products from IndexedDB (already used for cart)

### Install Prompt

Custom "Add to Home Screen" banner:

- Show after 2nd visit (not first — avoid overwhelming new users)
- Dismissible, don't show again for 30 days
- Position: bottom sheet on mobile

---

## Testing Plan

- [ ] Lighthouse PWA audit → passes all criteria
- [ ] Add to Home Screen → installs correctly on Android/iOS
- [ ] Offline → cached pages load, offline fallback for uncached
- [ ] Slow 3G → meaningful paint under 3 seconds
- [ ] Service worker update → new version activates on next visit

---

## Metrics to Track

- PWA install rate
- Returning users from home screen
- Offline page views
- Time to first meaningful paint (before/after)
