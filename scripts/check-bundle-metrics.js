#!/usr/bin/env node
/**
 * check-bundle-metrics.js
 * Automatically and deterministically calculates physical bundle metrics:
 * - Raw and gzip sizes per category (HTML, CSS, JS, Assets)
 * - Exact total automatically calculated (eliminates mental arithmetic hallucinations)
 * - Strict epistemic status (MEASURED if dist/build exists, UNMEASURED otherwise)
 * - Decouples local physical sizes from real runtime Core Web Vitals (LCP/INP/CLS)
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function scanDirectory(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git'].includes(item)) {
        files = files.concat(scanDirectory(fullPath));
      }
    } else {
      // Ignore sourcemaps for production bundle metrics
      if (!item.endsWith('.map')) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

function runCheck(targetDir) {
  const root = targetDir || process.cwd();
  const distDir = path.join(root, 'dist');
  const buildDir = path.join(root, 'build');

  let targetBuildDir = null;
  if (fs.existsSync(distDir)) {
    targetBuildDir = distDir;
  } else if (fs.existsSync(buildDir)) {
    targetBuildDir = buildDir;
  }

  if (!targetBuildDir) {
    return {
      status: 'UNMEASURED',
      epistemic: 'UNMEASURED',
      message: 'No build directory detected (dist/ or build/ absent). Local measurement impossible before compilation.',
      proof: 'Uncompiled local build — physical metrics UNMEASURED',
      metrics: null
    };
  }

  const files = scanDirectory(targetBuildDir);
  if (files.length === 0) {
    return {
      status: 'UNMEASURED',
      epistemic: 'UNMEASURED',
      message: `Build directory ${path.basename(targetBuildDir)} is empty.`,
      proof: 'Build directory empty — physical metrics UNMEASURED',
      metrics: null
    };
  }

  const summary = {
    html: { bytes: 0, gzip: 0, count: 0 },
    css: { bytes: 0, gzip: 0, count: 0 },
    js: { bytes: 0, gzip: 0, count: 0 },
    assets: { bytes: 0, gzip: 0, count: 0 },
    totalBundle: { bytes: 0, gzip: 0 }, // HTML + CSS + JS
    totalAll: { bytes: 0, gzip: 0, count: files.length }
  };

  for (const file of files) {
    const content = fs.readFileSync(file);
    const rawSize = content.length;
    const gzipSize = zlib.gzipSync(content).length;
    const ext = path.extname(file).toLowerCase();

    summary.totalAll.bytes += rawSize;
    summary.totalAll.gzip += gzipSize;

    if (['.html', '.htm'].includes(ext)) {
      summary.html.bytes += rawSize;
      summary.html.gzip += gzipSize;
      summary.html.count++;
      summary.totalBundle.bytes += rawSize;
      summary.totalBundle.gzip += gzipSize;
    } else if (ext === '.css') {
      summary.css.bytes += rawSize;
      summary.css.gzip += gzipSize;
      summary.css.count++;
      summary.totalBundle.bytes += rawSize;
      summary.totalBundle.gzip += gzipSize;
    } else if (['.js', '.mjs', '.cjs'].includes(ext)) {
      summary.js.bytes += rawSize;
      summary.js.gzip += gzipSize;
      summary.js.count++;
      summary.totalBundle.bytes += rawSize;
      summary.totalBundle.gzip += gzipSize;
    } else {
      summary.assets.bytes += rawSize;
      summary.assets.gzip += gzipSize;
      summary.assets.count++;
    }
  }

  // Exact calculation rounded to 2 decimal places (kB)
  const htmlGzipKb = parseFloat((summary.html.gzip / 1024).toFixed(2));
  const cssGzipKb = parseFloat((summary.css.gzip / 1024).toFixed(2));
  const jsGzipKb = parseFloat((summary.js.gzip / 1024).toFixed(2));
  const totalBundleGzipKb = parseFloat((summary.totalBundle.gzip / 1024).toFixed(2));
  const totalAllGzipKb = parseFloat((summary.totalAll.gzip / 1024).toFixed(2));

  const jsRawKb = parseFloat((summary.js.bytes / 1024).toFixed(2));
  const cssRawKb = parseFloat((summary.css.bytes / 1024).toFixed(2));

  let status = 'PASS';
  const issues = [];

  // Warning threshold for JS gzip > 350 kB
  if (jsGzipKb > 350) {
    status = 'WARN';
    issues.push(`Large JS bundle (${jsGzipKb} kB gzip). Code-splitting recommended.`);
  }

  const proof = `HTML gzip: ${htmlGzipKb} kB | CSS gzip: ${cssGzipKb} kB | JS gzip: ${jsGzipKb} kB | Total bundle gzip: ${totalBundleGzipKb} kB (MEASURED)`;

  return {
    status,
    epistemic: 'MEASURED',
    targetDir: path.relative(root, targetBuildDir) || targetBuildDir,
    metrics: {
      html: { rawKb: parseFloat((summary.html.bytes / 1024).toFixed(2)), gzipKb: htmlGzipKb, count: summary.html.count },
      css: { rawKb: cssRawKb, gzipKb: cssGzipKb, count: summary.css.count },
      js: { rawKb: jsRawKb, gzipKb: jsGzipKb, count: summary.js.count },
      assets: { rawKb: parseFloat((summary.assets.bytes / 1024).toFixed(2)), gzipKb: parseFloat((summary.assets.gzip / 1024).toFixed(2)), count: summary.assets.count },
      totalBundle: { rawKb: parseFloat((summary.totalBundle.bytes / 1024).toFixed(2)), gzipKb: totalBundleGzipKb },
      totalAll: { rawKb: parseFloat((summary.totalAll.bytes / 1024).toFixed(2)), gzipKb: totalAllGzipKb, count: summary.totalAll.count }
    },
    proof,
    issues
  };
}

if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  const res = runCheck(target);
  console.log(JSON.stringify(res, null, 2));
  process.exit(res.status === 'FAIL' ? 1 : 0);
}

module.exports = { runCheck };
