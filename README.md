# Agentic Engineering System (AES)

> **The Epistemic Quality Gate, Anti-Slop & SEO Governance Framework for AI Coding Agents.**  
> Native support for **Claude Code**, **Cursor**, **Codex**, **Antigravity**, **Aider**, and **Copilot**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)](#faq)
[![SEO & AEO](https://img.shields.io/badge/SEO%20%26%20AEO-Automated-purple.svg)](#pillar-3-automated-seo--ai-search-aeo)

[**🇫🇷 Lire la documentation en Français**](README.fr.md)

---

## ⚡ In a Nutshell: What AES Does

When left unguided, AI coding agents produce **slop**: they invent fake customer reviews, make up arbitrary marketing numbers (*"+45% conversion!"*), break heading hierarchies (multiple `<h1>`s), forget canonical links, and claim *"Everything is 100% accessible and ready!"* without measuring anything.

**AES installs strict guardrails, automated SEO/AEO pipelines, and deterministic quality gates into your AI coding workflows.**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DEFAULT AI vs. AI WITH AES                       │
├──────────────────────────┬──────────────────────────────────────────────┤
│ ❌ Without AES           │ ✅ With AES                                  │
├──────────────────────────┼──────────────────────────────────────────────┤
│ Monolithic 800-line prompt│ Clean 5-Layer decoupled architecture         │
│ Invented pricing & stats │ Zero fake data; facts strictly enforced     │
│ Messy SEO, multiple H1s  │ 1 unique H1, sequential headings, llms.txt   │
│ Hallucinated bundle sizes│ Exact gzip bundle calculation (0 mental math)│
│ "100% WCAG AA" fake claim│ Honest epistemic status (MEASURED / UNMEASURED)│
│ Blind PASS release reports│ PASS WITH WARNINGS required if warnings exist│
└──────────────────────────┴──────────────────────────────────────────────┘
```

---

## 🏛️ The 4 Core Pillars

### Pillar 1: The 5-Layer Rule (No Context Pollution)
Prevents prompt bloat and prevents an agent from hallucinating data across different projects:
1. **GLOBAL (`rules/global-principles.md`)**: Tool-agnostic engineering ethics for 100% of projects.
2. **PROCEDURES (`scripts/`)**: Reusable deterministic verification scripts.
3. **PROJECT (`project.config.json`)**: Repository identity, domain, active languages, and gate thresholds.
4. **STACK (`rules/stack-*.md`)**: Framework, routing, and bundler constraints (React, Next.js, etc.).
5. **FACTS (`businessFacts`)**: Real verified business data (prices, legal notice, case studies).

### Pillar 2: Automated SEO & AI Search Engine Optimization (AEO)
Built-in scripts ensure your generated code is 100% crawlable by both traditional search engines and AI engines:
* **Headings Hierarchy:** Exactly **one `<h1>` per page** and strictly sequential order (`<h1>` ➔ `<h2>` ➔ `<h3>`). Checked via `check-headings.js`.
* **Canonical URLs:** Absolute canonical tags on every HTML page to eliminate duplicate content penalties.
* **Sitemap & Robots:** Validates absolute URLs in `sitemap.xml` and checks the sitemap directive in `robots.txt`.
* **`llms.txt` Standard:** Formats and validates the clean Markdown roadmap required by modern AI search crawlers (Perplexity, SearchGPT, Claude).

### Pillar 3: Epistemic Metrology & Anti-Slop
* **Strict 4-tier status:** Findings must be tagged as `MEASURED` (verified by script), `UNMEASURED` (real-world CWV requiring field tools), `ESTIMATED`, or `QUALITATIVE`.
* **Zero mental math:** Derived metrics (bundle sums, averages) are calculated automatically by `check-bundle-metrics.js`.
* **Zero Unicode emojis:** Emojis are banned in production code and UI; SVG icons are required.

### Pillar 4: Deterministic Zero-Dependency Quality Gates
Pure Node.js scripts that run locally in under 300ms without installing a single npm package:
* `check-bundle-metrics.js`: Exact byte & gzip calculations for HTML, CSS, JS.
* `check-headings.js`: Sequential heading audit.
* `check-a11y-images.js`: Alt attributes, explicit dimensions (CLS prevention), modern formats.
* `check-content-integrity.js`: Detects emojis and unverified marketing multiplier claims.
* `check-seo-canonical-llms.js`: Full SEO, sitemap, robots, and `llms.txt` audit.
* `self-check-report.js`: Enforces report integrity (verdict consistency, factual proofs).

---

## 🚀 Quickstart (60 Seconds)

### 1. Initialize AES in your project
```bash
npx aes init
```
*Creates `project.config.json` and `rules/global-principles.md`.*

### 2. Export instructions for your AI agent
```bash
# For Claude Code (creates CLAUDE.md)
npx aes export --target claude

# For Cursor (creates .cursor/rules/*.mdc)
npx aes export --target cursor

# For Antigravity / Gemini (creates GEMINI.md)
npx aes export --target gemini

# For Aider (creates CONVENTIONS.md)
npx aes export --target aider

# Export for all platforms at once
npx aes export --target all
```

### 3. Run Quality Gates
```bash
npx aes gate
```

Outputs the standard proof table:
```markdown
| Gate | Status | Proof |
| :--- | :---: | :--- |
| web-seo (headings) | **PASS** | 1 unique H1 verified, sequential hierarchy (8 HTML file(s)) |
| web-accessibility | **PASS** | Automated checks passed for tested criteria (12 image(s) with valid alt) |
| content-quality | **PASS** | 0 emojis, 0 unverified claims (12 file(s) scanned) |
| web-seo (infrastructure) | **PASS** | Canonical: PASS | Sitemap: PASS | Robots: PASS | llms.txt: PASS |
| web-performance (bundle) | **PASS** | HTML gzip: 3.8 kB | CSS gzip: 11.2 kB | JS gzip: 78.4 kB | Total: 93.4 kB (MEASURED) |
| web-performance (runtime CWV) | **UNMEASURED** | LCP, INP, CLS not measured locally (requires lab/RUM instrumentation) |
| web-i18n | **N/A** | Monolingual project |
| web-security | **N/A** | No dedicated backend or database |
```

---

## 🤖 Supported AI Coding Platforms

| Tool | Export Command | Generated File(s) |
| :--- | :--- | :--- |
| **Claude Code & Projects** | `npx aes export --target claude` | `CLAUDE.md` |
| **Cursor IDE** | `npx aes export --target cursor` | `.cursor/rules/global-principles.mdc` & `stack-rules.mdc` |
| **Google Antigravity & Gemini** | `npx aes export --target gemini` | `GEMINI.md` |
| **Aider CLI** | `npx aes export --target aider` | `CONVENTIONS.md` |
| **GitHub Copilot** | `npx aes export --target copilot` | `.github/copilot-instructions.md` |
| **OpenAI Codex / Assistants** | *System instructions* | See [Codex Guide](docs/adapters/codex.md) |

---

## ❓ FAQ

**Q: Does it install heavy dependencies?**  
No. All validation scripts use **0 external npm dependencies** (pure Node.js built-ins: `fs`, `path`, `zlib`). Execution is instantaneous.

**Q: Is it tied to a specific framework?**  
No. It works with React, Next.js, Vite, Astro, Vue, Svelte, or plain HTML/JS. Stack-specific rules are isolated in `rules/stack-*.md`.

**Q: What is `llms.txt`?**  
It is the emerging web standard allowing AI search engines (SearchGPT, Perplexity, Claude) to read and index your site without hallucinating. AES automatically validates its structure.

---

## 📚 In-Depth Documentation

* [Architecture: The 5-Layer Rule](docs/architecture.md)
* [Quality Gates & Epistemic Metrology](docs/quality-gates.md)
* [Spécification Architecturale (Français)](docs/architecture.fr.md)

---

## License

MIT © 2026 DevSupAi & Contributors. Free for personal, commercial, and open-source use.
