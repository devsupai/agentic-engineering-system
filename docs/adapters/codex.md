# OpenAI Codex & Custom Assistants Integration Guide

This guide explains how to integrate the **Agentic Engineering System (AES)** into OpenAI Codex CLI, ChatGPT Custom GPTs, or the Assistants API.

---

## 1. System Prompt & Instructions

When configuring an Assistant or Custom GPT:
* Insert the content of `rules/global-principles.md` as the core **System Instructions**.
* Attach `project.config.json` as a project file.

---

## 2. Tool / Function Calling Binding

Because OpenAI models are prone to arithmetic errors and hallucinated estimates, configure AES scripts as functions or tools:
* **Function: `runQualityGates`**
  - Executes `node scripts/run-quality-gate.js`.
  - Returns the exact deterministic JSON payload with computed gzip metrics.
* **Function: `checkBundle`**
  - Executes `node scripts/check-bundle-metrics.js`.
  - Returns exact bytes and gzip values.

This prevents the model from attempting mental calculations or inventing bundle sizes.
