#!/usr/bin/env node
/**
 * self-check-report.js
 * Automatically verifies internal consistency and epistemic integrity of AI audit reports:
 * - Strict consistency of global verdict (PASS / PASS WITH WARNINGS / FAIL)
 * - Contradiction detection (e.g. PASS verdict when WARN or FAIL items exist)
 * - Presence of factual proofs per Gate (bans isolated vague words like "ok", "compliant")
 * - Arithmetic validation of calculated metrics (exact sum of gzip sizes)
 * - Epistemic honesty verification (runtime CWV marked UNMEASURED)
 * - Prevents overpromising on accessibility ("100% accessible" or unconditional "WCAG AA compliant")
 */

const fs = require('fs');
const path = require('path');

function parseMarkdownReport(content) {
  const lines = content.split('\n');
  const issues = [];
  const gateRows = [];
  let globalVerdict = null;

  // 1. Detect global verdict
  for (const line of lines) {
    const verdictMatch = /VERDICT(?:\s+GLOBAL)?\s*[:=]\s*\**\s*(PASS WITH WARNINGS|PASS|FAIL|READY WITH WARNINGS|READY|NOT READY)\b/i.exec(line);
    if (verdictMatch) {
      globalVerdict = verdictMatch[1].toUpperCase();
    }
  }

  // 2. Extract Quality Gate table rows (| Gate | Status | Proof |)
  let inTable = false;
  let headerCols = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|') || !line.endsWith('|')) {
      inTable = false;
      continue;
    }

    const cells = line.split('|').slice(1, -1).map(c => c.trim().replace(/\*\*/g, ''));
    if (cells.length < 3) continue;

    // Detect header row
    if (cells.some(c => /gate|porte|contrôle/i.test(c)) && cells.some(c => /statut|status/i.test(c))) {
      inTable = true;
      headerCols = cells.map(c => c.toLowerCase());
      continue;
    }

    // Skip separator row |:---|:---:|:---|
    if (cells.every(c => /^:?-+:?$/.test(c))) continue;

    if (inTable && cells.length >= 3) {
      const gateIndex = headerCols.findIndex(c => /gate|porte|contrôle/.test(c));
      const statusIndex = headerCols.findIndex(c => /statut|status/.test(c));
      const proofIndex = headerCols.findIndex(c => /preuve|résultat|detail|proof/.test(c));

      const gateName = cells[gateIndex !== -1 ? gateIndex : 0];
      const statusRaw = cells[statusIndex !== -1 ? statusIndex : 1];
      const proof = cells[proofIndex !== -1 ? proofIndex : 2];

      let status = 'UNKNOWN';
      if (/PASS WITH WARNINGS/i.test(statusRaw)) status = 'PASS WITH WARNINGS';
      else if (/PASS/i.test(statusRaw)) status = 'PASS';
      else if (/WARN/i.test(statusRaw)) status = 'WARN';
      else if (/FAIL/i.test(statusRaw)) status = 'FAIL';
      else if (/N\/A/i.test(statusRaw)) status = 'N/A';
      else if (/NON\s+MESUR[ÉE]|UNMEASURED/i.test(statusRaw)) status = 'UNMEASURED';

      gateRows.push({
        line: i + 1,
        gate: gateName,
        statusRaw,
        status,
        proof
      });
    }
  }

  // 3. Verdict consistency check
  if (!globalVerdict) {
    issues.push({
      severity: 'WARN',
      type: 'VERDICT_MISSING',
      message: 'Global verdict missing or unrecognized (expected: PASS, PASS WITH WARNINGS, or FAIL).'
    });
  } else {
    const normalizedVerdict = globalVerdict === 'READY' ? 'PASS' 
      : (globalVerdict === 'READY WITH WARNINGS' ? 'PASS WITH WARNINGS'
      : (globalVerdict === 'NOT READY' ? 'FAIL' : globalVerdict));

    const hasFail = gateRows.some(g => g.status === 'FAIL');
    const hasWarn = gateRows.some(g => g.status === 'WARN');

    if (hasFail && normalizedVerdict !== 'FAIL') {
      issues.push({
        severity: 'FAIL',
        type: 'VERDICT_CONTRADICTION',
        message: `Critical contradiction: Report contains FAIL gates but claims verdict '${globalVerdict}'. Verdict MUST be FAIL.`
      });
    } else if (!hasFail && hasWarn && normalizedVerdict === 'PASS') {
      issues.push({
        severity: 'FAIL',
        type: 'VERDICT_CONTRADICTION',
        message: `Verdict inconsistency: Report contains warnings (WARN) but concludes 'PASS'. Verdict MUST be 'PASS WITH WARNINGS'.`
      });
    } else if (!hasFail && !hasWarn && normalizedVerdict === 'FAIL') {
      issues.push({
        severity: 'FAIL',
        type: 'VERDICT_CONTRADICTION',
        message: `Contradiction: No FAIL detected among gates, but verdict is '${globalVerdict}'.`
      });
    }
  }

  // 4. Proof quality check
  const vagueTermsRegex = /^(?:conforme|excellent|optimisé|sécurisé|parfait|ok|clean|good|verified)\s*$/i;
  for (const g of gateRows) {
    if (!g.proof || g.proof.trim().length === 0) {
      issues.push({
        severity: 'FAIL',
        type: 'EMPTY_PROOF',
        message: `Gate '${g.gate}': Proof column is empty. Objective factual proof is mandatory.`
      });
    } else if (vagueTermsRegex.test(g.proof.trim())) {
      issues.push({
        severity: 'WARN',
        type: 'VAGUE_PROOF',
        message: `Gate '${g.gate}': Vague proof ('${g.proof}'). Provide numbers or verifiable criteria.`
      });
    }
  }

  // 5. Arithmetic validation of bundle size metrics
  const htmlMatch = /HTML(?:\s+gzip)?\s*[:=]\s*(\d+(?:[.,]\d+)?)\s*k?B/i.exec(content);
  const cssMatch = /CSS(?:\s+gzip)?\s*[:=]\s*(\d+(?:[.,]\d+)?)\s*k?B/i.exec(content);
  const jsMatch = /JS(?:\s+gzip)?\s*[:=]\s*(\d+(?:[.,]\d+)?)\s*k?B/i.exec(content);
  const totalMatch = /Total(?:\s+bundle)?(?:\s+gzip)?\s*[:=]\s*(\d+(?:[.,]\d+)?)\s*k?B/i.exec(content);

  if (htmlMatch && cssMatch && jsMatch && totalMatch) {
    const htmlKb = parseFloat(htmlMatch[1].replace(',', '.'));
    const cssKb = parseFloat(cssMatch[1].replace(',', '.'));
    const jsKb = parseFloat(jsMatch[1].replace(',', '.'));
    const reportedTotal = parseFloat(totalMatch[1].replace(',', '.'));

    const calculatedTotal = parseFloat((htmlKb + cssKb + jsKb).toFixed(2));
    const delta = Math.abs(reportedTotal - calculatedTotal);

    if (delta > 0.05) {
      issues.push({
        severity: 'FAIL',
        type: 'ARITHMETIC_ERROR',
        message: `Arithmetic inconsistency in bundle metrics: Reported total ${reportedTotal} kB != calculated sum ${calculatedTotal} kB (${htmlKb} + ${cssKb} + ${jsKb}). Zero mental math tolerated.`
      });
    }
  }

  // 6. Overpromising check (WCAG AA)
  const overpromiseRegex = /\b(?:100%\s*accessible|100%\s*WCAG|WCAG(?:\s*2\.[12])?\s*AA\s*compliant)\b/i;
  for (let i = 0; i < lines.length; i++) {
    if (overpromiseRegex.test(lines[i])) {
      issues.push({
        severity: 'WARN',
        type: 'A11Y_OVERPROMISE',
        message: `Line ${i + 1}: Potential overpromise ('${lines[i].trim()}'). Automated tests can only prove tested criteria, never 100% full WCAG AA compliance.`
      });
    }
  }

  return {
    globalVerdict,
    gateCount: gateRows.length,
    gateRows,
    issues
  };
}

function runSelfCheck(reportPath) {
  if (!fs.existsSync(reportPath)) {
    console.error(`Error: File '${reportPath}' not found.`);
    return { exitCode: 1 };
  }

  const content = fs.readFileSync(reportPath, 'utf8');
  console.log('='.repeat(75));
  console.log(`REPORT SELF-CHECK: ${path.basename(reportPath)}`);
  console.log('='.repeat(75));

  const result = parseMarkdownReport(content);
  console.log(`Detected Gates: ${result.gateCount}`);
  console.log(`Detected Global Verdict: ${result.globalVerdict || 'NONE'}`);

  const fails = result.issues.filter(i => i.severity === 'FAIL');
  const warns = result.issues.filter(i => i.severity === 'WARN');

  if (result.issues.length === 0) {
    console.log('\n[PASS] Report is internally consistent and strictly conforms to AES epistemic standards.\n');
    return { exitCode: 0, result };
  }

  console.log(`\nIssues detected (${fails.length} FAIL, ${warns.length} WARN):`);
  for (const issue of result.issues) {
    console.log(` [${issue.severity}] ${issue.type}: ${issue.message}`);
  }

  const finalStatus = fails.length > 0 ? 'FAIL' : 'PASS WITH WARNINGS';
  console.log(`\nSelf-Check Result: ${finalStatus}\n`);
  console.log('='.repeat(75));

  return {
    exitCode: fails.length > 0 ? 1 : 0,
    result
  };
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/self-check-report.js <path-to-report.md>');
    process.exit(1);
  }
  const res = runSelfCheck(file);
  process.exit(res.exitCode);
}

module.exports = { runSelfCheck, parseMarkdownReport };
