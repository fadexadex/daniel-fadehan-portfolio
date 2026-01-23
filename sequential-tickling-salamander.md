# Performance Fix Plan: Slow Project Detail Loading

## Problem Summary
Navigating to project details and back is slow due to:
1. **No loading UI** - Users see blank screen while data loads
2. **Disabled image optimization** - `unoptimized: true` serves full-size images
3. **Force dynamic rendering** - Every navigation triggers fresh Supabase fetch
4. **No caching** - Pages never cached, always re-rendered

---

## Root Causes (Confirmed)

| File | Issue |
|------|-------|
| `next.config.mjs:10` | `images: { unoptimized: true }` disables Next.js image optimization |
| `app/projects/[id]/page.tsx:17` | `export const dynamic = 'force-dynamic'` prevents caching |
| `app/projects/[id]/loading.tsx` | **Missing** - no loading skeleton exists |
| `app/page.tsx` | Also uses `force-dynamic` |

---

## Implementation Plan

### Phase 1: Quick Wins (High Impact, Low Effort)

#### 1.1 Create Loading Skeleton
**File to create:** `app/projects/[id]/loading.tsx`

Create a skeleton UI that matches the project detail layout. Next.js will automatically show this while the async server component loads.

#### 1.2 Enable Image Optimization
**File to modify:** `next.config.mjs`

- Remove `unoptimized: true`
- Add `remotePatterns` for Supabase storage domain
- Enable WebP/AVIF formats (60-80% smaller file sizes)

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**.supabase.co' },
  ],
  formats: ['image/avif', 'image/webp'],
}
```

---

### Phase 2: Caching Strategy

#### 2.1 Replace force-dynamic with ISR
**Files to modify:**
- `app/projects/[id]/page.tsx`
- `app/page.tsx`

Changes:
- Remove `export const dynamic = 'force-dynamic'`
- Add `export const revalidate = 3600` (revalidate hourly)
- Add `generateStaticParams()` to pre-build project pages

This allows:
- Cached pages served instantly
- Background revalidation every hour
- On-demand revalidation when content updates

---

### Phase 3: Navigation Optimization

#### 3.1 Smart Back Button
**File to create:** `components/project-back-button.tsx`

Replace the current `<Link href="/#projects">` with a client component that:
- Uses `router.back()` when coming from home (instant, uses cache)
- Falls back to `router.push("/#projects")` otherwise
- Smooth scrolls to projects section

**File to modify:** `app/projects/[id]/page.tsx`
- Import and use the new `ProjectBackButton` component

---

## Files Summary

| Action | File Path |
|--------|-----------|
| **Create** | `app/projects/[id]/loading.tsx` |
| **Create** | `components/project-back-button.tsx` |
| **Modify** | `next.config.mjs` |
| **Modify** | `app/projects/[id]/page.tsx` |
| **Modify** | `app/page.tsx` |

---

## Expected Results

| Metric | Before | After |
|--------|--------|-------|
| Initial load | Blank screen → content | Skeleton → content |
| Image size | ~500KB (original) | ~80KB (WebP) |
| Repeat visit | Full fetch | Instant (cached) |
| Back navigation | ~1-2s | <100ms |

---

## Verification

1. Navigate to a project - should see skeleton, not blank
2. Check Network tab - images should load as WebP from `/_next/image`
3. Navigate back and forth - second visit should be instant
4. Run `npm run build` - should show static pages generated
