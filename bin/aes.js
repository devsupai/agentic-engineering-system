#!/usr/bin/env node
/**
 * bin/aes.js
 * CLI for Agentic Engineering System (AES).
 * Commands:
 *   aes init [targetDir]      - Initialize AES scaffolding and configuration in a directory
 *   aes export [--target X]   - Export instructions for claude, cursor, gemini, aider, copilot, or all
 *   aes gate [targetDir]      - Run the full suite of Quality Gates
 *   aes check-report <file>   - Verify internal consistency of an AI audit report
 */

const fs = require('fs');
const path = require('path');
const { runExport } = require('../scripts/export-adapters');
const { runQualityGates } = require('../scripts/run-quality-gate');

const args = process.argv.slice(2);
const command = args[0] || 'help';

function printHelp() {
  console.log(`
Agentic Engineering System (AES) CLI
Modular, Epistemic, and Automated Governance for AI Coding Agents.

Usage:
  aes <command> [options]

Commands:
  init [dir]               Initialize AES configuration and template files in target directory
  export [--target <all|claude|cursor|gemini|aider|copilot>]
                           Generate platform-specific instruction files
  gate [dir]               Run the continuous Quality Gates on target project
  check-report <file>      Validate report consistency (epistemic integrity & proofs)
  help                     Show this help message

Examples:
  npx aes init
  npx aes export --target claude
  npx aes export --target cursor
  npx aes gate dist/
  node scripts/self-check-report.js report.md
`);
}

function initProject(targetDir = process.cwd()) {
  console.log(`Initializing AES in: ${targetDir}`);
  const templateConfig = path.join(__dirname, '..', 'templates', 'project.config.template.json');
  const targetConfig = path.join(targetDir, 'project.config.json');

  if (!fs.existsSync(targetConfig)) {
    fs.copyFileSync(templateConfig, targetConfig);
    console.log(`[OK] Created project.config.json`);
  } else {
    console.log(`[INFO] project.config.json already exists.`);
  }

  // Ensure rules directory exists
  const rulesDir = path.join(targetDir, 'rules');
  if (!fs.existsSync(rulesDir)) {
    fs.mkdirSync(rulesDir, { recursive: true });
    const srcGlobal = path.join(__dirname, '..', 'rules', 'global-principles.md');
    if (fs.existsSync(srcGlobal)) {
      fs.copyFileSync(srcGlobal, path.join(rulesDir, 'global-principles.md'));
      console.log(`[OK] Created rules/global-principles.md`);
    }
  }

  console.log(`\nInitialization complete. Next steps:`);
  console.log(`1. Edit project.config.json with factual project info`);
  console.log(`2. Run 'aes export' to generate directives for your favorite AI agent (Claude, Cursor, etc.)`);
  console.log(`3. Run 'aes gate' during development to verify compliance.\n`);
}

switch (command) {
  case 'init':
    initProject(args[1] || process.cwd());
    break;
  case 'export': {
    let target = 'all';
    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--target' && args[i + 1]) {
        target = args[i + 1];
      } else if (args[i].startsWith('--target=')) {
        target = args[i].split('=')[1];
      }
    }
    runExport(target, process.cwd());
    break;
  }
  case 'gate': {
    const targetDir = args[1] || process.cwd();
    const res = runQualityGates(targetDir);
    process.exit(res.exitCode);
    break;
  }
  case 'check-report': {
    const reportFile = args[1];
    if (!reportFile) {
      console.error('Error: Please provide a report file path. Usage: aes check-report <file.md>');
      process.exit(1);
    }
    const { runSelfCheck } = require('../scripts/self-check-report');
    const res = runSelfCheck(reportFile);
    process.exit(res.exitCode);
    break;
  }
  case 'help':
  case '--help':
  case '-h':
  default:
    printHelp();
    break;
}
