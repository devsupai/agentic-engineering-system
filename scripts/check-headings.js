#!/usr/bin/env node
/**
 * check-headings.js
 * Verifies <h1> uniqueness and sequential heading tag hierarchy (H1 -> H2 -> H3).
 * Prioritizes generated HTML (dist/ or build/) and falls back to source HTML files.
 */

const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', '.agent', '.cursor'].includes(file)) {
        results = results.concat(findHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function isTechnicalOrPrivatePage(filePath) {
  const normalized = filePath.replace(/\\/g, '/').toLowerCase();
  return /admin|login|auth|404|500|_error/i.test(normalized);
}

function analyzeHtmlHeadings(htmlContent, filePath) {
  const headingRegex = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  const headings = [];
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    headings.push({ level, text });
  }

  const h1Count = headings.filter(h => h.level === 1).length;
  const issues = [];
  const isPrivate = isTechnicalOrPrivatePage(filePath);

  if (h1Count === 0) {
    if (isPrivate) {
      issues.push({ severity: 'WARN', message: 'Private or technical page without <h1> (permissible for dashboard/auth).' });
    } else {
      issues.push({ severity: 'FAIL', message: 'No <h1> found on public indexable page.' });
    }
  } else if (h1Count > 1) {
    issues.push({ severity: 'FAIL', message: `Multiple <h1> tags detected (${h1Count}). Exactly one <h1> required per page.` });
  }

  // Sequential hierarchy check
  let previousLevel = 0;
  for (let i = 0; i < headings.length; i++) {
    const current = headings[i];
    if (previousLevel > 0 && current.level > previousLevel + 1) {
      issues.push({
        severity: 'WARN',
        message: `Skipped heading level: <h${previousLevel}> followed by <h${current.level}> ("${current.text.slice(0, 40)}...")`
      });
    }
    previousLevel = current.level;
  }

  return {
    filePath,
    h1Count,
    isPrivate,
    totalHeadings: headings.length,
    headings,
    issues
  };
}

function runCheck(targetDir) {
  const root = targetDir || process.cwd();
  const distDir = path.join(root, 'dist');
  const buildDir = path.join(root, 'build');
  const publicDir = path.join(root, 'public');

  let htmlFiles = [];
  let sourceMode = 'dist';

  if (fs.existsSync(distDir)) {
    htmlFiles = findHtmlFiles(distDir);
  } else if (fs.existsSync(buildDir)) {
    htmlFiles = findHtmlFiles(buildDir);
  } else if (fs.existsSync(publicDir)) {
    htmlFiles = findHtmlFiles(publicDir);
    sourceMode = 'public';
  } else {
    htmlFiles = findHtmlFiles(root);
    sourceMode = 'root';
  }

  if (htmlFiles.length === 0) {
    return {
      status: 'N/A',
      message: 'No HTML files found to analyze.',
      filesAnalyzed: 0,
      results: []
    };
  }

  const results = htmlFiles.map(f => {
    const content = fs.readFileSync(f, 'utf8');
    return analyzeHtmlHeadings(content, path.relative(root, f));
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
    sourceMode,
    filesAnalyzed: htmlFiles.length,
    results
  };
}

if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  const res = runCheck(target);
  console.log(JSON.stringify(res, null, 2));
  process.exit(res.status === 'FAIL' ? 1 : 0);
}

module.exports = { runCheck };
