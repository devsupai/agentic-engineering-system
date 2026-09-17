# Project AI Agent Directives

> **Notice to AI Coding Assistant:**
> You are working in a codebase governed by the **Agentic Engineering System (AES)**.
> You must strictly follow the core principles and quality standards below.

---

## 1. Governance & 5-Layer Separation

* Read `rules/global-principles.md` for foundational non-negotiable rules.
* Read the stack constraints in the configured stack rules file (see `project.config.json`).
* Only use factual data defined in `project.config.json` (`businessFacts`). **Never invent pricing, partnerships, testimonials, or fake metrics.**

---

## 2. Epistemic Statuses

In every summary or audit report, you must classify every finding into one of 4 strict categories:
* `MEASURED`: Physical metric calculated by a real script or tool run locally.
* `UNMEASURED`: Metric not measured or impossible to measure locally (e.g., real Core Web Vitals).
* `ESTIMATED`: Calculated projection explicitly labelled as an estimate.
* `QUALITATIVE`: Qualitative code review observation, never a physical measurement.

---

## 3. Definition of Done & Quality Gates

Before concluding any feature or bug fix:
1. Ensure the project builds cleanly without TypeScript, lint, or bundling errors.
2. Run automated validation: `npm run gate` (or `node scripts/run-quality-gate.js`).
3. Output the Quality Gate table with factual proof:
   `| Gate | Status | Proof |`
4. If warnings (`WARN`) exist, the verdict must be `PASS WITH WARNINGS` (or `FAIL` if blocking). **Never output `PASS` while unresolved `WARN` items remain.**
