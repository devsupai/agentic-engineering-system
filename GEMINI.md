# Antigravity & Gemini Directives: MyProject

> **Agentic Engineering System (AES) Directives**

---

## 1. Global Principles
# Core Engineering Principles for AI Agents

These universal principles apply to all software development projects governed by this system. They define non-negotiable requirements for technical excellence, factual integrity, accessibility, security, performance, and continuous verification.

---

## 1. Prior Analysis & Non-Regression

* **Analyze before action:** Always inspect and understand the project architecture, dependencies, and existing code before proposing or making changes.
* **Surgical precision & non-regression:** Strictly preserve existing working functionality. Modify only the files directly relevant to the current task. Never introduce breaking side-effects.
* **Risk assessment:** Identify potential collateral impacts before attempting refactoring, schema updates, or dependency upgrades.

---

## 2. 5-Layer Separation of Concerns

To prevent context rot, agent hallucinations, and prompt bloat, engineering rules are strictly decoupled into 5 layers:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GLOBAL (rules/global-principles.md)                      │
│    Universal, tool-agnostic principles for 100% of projects.│
├─────────────────────────────────────────────────────────────┤
│ 2. SKILLS / PROCEDURES (skills/* or agent capabilities)     │
│    Specialized, reusable operational procedures.            │
├─────────────────────────────────────────────────────────────┤
│ 3. PROJECT (project.config.json & project instructions)     │
│    Identity, domains, languages, and project-specific scope.│
├─────────────────────────────────────────────────────────────┤
│ 4. STACK (rules/stack-*.md)                                 │
│    Technology constraints (framework, router, bundler).     │
├─────────────────────────────────────────────────────────────┤
│ 5. FACTS (verified factual business data)                   │
│    Real verified data (pricing, legal notices, case studies)│
└─────────────────────────────────────────────────────────────┘
```

Never mix business data or stack-specific quirks into the global layer.

---

## 3. Epistemic Integrity, Metrology & Anti-Slop

* **Zero fabricated data:** Absolute prohibition against fabricating prices, pricing tiers, terms of service, partners, certifications, or fictitious client reviews.
* **Zero fabricated statistics:** Never insert arbitrary percentages or unverified marketing promises (e.g., *"+40% conversion rate"*).
* **Strict 4-tier Epistemic Status:** Every reported outcome must be categorized into one of 4 mutually exclusive statuses:
  * `MEASURED`: Result obtained from a test or tool actually executed (e.g., `JS bundle = 89.17 kB gzip`).
  * `UNMEASURED`: Metric impossible to measure in local build or not yet executed (e.g., real-world Core Web Vitals, LCP/INP/CLS without lab or RUM instrumentation).
  * `ESTIMATED`: A calculated projection explicitly announced as an estimate.
  * `QUALITATIVE`: Technical assessment derived from a code review; never considered a physical measurement.
* **Automated calculation of derivable metrics:** When a report includes a sum, average, percentage, or derived metric:
  1. Always calculate it via an automated script or tool;
  2. Use the exact calculated number;
  3. Never approximate or perform mental arithmetic;
  4. If underlying data is missing ➔ flag as `UNMEASURED`.
* **No automated subjective value judgments:** Scripts detect objective facts (forbidden patterns, missing metadata, broken structures). Never programmatically decide content is "poor" or "too commercial" without objective criteria. Human feedback falls under `WARN` or `QUALITATIVE`.

---

## 4. Visual Standards & Accessibility (A11y)

* **Honest accessibility scope:**
  * Automated testing alone **NEVER** justifies claiming "WCAG 2.2 AA compliant" or "100% accessible".
  * Mandatory disclosure: *"Automated accessibility checks passed for tested criteria"* (specifying exact criteria).
  * Explicitly separate: tested criteria, un-tested criteria, and manual audit requirements.
* **Technical criteria:** Enforce compliant contrast ratios (>= 4.5:1), complete keyboard navigability, visible focus rings, and explicit `<label>` associations for inputs.
* **Hidden interactive components:** Always neutralize hidden interactive elements (`aria-hidden="true"`) using the HTML `inert` attribute.
* **Accessibility tree & ARIA validity:** Never use `aria-pressed` on links (`<a>`, `<Link>`); use `aria-current="page"` to indicate active pages or locales.
* **Zero emojis in production:** Unicode emoji icons are strictly prohibited in production interfaces and production code. Use calibrated SVG vector icons or the project's official icon system.

---

## 5. SEO & AI Search (AEO)

* **Heading hierarchy:** Exactly **one and only one `<h1>`** per page, followed by a strictly sequential structure (`<h1>` ➔ `<h2>` ➔ `<h3>`) without level skipping.
* **Indexability & canonization:** Unique page titles, high-intent meta descriptions, absolute canonical URLs, synchronized `sitemap.xml`, and valid `robots.txt`.
* **LLM Engine Optimization:** Maintain a well-structured, factual `llms.txt` file summarizing site architecture and documentation for AI search engines.
* **Intent separation:** Clearly decouple transactional/conversion pages from informational/educational content.

---

## 6. Web Performance & Asset Hygiene

* **Physical metrics vs. Real user performance:**
  * Local tooling measures physical assets: bundle size, file count, gzip size, blocking scripts.
  * A small bundle alone does not equal "fast real-world performance". Real CWV metrics (LCP, INP, CLS) remain `UNMEASURED` until verified in instrumented environments.
* **Asset optimization:** Modern formats (WebP, AVIF, SVG), lossless compression, explicit `width`, `height`, and `aspect-ratio` to eliminate CLS.
* **Code sobriety:** Route-level code splitting, strategic lazy loading, dependency audits, deferred execution of non-critical scripts.

---

## 7. Security & Privacy

* **Strict secret isolation:** Zero API keys, private tokens, service credentials, or database passwords committed in code or client-side assets.
* **Authentication != Authorization:** Authentication alone confers no privileges. Enforce robust server-side permission checks and database security rules (RLS, Firestore Rules).
* **Input validation:** Strictly validate and sanitize all user input and external payloads.

---

## 8. Internationalization (i18n)

* **Multilingual projects:** Strict route parity across all active locales, translated metadata, localized canonicals, and reciprocal `hreflang` tags including `x-default`.
* **Monolingual projects:** Keep the architecture simple without unnecessary i18n scaffolding; mark i18n quality gates as `N/A`.

---

## 9. Continuous Quality Gates & Definition of Done

* **Continuous prevention:** Quality gates are applied progressively (*Create ➔ Check ➔ Fix ➔ Validate*).
* **Mandatory factual proof per Quality Gate:** Every gate must output an objective, verifiable proof:
  `| Gate | Status | Proof |`
  Vague adjectives (*"clean"*, *"optimized"*, *"compliant"*) are strictly forbidden without tangible evidence.
* **Strict global verdict consistency:**
  * `PASS`: When all requirements are satisfied with proof.
  * `PASS WITH WARNINGS`: When justified warnings (`WARN`) exist without blocking release (the report MUST detail each `WARN`).
  * `FAIL`: When at least one critical gate fails.
  * **Absolute prohibition** against declaring a global `PASS` if unresolved `WARN` items remain unacknowledged.
* **Report self-check:** Every audit or release report must pass internal consistency validation (matching counts, correct statuses, epistemic separation).
* **Definition of Done:** A task is complete only when the build succeeds, automated scripts pass, regressions are ruled out, and the factual summary is verified.


---

## 2. Stack Constraints
# Stack Rules: React 19 + Vite + SSG / SPA

These rules govern projects built with React 19, Vite, and Static Site Generation (SSG) or client-side routing.

---

## 1. Build & Compilation Constraints

* **Modern Bundling:** Use Vite with ESM (`vite build`).
* **Route Pre-rendering:** When SSG is enabled, all public routes must be pre-rendered to HTML to guarantee crawlability and rich preview generation without JavaScript execution.
* **TypeScript Strictness:** Strict mode enabled (`strict: true`). Zero `any` types without written justification.

---

## 2. Routing & Navigation

* **React Router v7 / TanStack Router:**
  * Active links must use `aria-current="page"` (never `aria-pressed`).
  * Scroll restoration must be active on route transitions.
* **404 / Fallback Handling:** A static 404 page must be generated during build.

---

## 3. SEO & Structured Data in React

* **Helmet / Meta Management:** Use `@unhead/react`, `react-helmet-async`, or native SSG meta injection to ensure meta tags and JSON-LD schemas exist in the initial static HTML, not merely injected via client-side DOM mutation.
* **One H1 per view:** Every rendered page component must have exactly one `<h1>`.

---

## 4. Assets & Bundles

* **Image Pipeline:** Prefer modern formats (`.webp`, `.svg`). Images must declare explicit `width` and `height` or `aspect-ratio` CSS to avoid layout shifts.
* **Dynamic Imports:** Code-split non-critical routes and large vendor libraries using `React.lazy()` or Vite dynamic imports.


---

## 3. Execution Verification
Execute `node scripts/run-quality-gate.js .` to produce the standard Quality Gate proof table.
