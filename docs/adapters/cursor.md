# Cursor IDE Integration Guide

This guide explains how to integrate the **Agentic Engineering System (AES)** with Cursor's multi-rule architecture (`.cursor/rules/*.mdc`).

---

## 1. Modular Rules in Cursor

Cursor natively supports scoped rules via `.cursor/rules/*.mdc` files with file matching globs.

### Generating Cursor Rules
Run the AES export command:
```bash
npx aes export --target cursor
```

This generates two scoped rule files:
1. **`.cursor/rules/global-principles.mdc`**:
   - `alwaysApply: true`
   - Governs all interactions: non-regression, epistemic categories (`MEASURED`, `UNMEASURED`), zero emojis, zero fake stats.
2. **`.cursor/rules/stack-rules.mdc`**:
   - `globs: **/*.{ts,tsx,js,jsx,css,html}`
   - Governs component boundaries, routing, and asset hygiene.

---

## 2. Running Quality Gates in Cursor Terminal

In the Cursor Agent or Composer terminal, run:
```bash
node scripts/run-quality-gate.js
```
The agent will inspect the findings, correct any heading jumps or missing alt tags, and re-run until all gates PASS.
