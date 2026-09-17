#!/usr/bin/env node
/**
 * export-adapters.js
 * Universal multi-agent rule adapter exporter for Agentic Engineering System (AES).
 * Generates platform-specific instructions from the single source of truth:
 * - Claude Code & Claude Projects (CLAUDE.md)
 * - Cursor IDE (.cursor/rules/*.mdc)
 * - Antigravity / Gemini CLI (GEMINI.md)
 * - GitHub Copilot (.github/copilot-instructions.md)
 * - Aider CLI (CONVENTIONS.md)
 */

const fs = require('fs');
const path = require('path');

function loadFileSafe(filePath, fallback = '') {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  }
  return fallback;
}

function loadConfig(rootDir) {
  const configPath = path.join(rootDir, 'project.config.json');
  const templatePath = path.join(rootDir, 'templates', 'project.config.template.json');
  
  let raw = loadFileSafe(configPath);
  if (!raw) {
    raw = loadFileSafe(templatePath, '{}');
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateClaudeMd(rootDir, globalRules, stackRules, config) {
  const targetFile = path.join(rootDir, 'CLAUDE.md');
  const projectName = config?.project?.name || 'Software Project';
  
  const content = `# Claude Code Directives: ${projectName}

> This project is governed by the **Agentic Engineering System (AES)**.
> Epistemic rigor, factual integrity, zero fabricated data/statistics, and continuous quality gates are strictly enforced.

---

## Quick Reference Commands

- **Run all Quality Gates:** \`npm run gate\` or \`node scripts/run-quality-gate.js .\`
- **Check Bundle Metrics:** \`npm run gate:bundle\`
- **Check Headings & SEO:** \`npm run gate:headings\` && \`npm run gate:seo\`
- **Check Accessibility (Images/A11y):** \`npm run gate:a11y\`
- **Check Content Integrity & Anti-Slop:** \`npm run gate:content\`
- **Validate Release Report:** \`node scripts/self-check-report.js <report-path.md>\`

---

## 1. Global Core Principles
${globalRules}

---

## 2. Technology Stack Constraints
${stackRules}

---

## 3. Epistemic Statuses & Definition of Done

When concluding any task or outputting an audit table, use strict epistemic categories:
* \`MEASURED\`: Result actually verified locally via scripts (e.g. gzip bundle size).
* \`UNMEASURED\`: Real-world or runtime metrics not measured locally (e.g. real CWV, LCP/INP).
* \`ESTIMATED\`: Theoretical calculations or projections explicitly announced as such.
* \`QUALITATIVE\`: Code review insights without physical measurement.

Verdict rule:
- If warnings exist, the verdict is **PASS WITH WARNINGS** (never PASS).
- If any critical gate fails, the verdict is **FAIL**.
`;

  fs.writeFileSync(targetFile, content.trim() + '\n', 'utf8');
  console.log(`[OK] Generated Claude adapter: ${path.relative(rootDir, targetFile)}`);
}

function generateCursorRules(rootDir, globalRules, stackRules, config) {
  const cursorDir = path.join(rootDir, '.cursor', 'rules');
  ensureDir(cursorDir);

  // 1. Global principles rule (.mdc)
  const globalMdc = `---
description: Universal core engineering principles, epistemic rigor, and anti-slop rules
globs: *
alwaysApply: true
---

${globalRules}
`;
  fs.writeFileSync(path.join(cursorDir, 'global-principles.mdc'), globalMdc.trim() + '\n', 'utf8');

  // 2. Stack rules (.mdc)
  const stackExts = config?.stack?.framework === 'react' || config?.stack?.framework === 'next'
    ? '**/*.{ts,tsx,js,jsx,css,html}'
    : '**/*';

  const stackMdc = `---
description: Technology stack constraints and architecture patterns
globs: ${stackExts}
alwaysApply: false
---

${stackRules}
`;
  fs.writeFileSync(path.join(cursorDir, 'stack-rules.mdc'), stackMdc.trim() + '\n', 'utf8');

  console.log(`[OK] Generated Cursor adapter: .cursor/rules/global-principles.mdc & stack-rules.mdc`);
}

function generateGeminiMd(rootDir, globalRules, stackRules, config) {
  const targetFile = path.join(rootDir, 'GEMINI.md');
  const projectName = config?.project?.name || 'Software Project';

  const content = `# Antigravity & Gemini Directives: ${projectName}

> **Agentic Engineering System (AES) Directives**

---

## 1. Global Principles
${globalRules}

---

## 2. Stack Constraints
${stackRules}

---

## 3. Execution Verification
Execute \`node scripts/run-quality-gate.js .\` to produce the standard Quality Gate proof table.
`;

  fs.writeFileSync(targetFile, content.trim() + '\n', 'utf8');
  console.log(`[OK] Generated Antigravity / Gemini adapter: ${path.relative(rootDir, targetFile)}`);
}

function generateAiderConventions(rootDir, globalRules, stackRules) {
  const targetFile = path.join(rootDir, 'CONVENTIONS.md');
  const content = `# Code Conventions & Agent Directives (AES)

${globalRules}

---

${stackRules}
`;

  fs.writeFileSync(targetFile, content.trim() + '\n', 'utf8');
  console.log(`[OK] Generated Aider adapter: ${path.relative(rootDir, targetFile)}`);
}

function generateCopilotInstructions(rootDir, globalRules, stackRules) {
  const githubDir = path.join(rootDir, '.github');
  ensureDir(githubDir);
  const targetFile = path.join(githubDir, 'copilot-instructions.md');

  const content = `# GitHub Copilot Custom Instructions

${globalRules}

---

${stackRules}
`;

  fs.writeFileSync(targetFile, content.trim() + '\n', 'utf8');
  console.log(`[OK] Generated GitHub Copilot adapter: ${path.relative(rootDir, targetFile)}`);
}

function runExport(targetOption, rootDir = process.cwd()) {
  const config = loadConfig(rootDir);
  const globalRules = loadFileSafe(path.join(rootDir, 'rules', 'global-principles.md'));
  
  // Resolve stack rules file
  const stackFile = config?.stack?.rulesFile
    ? path.join(rootDir, config.stack.rulesFile)
    : path.join(rootDir, 'rules', 'stack-react-vite-ssg.md');

  const stackRules = loadFileSafe(stackFile, '# Stack Rules\n\nNo specific stack rules configured.');

  const target = (targetOption || 'all').toLowerCase();

  console.log('='.repeat(60));
  console.log(`AES ADAPTER EXPORTER — Target: ${target.toUpperCase()}`);
  console.log('='.repeat(60));

  if (target === 'claude' || target === 'all') {
    generateClaudeMd(rootDir, globalRules, stackRules, config);
  }
  if (target === 'cursor' || target === 'all') {
    generateCursorRules(rootDir, globalRules, stackRules, config);
  }
  if (target === 'gemini' || target === 'antigravity' || target === 'all') {
    generateGeminiMd(rootDir, globalRules, stackRules, config);
  }
  if (target === 'aider' || target === 'all') {
    generateAiderConventions(rootDir, globalRules, stackRules);
  }
  if (target === 'copilot' || target === 'all') {
    generateCopilotInstructions(rootDir, globalRules, stackRules);
  }

  console.log('='.repeat(60));
  console.log('Adapter export completed successfully.\n');
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let target = 'all';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--target' && args[i + 1]) {
      target = args[i + 1];
    } else if (args[i].startsWith('--target=')) {
      target = args[i].split('=')[1];
    }
  }
  runExport(target, process.cwd());
}

module.exports = { runExport };
