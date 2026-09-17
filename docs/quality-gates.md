# Quality Gates & Epistemic Metrology Specification

In modern AI-assisted engineering, agents tend to generate self-congratulatory reports stating *"All tests passed, 100% compliant, ready for production!"* even when nothing was tested.

The **Agentic Engineering System (AES)** replaces qualitative hallucination with deterministic verification.

---

## 1. The 4 Epistemic Categories

Every claim or metric in a report or audit must be explicitly categorized:

| Category | Definition | Example |
| :--- | :--- | :--- |
| **`MEASURED`** | Direct physical measurement produced by local execution of a script or tool. | `JS bundle gzip: 82.4 kB (MEASURED)` |
| **`UNMEASURED`** | Physical metric not measured or impossible to test locally in offline build. | `Core Web Vitals (LCP, INP, CLS) UNMEASURED` |
| **`ESTIMATED`** | A calculated projection, explicitly announced as a theoretical estimate. | `Estimated monthly CDN bandwidth: 12 GB` |
| **`QUALITATIVE`** | Assessment derived from human or agent code inspection; never a physical metric. | `Code structure follows clean architecture` |

---

## 2. Derivable Metrics Calculation Law

Whenever an agent presents a total, an average, a sum, or a percentage:
1. **Never calculate mentally:** The LLM must not guess or estimate numbers.
2. **Execute a deterministic script:** Use `node scripts/check-bundle-metrics.js`.
3. **Copy the exact output:** The report must contain the exact computed number.
4. **Missing data = UNMEASURED:** If source data does not exist, mark the metric `UNMEASURED`.

---

## 3. The Quality Gate Table

Every audit report or release summary must include a standard Quality Gate table:

```markdown
| Gate | Status | Proof |
| :--- | :---: | :--- |
| web-seo (headings) | **PASS** | 1 unique H1 verified, sequential hierarchy (8 HTML file(s)) |
| web-accessibility | **PASS** | Automated checks passed for tested criteria (14 image(s) with valid alt) |
| content-quality | **PASS** | 0 emojis, 0 unverified claims (12 file(s) scanned) |
| web-seo (infrastructure) | **PASS** | Canonical: PASS | Sitemap: PASS | Robots: PASS | llms.txt: PASS |
| web-performance (bundle) | **PASS** | HTML gzip: 4.1 kB \| CSS gzip: 12.3 kB \| JS gzip: 82.4 kB \| Total: 98.8 kB (MEASURED) |
| web-performance (runtime CWV) | **UNMEASURED** | LCP, INP, CLS not measured locally (requires lab/RUM instrumentation) |
| web-i18n | **N/A** | Monolingual project |
| web-security | **N/A** | No dedicated backend or database |
```

### Prohibited Words in Proof Column
Isolated vague adjectives like `OK`, `Compliant`, `Clean`, `Good`, or `Optimized` without data are rejected by `scripts/self-check-report.js`.

---

## 4. Verdict Logic & Non-Contradiction

The global verdict of a release or audit follows strict boolean consistency:

* **`PASS`**: Every gate is `PASS`, `N/A`, or `UNMEASURED`. Zero `WARN` and zero `FAIL`.
* **`PASS WITH WARNINGS`**: At least one gate is `WARN`, and zero gates are `FAIL`. The report **must** enumerate each warning and explain why release is permitted.
* **`FAIL`**: At least one critical gate is `FAIL`.

> [!CAUTION]
> It is strictly forbidden to declare a global verdict of `PASS` when unresolved `WARN` gates exist.
