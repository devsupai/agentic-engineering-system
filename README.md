# Agentic Engineering System (AES)

> **Modular, Epistemic, and Automated Software Governance for AI Coding Agents.**  
> Native support for **Claude Code**, **Cursor**, **Codex**, **Antigravity**, **Aider**, and **Copilot**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Quality Gates](https://img.shields.io/badge/Quality%20Gates-Continuous-blueviolet.svg)](#quality-gates)
[![Epistemic Rigor](https://img.shields.io/badge/Epistemics-Strict-orange.svg)](#epistemic-metrology)

[**🇫🇷 Lire la documentation en Français**](README.fr.md)

---

## 1. Why AES Exists

When developers build software with autonomous AI coding agents, they quickly run into three critical bottlenecks:

1. **The Prompt Bloat & Context Rot Trap:** All instructions, business facts, and stack quirks get dumped into a single monolithic file (`CLAUDE.md`, `.cursorrules`). Agents get overwhelmed, selectively forget rules, or hallucinate Project A's data into Project B.
2. **AI Slop & Fabricated Data:** By default, LLMs invent commercial claims, fake user testimonials, arbitrary statistics (*"+40% conversion rate"*), and claim *"100% WCAG AA compliant"* without running accessibility tools.
3. **Complaisant Hallucinated Reports:** Agents announce *"All gates passed! Ready for production!"* based on mental estimates and blind optimism without executing real verification scripts.

**AES solves this** by introducing:
* **The 5-Layer Rule:** A clean, decoupled hierarchy separating universal principles from stack constraints and business facts.
* **Epistemic Metrology:** A non-negotiable classification separating measured physical data (`MEASURED`) from unmeasured real-world metrics (`UNMEASURED`).
* **Deterministic Quality Gates:** Fast, zero-dependency Node.js scripts that calculate exact bundle sizes, enforce sequential heading hierarchies, audit image accessibility, and self-check audit reports.

---

## 2. The 5-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GLOBAL (rules/global-principles.md)                      │
│    Universal principles for 100% of projects. Tool-agnostic.│
├─────────────────────────────────────────────────────────────┤
│ 2. PROCEDURES & SKILLS (skills/* or tool functions)         │
│    Specialized, on-demand operational workflows.            │
├─────────────────────────────────────────────────────────────┤
│ 3. PROJECT (project.config.json & agent instructions)       │
│    Repository identity, active locales, and gate thresholds.│
├─────────────────────────────────────────────────────────────┤
│ 4. STACK (rules/stack-*.md)                                 │
│    Framework, router, bundler, and architecture conventions.│
├─────────────────────────────────────────────────────────────┤
│ 5. FACTS (businessFacts in project.config.json)             │
│    Verified human data (real pricing, legal terms, cases).  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Quick Start in 60 Seconds

### Step 1: Initialize in your project
```bash
# In your existing repository or new project:
npx aes init
```
This generates:
* `project.config.json`: The single factual identity card of your project.
* `rules/global-principles.md`: The universal agent principles.

### Step 2: Export adapter for your agent
Generate platform-specific instruction files from your single source of truth:

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

### Step 3: Run Continuous Quality Gates
```bash
# Run the complete test suite:
npx aes gate

# Or use npm scripts:
npm run gate
```

---

## 4. Epistemic Metrology & The 4 Statuses

AES forbids agents from approximating physical metrics or claiming unverified compliance. Every finding must be explicitly tagged:

* **`MEASURED`**: Produced by an executed script (e.g. `JS gzip: 89.17 kB`).
* **`UNMEASURED`**: Impossible to measure locally (e.g. Core Web Vitals LCP/INP/CLS in local build without RUM/lab environment).
* **`ESTIMATED`**: A projection explicitly announced as a theoretical estimate.
* **`QUALITATIVE`**: Subjective code review observation, never a physical measurement.

### Standard Quality Gate Proof Table

Agents must output their release findings in a strict tabular format with tangible proof:

| Gate | Status | Proof |
| :--- | :---: | :--- |
| **`web-seo (headings)`** | **PASS** | 1 unique H1 verified, sequential hierarchy (8 HTML file(s)) |
| **`web-accessibility`** | **PASS** | Automated checks passed for tested criteria (12 image(s) with valid alt) |
| **`content-quality`** | **PASS** | 0 emojis, 0 unverified claims (12 file(s) scanned) |
| **`web-seo (infrastructure)`** | **PASS** | Canonical: PASS \| Sitemap: PASS \| Robots: PASS \| llms.txt: PASS |
| **`web-performance (bundle)`** | **PASS** | HTML gzip: 3.8 kB \| CSS gzip: 11.2 kB \| JS gzip: 78.4 kB \| Total bundle gzip: 93.4 kB (MEASURED) |
| **`web-performance (runtime CWV)`**| **UNMEASURED** | LCP, INP, CLS not measured locally (requires lab/RUM instrumentation) |
| **`web-i18n`** | **N/A** | Monolingual project |
| **`web-security`** | **N/A** | No dedicated backend or database |

---

## 5. Built-in Deterministic Verification Scripts

The `scripts/` directory contains zero-dependency, ultra-fast Node.js scripts:

| Script | Purpose |
| :--- | :--- |
| `scripts/run-quality-gate.js` | Full Quality Gate orchestrator and proof table builder. |
| `scripts/check-bundle-metrics.js` | Calculates exact raw and gzip sizes for HTML, CSS, and JS (zero mental math). |
| `scripts/check-headings.js` | Enforces single H1 per page and strictly sequential heading hierarchy (H1 ➔ H2 ➔ H3). |
| `scripts/check-a11y-images.js` | Audits image alt attributes, modern format adoption, and explicit width/height dimensions. |
| `scripts/check-content-integrity.js`| Anti-slop engine: detects Unicode emojis in code and flags unverified multiplier claims. |
| `scripts/check-seo-canonical-llms.js`| Validates canonical tags, sitemap.xml, robots.txt, and AI crawler format (`llms.txt`). |
| `scripts/self-check-report.js` | Auto-validates audit reports: ensures no contradictions (e.g. PASS when warnings exist). |

---

## 6. GitHub Actions CI/CD Integration

AES includes an automated CI workflow in `.github/workflows/quality-gates.yml`:

```yaml
name: Quality Gates
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: node scripts/run-quality-gate.js .
      - run: node scripts/check-bundle-metrics.js .
      - run: node scripts/check-content-integrity.js .
```

---

## 7. Supported AI Platforms

| Platform | Integration Method | Documentation |
| :--- | :--- | :--- |
| **Claude Code & Projects** | `CLAUDE.md` + CLI Terminal tool calls | [Claude Guide](docs/adapters/claude.md) |
| **Cursor IDE** | `.cursor/rules/*.mdc` (multi-rule globs) | [Cursor Guide](docs/adapters/cursor.md) |
| **OpenAI Codex & Assistants**| System prompt + Tool/Function Calling | [Codex Guide](docs/adapters/codex.md) |
| **Google Antigravity & Gemini**| `GEMINI.md` + Custom Skills | [Antigravity Guide](docs/adapters/antigravity.md) |
| **Aider** | `CONVENTIONS.md` | `npx aes export --target aider` |
| **GitHub Copilot** | `.github/copilot-instructions.md` | `npx aes export --target copilot` |

---

## 8. Documentation

* [Architecture: The 5-Layer System](docs/architecture.md)
* [Quality Gates & Epistemic Metrology](docs/quality-gates.md)
* [Spécification Architecturale (Français)](docs/architecture.fr.md)

---

## License

MIT © 2026 DevSupAi & Contributors. Free for personal, commercial, and open-source use.
