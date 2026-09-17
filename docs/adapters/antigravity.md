# Antigravity & Gemini Integration Guide

This guide explains how to integrate the **Agentic Engineering System (AES)** into Google Antigravity and Gemini CLI environments.

---

## 1. Antigravity Architecture

Antigravity natively utilizes:
* `~/.gemini/GEMINI.md` for global user rules.
* `GEMINI.md` in repository roots for project rules.
* Specialized skills in `~/.gemini/config/skills/*`.

---

## 2. Generating `GEMINI.md`

Run the AES export command:
```bash
npx aes export --target gemini
```

This generates `GEMINI.md` referencing the core principles and stack rules. Antigravity agents will automatically load these rules when working within the repository.
