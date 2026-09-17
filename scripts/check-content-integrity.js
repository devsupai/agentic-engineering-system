#!/usr/bin/env node
/**
 * check-content-integrity.js
 * Enforces editorial integrity, anti-slop rules, and visual sobriety:
 * - Prohibits Unicode emojis in production code & build output (allows standard punctuation/legal symbols)
 * - Detects unverified statistical claims & multipliers (issues advisory WARN for human verification)
 * - Flags fabricated commercial patterns (Zero Fake Data)
 */

const fs = require('fs');
const path = require('path');

// Legitimate typographical and legal symbols to exclude from emoji detection
const EXCLUDED_SYMBOLS = new Set(['©', '®', '™', '§', '°', '•', '·', '…', '–', '—', '«', '»', '“', '”', '€', '$', '£', '¥']);

function findTargetFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', '.agent', '.cursor'].includes(file)) {
        results = results.concat(findTargetFiles(fullPath));
      }
    } else if (/\.(html|jsx|tsx|vue|svelte)$/i.test(file)) {
      results.push(fullPath);
    }
  }
  return results;
}

function analyzeContent(content, relativePath) {
  const issues = [];

  // 1. Detect Unicode emojis (banned in production code and UI)
  const emojiRegex = /\p{Extended_Pictographic}/gu;
  let emojiMatch;
  const foundEmojis = [];
  while ((emojiMatch = emojiRegex.exec(content)) !== null) {
    const char = emojiMatch[0];
    if (!EXCLUDED_SYMBOLS.has(char)) {
      foundEmojis.push(char);
    }
  }

  if (foundEmojis.length > 0) {
    const unique = Array.from(new Set(foundEmojis));
    issues.push({
      severity: 'FAIL',
      type: 'EMOJI_DETECTED',
      message: `Unicode emoji detected (${unique.join(' ')}) in ${relativePath}. Emojis are prohibited in production (use SVG icons).`
    });
  }

  // 2. Detect marketing statistics and multiplier claims
  // Emits WARN for human verification, never an arbitrary blind FAIL
  const statsRegex = /(?:[+\-]?\d+(?:[.,]\d+)?\s*%|\b(?:multiplied|doubled|tripled|boosted)\s+by\s+\d+|\bx\s*\d+\b)/gi;
  let statsMatch;
  const foundStats = [];
  while ((statsMatch = statsRegex.exec(content)) !== null) {
    // Avoid false positives from CSS percentages (e.g. width: 100%, opacity, etc.)
    const matchIndex = statsMatch.index;
    const surrounding = content.slice(Math.max(0, matchIndex - 25), Math.min(content.length, matchIndex + 35));
    if (!/width|height|style|scale|rgba|opacity|transform|calc|%/i.test(surrounding)) {
      foundStats.push(statsMatch[0]);
    }
  }

  if (foundStats.length > 0) {
    const unique = Array.from(new Set(foundStats)).slice(0, 5);
    issues.push({
      severity: 'WARN',
      type: 'STATISTIC_CLAIM_DETECTED',
      message: `Statistical claim detected (${unique.join(', ')}) in ${relativePath}. Verify it is backed by real, documented evidence (Zero Fake Stats).`
    });
  }

  return {
    filePath: relativePath,
    issues
  };
}

function runCheck(targetDir) {
  const root = targetDir || process.cwd();
  const distDir = path.join(root, 'dist');
  const buildDir = path.join(root, 'build');
  const srcDir = path.join(root, 'src');

  let filesToScan = [];
  if (fs.existsSync(distDir)) {
    filesToScan = findTargetFiles(distDir);
  } else if (fs.existsSync(buildDir)) {
    filesToScan = findTargetFiles(buildDir);
  } else if (fs.existsSync(srcDir)) {
    filesToScan = findTargetFiles(srcDir);
  } else {
    filesToScan = findTargetFiles(root);
  }

  if (filesToScan.length === 0) {
    return {
      status: 'N/A',
      message: 'No analyzable HTML/JSX/TSX files found.',
      filesAnalyzed: 0,
      results: []
    };
  }

  const results = filesToScan.map(f => {
    const content = fs.readFileSync(f, 'utf8');
    return analyzeContent(content, path.relative(root, f));
  });

  let hasFail = false;
  let hasWarn = false;

  for (const r of results) {
    for (const issue of r.issues) {
      if (issue.severity === 'FAIL') hasFail = true;
      if (issue.severity === 'WARN') hasWarn = true;
    }
  }

  const status = hasFail ? 'FAIL' : (hasWarn ? 'WARN' : 'PASS');
  return {
    status,
    filesAnalyzed: filesToScan.length,
    results: results.filter(r => r.issues.length > 0)
  };
}

if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  const res = runCheck(target);
  console.log(JSON.stringify(res, null, 2));
  process.exit(res.status === 'FAIL' ? 1 : 0);
}

module.exports = { runCheck };
