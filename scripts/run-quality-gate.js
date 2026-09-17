#!/usr/bin/env node
/**
 * run-quality-gate.js
 * Universal Quality Gate Orchestrator for Agentic Engineering System (AES).
 * Enforces continuous quality gates and epistemic integrity across AI coding workflows.
 * Never issues blind or unverified PASS verdicts.
 * Supported Statuses: PASS, WARN, FAIL, N/A, UNMEASURED.
 */

const fs = require('fs');
const path = require('path');

const checkHeadings = require('./check-headings');
const checkImages = require('./check-a11y-images');
const checkContent = require('./check-content-integrity');
const checkSeo = require('./check-seo-canonical-llms');
const checkBundle = require('./check-bundle-metrics');

function loadProjectConfig(targetDir) {
  const candidates = [
    path.join(targetDir, 'project.config.json'),
    path.join(targetDir, 'templates', 'project.config.template.json')
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
        return JSON.parse(raw);
      } catch (e) {
        // ignore JSON syntax error in fallback
      }
    }
  }
  return null;
}

function runQualityGates(targetDir) {
  const root = targetDir || process.cwd();
  const config = loadProjectConfig(root);
  const projectName = config?.project?.name || path.basename(path.resolve(root));

  console.log('='.repeat(75));
  console.log(`AGENTIC ENGINEERING SYSTEM (AES) — CONTINUOUS QUALITY GATE`);
  console.log(`Target: ${path.resolve(root)}`);
  console.log(`Project: ${projectName} (${config ? 'Config Loaded' : 'Default Scaffolding'})`);
  console.log('='.repeat(75));

  const gateResults = [];

  // 1. Heading Hierarchy & H1 Uniqueness
  const headingsRes = checkHeadings.runCheck(root);
  gateResults.push({
    name: 'web-seo (headings)',
    status: headingsRes.status,
    detail: headingsRes.status === 'PASS' 
      ? `1 unique H1 verified, sequential hierarchy (${headingsRes.filesAnalyzed} HTML file(s))`
      : (headingsRes.message || `${headingsRes.results?.flatMap(r => r.issues).length || 0} issue(s) detected`)
  });

  // 2. Image Accessibility & Assets
  const imagesRes = checkImages.runCheck(root);
  gateResults.push({
    name: 'web-accessibility',
    status: imagesRes.status,
    detail: imagesRes.status === 'PASS'
      ? `Automated checks passed for tested criteria (${imagesRes.totalImages || 0} image(s) with valid alt)`
      : (imagesRes.message || `${imagesRes.results?.flatMap(r => r.issues).length || 0} warning(s)/error(s)`)
  });

  // 3. Content Integrity & Anti-Slop
  const contentRes = checkContent.runCheck(root);
  gateResults.push({
    name: 'content-quality',
    status: contentRes.status,
    detail: contentRes.status === 'PASS'
      ? `0 emojis, 0 unverified claims (${contentRes.filesAnalyzed} file(s) scanned)`
      : (contentRes.message || `${contentRes.results?.flatMap(r => r.issues).length || 0} item(s) to verify`)
  });

  // 4. SEO Infrastructure (Canonicals, Sitemap, Robots, llms.txt)
  const seoRes = checkSeo.runCheck(root);
  gateResults.push({
    name: 'web-seo (infrastructure)',
    status: seoRes.status,
    detail: `Canonical: ${seoRes.checks.canonical.status} | Sitemap: ${seoRes.checks.sitemap.status} | Robots: ${seoRes.checks.robots.status} | llms.txt: ${seoRes.checks.llms.status}`
  });

  // 5. Physical Bundle Metrics (Deterministic Calculation)
  const bundleRes = checkBundle.runCheck(root);
  gateResults.push({
    name: 'web-performance (bundle)',
    status: bundleRes.status,
    detail: bundleRes.proof
  });

  // 6. Runtime Core Web Vitals (Epistemic Honesty)
  gateResults.push({
    name: 'web-performance (runtime CWV)',
    status: 'UNMEASURED',
    detail: 'LCP, INP, CLS not measured locally (requires lab/RUM instrumentation)'
  });

  // 7. Contextual i18n Check
  const isMultilingual = config?.project?.isMultilingual || (config?.project?.languages && config.project.languages.length > 1);
  if (!isMultilingual) {
    gateResults.push({
      name: 'web-i18n',
      status: 'N/A',
      detail: 'Monolingual project'
    });
  } else {
    gateResults.push({
      name: 'web-i18n',
      status: 'WARN',
      detail: 'Multilingual project — verify route parity and reciprocal hreflang tags'
    });
  }

  // 8. Contextual Security Check
  const hasBackend = config?.backend?.type && config?.backend?.type !== 'none';
  if (!hasBackend) {
    gateResults.push({
      name: 'web-security',
      status: 'N/A',
      detail: 'No dedicated backend or database'
    });
  } else {
    gateResults.push({
      name: 'web-security',
      status: 'WARN',
      detail: `Backend ${config.backend.type} detected — manually verify RLS rules and secret isolation`
    });
  }

  // Output Standardized Summary Table: Gate | Status | Proof
  console.log('\nQuality Gates Summary Table:\n');
  console.log('| Gate | Status | Proof |');
  console.log('| :--- | :---: | :--- |');
  for (const g of gateResults) {
    console.log(`| ${g.name} | **${g.status}** | ${g.detail} |`);
  }

  const hasFail = gateResults.some(g => g.status === 'FAIL');
  const warnGates = gateResults.filter(g => g.status === 'WARN');
  const hasWarn = warnGates.length > 0;

  let verdict = 'PASS';
  if (hasFail) {
    verdict = 'FAIL';
  } else if (hasWarn) {
    verdict = 'PASS WITH WARNINGS';
  }

  console.log('\n' + '='.repeat(75));
  console.log(`GLOBAL VERDICT: ${verdict}`);
  if (verdict === 'PASS WITH WARNINGS') {
    console.log('\nWarnings motivating PASS WITH WARNINGS:');
    for (const w of warnGates) {
      console.log(` - [${w.name}]: ${w.detail}`);
    }
  }
  console.log('='.repeat(75) + '\n');

  return {
    verdict,
    gates: gateResults,
    exitCode: hasFail ? 1 : 0
  };
}

if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  const res = runQualityGates(target);
  process.exit(res.exitCode);
}

module.exports = { runQualityGates };
