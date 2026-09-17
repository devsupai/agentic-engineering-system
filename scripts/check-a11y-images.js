#!/usr/bin/env node
/**
 * check-a11y-images.js
 * Verifies image accessibility: alt attribute presence, decorative image handling,
 * and prudent evaluation of modern formats (WebP, AVIF, SVG) and explicit dimensions.
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

function analyzeImages(htmlContent, filePath) {
  const imgRegex = /<img\b([^>]*)>/gi;
  let match;
  const images = [];
  const issues = [];

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const attrs = match[1];
    
    const srcMatch = /src=["']([^"']*)["']/i.exec(attrs);
    const altMatch = /alt=["']([^"']*)["']/i.exec(attrs);
    const hasAlt = /alt=/i.test(attrs);
    const ariaHidden = /aria-hidden=["']true["']/i.exec(attrs);
    const hasWidth = /width=/i.test(attrs);
    const hasHeight = /height=/i.test(attrs);

    const src = srcMatch ? srcMatch[1] : 'unknown';
    const alt = altMatch ? altMatch[1] : (hasAlt ? '' : null);

    const imageInfo = {
      src,
      alt,
      hasAlt,
      isAriaHidden: !!ariaHidden,
      hasDimensions: hasWidth && hasHeight
    };
    images.push(imageInfo);

    // Alt attribute check
    if (!hasAlt) {
      issues.push({
        severity: 'FAIL',
        message: `Image missing required alt attribute: ${src}`
      });
    }

    // Modern format check (advisory WARN, never blocking FAIL)
    const ext = path.extname(src.split('?')[0]).toLowerCase();
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      issues.push({
        severity: 'WARN',
        message: `Legacy image format (${ext}): ${src}. Consider WebP, AVIF, or SVG.`
      });
    }

    // Explicit dimensions check (CLS mitigation)
    if (!imageInfo.hasDimensions && !/aspect-ratio/i.test(attrs)) {
      issues.push({
        severity: 'WARN',
        message: `Missing explicit width/height dimensions on image: ${src} (CLS risk).`
      });
    }
  }

  return {
    filePath,
    totalImages: images.length,
    images,
    issues
  };
}

function runCheck(targetDir) {
  const root = targetDir || process.cwd();
  const distDir = path.join(root, 'dist');
  const buildDir = path.join(root, 'build');
  const publicDir = path.join(root, 'public');

  let htmlFiles = [];
  if (fs.existsSync(distDir)) {
    htmlFiles = findHtmlFiles(distDir);
  } else if (fs.existsSync(buildDir)) {
    htmlFiles = findHtmlFiles(buildDir);
  } else if (fs.existsSync(publicDir)) {
    htmlFiles = findHtmlFiles(publicDir);
  } else {
    htmlFiles = findHtmlFiles(root);
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
    return analyzeImages(content, path.relative(root, f));
  });

  const totalImages = results.reduce((sum, r) => sum + r.totalImages, 0);
  if (totalImages === 0) {
    return {
      status: 'PASS',
      message: 'No <img> tags found in analyzed HTML files.',
      filesAnalyzed: htmlFiles.length,
      totalImages: 0,
      results
    };
  }

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
    filesAnalyzed: htmlFiles.length,
    totalImages,
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
