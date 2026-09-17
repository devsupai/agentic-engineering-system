# Stack Rules: Next.js (App Router)

These rules govern projects built with Next.js using the App Router.

---

## 1. Server Components vs Client Components

* **Server by default:** Keep components as React Server Components (`RSC`) unless interactivity, event handlers, or browser APIs (`useState`, `useEffect`, `window`) are strictly required.
* **Leaf Client Components:** Push `"use client"` directives down to leaf interactive components. Never mark an entire page or layout `"use client"` when static children can be server-rendered.

---

## 2. Metadata & SEO

* **Metadata API:** Export static or dynamic `metadata` objects using Next.js native `generateMetadata()`. Never manually inject raw `<head>` tags in layout/page bodies.
* **OpenGraph & Robots:** Use native `app/robots.ts` and `app/sitemap.ts` to guarantee type-safe, synchronized crawlers configuration.
* **JSON-LD Schema:** Inject JSON-LD using `<script type="application/ld+json">` directly in server components.

---

## 3. Images & Fonts

* **next/image:** Use `next/image` with explicit dimensions or fill mode. Set `priority` only on above-the-fold hero images.
* **next/font:** Use `next/font/google` or `next/font/local` to eliminate external Google Fonts render-blocking requests and avoid layout shifts.

---

## 4. Production Build & Static Export

* **Static Export (`output: 'export'`):** If building for static hosting (S3, Cloudflare Pages, GitHub Pages), verify that all dynamic routes export valid static parameters via `generateStaticParams()`.
* **Zero build errors:** `next build` must complete with zero ESLint or TypeScript errors.
