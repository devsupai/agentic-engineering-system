# Architectural Specification: The 5-Layer System

The **Agentic Engineering System (AES)** prevents prompt degradation, hallucinations, and context pollution by enforcing a strict 5-layer separation of concerns.

---

## The Problem: Monolithic Prompts & Context Rot

When building software with AI coding agents (Claude Code, Cursor, Codex, Copilot), developers typically start with a single instruction file (e.g. `CLAUDE.md`, `.cursorrules`, `SYSTEM_PROMPT.md`). 

Over time, this file decays into an unmaintainable monolith mixing:
1. **Universal engineering ethics** (security, accessibility, non-regression).
2. **Framework & bundler specifics** (Next.js App Router, Vite, React 19).
3. **Transient business rules** (pricing tiers, company registration numbers, founders' names).
4. **Ad-hoc checklists and runbooks**.

This causes three severe issues:
* **Context Pollution:** An agent working on Project B hallucinates business data from Project A because it was hardcoded in a global prompt.
* **Instruction Dilution:** As rules multiply, models selectively ignore foundational constraints.
* **Prompt Bloat:** Excessive token overhead before the agent even begins reading codebase files.

---

## The Solution: The 5-Layer Rule

AES decouples instructions into 5 autonomous layers:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GLOBAL (rules/global-principles.md)                      │
│    Universal, tool-agnostic principles for 100% of projects.│
├─────────────────────────────────────────────────────────────┤
│ 2. SKILLS / PROCEDURES (skills/* or agent functions)       │
│    Specialized, on-demand operational workflows.            │
├─────────────────────────────────────────────────────────────┤
│ 3. PROJECT (project.config.json & local agent directives)   │
│    Identity, domains, active locales, and local scope.      │
├─────────────────────────────────────────────────────────────┤
│ 4. STACK (rules/stack-*.md)                                 │
│    Framework, bundler, router, and architectural patterns.  │
├─────────────────────────────────────────────────────────────┤
│ 5. FACTS (businessFacts in project.config.json)             │
│    Verified, real data (pricing, legal terms, case studies).│
└─────────────────────────────────────────────────────────────┘
```

### Layer 1: Global Principles
* **Scope:** 100% of projects, forever.
* **Contains:** Non-regression requirements, epistemic integrity, 4-status rule, zero fake stats, accessibility AA standard without overpromising, zero emojis in production.
* **Forbidden:** Any framework name (React, Vue), any company name, any pricing data.

### Layer 2: Skills & Operational Procedures
* **Scope:** Reusable across multiple projects, invoked only when needed.
* **Contains:** Specialized procedures (e.g. performing an SEO audit, calculating bundle sizes, generating Schema.org JSON-LD).
* **Forbidden:** Project-specific hardcoded values.

### Layer 3: Project Configuration
* **Scope:** Unique to the active repository.
* **Contains:** Domain URL, languages, package name, enabled quality gate thresholds (`project.config.json`).
* **Forbidden:** Generic boilerplate that belongs to Layer 1.

### Layer 4: Tech Stack Constraints
* **Scope:** Technology-specific rules (e.g. `rules/stack-react-vite-ssg.md`, `rules/stack-nextjs.md`).
* **Contains:** Server vs Client component boundaries, routing patterns, asset loaders, state management rules.
* **Forbidden:** Universal quality rules (which live in Layer 1).

### Layer 5: Business Facts
* **Scope:** Strictly factual data verified by humans.
* **Contains:** Real company names, real pricing numbers, real legal notices.
* **Strict Law:** If a business fact is absent, the agent must treat it as unconfigured rather than inventing a placeholder.

---

## Cross-Platform Adaptation

By decoupling these layers, AES can compile target-specific instruction files on demand via `npx aes export`:
* **Claude:** Compiles Layer 1 + Layer 3 + Layer 4 into `CLAUDE.md`.
* **Cursor:** Separates Layer 1 into `.cursor/rules/global-principles.mdc` (glob `*`) and Layer 4 into `.cursor/rules/stack-rules.mdc` (glob `**/*.{ts,tsx}`).
* **Antigravity / Gemini:** Maps into `GEMINI.md` and native skills.
* **Aider / Copilot:** Generates `CONVENTIONS.md` and `.github/copilot-instructions.md`.
