#!/usr/bin/env node
/**
 * check-seo-canonical-llms.js
 * Validates technical SEO & AI search infrastructure:
 * - Absolute canonical tags across HTML pages
 * - Presence & valid URLs in sitemap.xml
 * - Sitemap directive in robots.txt
 * - Structural format of llms.txt (valid markdown links)
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

function checkCanonicals(htmlFiles, root) {
  if (htmlFiles.length === 0) return { status: 'N/A', message: 'No HTML files found to check' };

  const issues = [];
  let checkedCount = 0;

  for (const file of htmlFiles) {
    checkedCount++;
    const content = fs.readFileSync(file, 'utf8');
    const canonicalMatch = /<link\b[^>]*\brel=["']canonical["'][^>]*>/i.exec(content)
      || /<link\b[^>]*\bhref=["']([^"']*)["'][^>]*\brel=["']canonical["'][^>]*>/i.exec(content);

    if (!canonicalMatch) {
      issues.push({
        severity: 'WARN',
        file: path.relative(root, file),
        message: 'No <link rel="canonical"> found on this page.'
      });
      continue;
    }

    const tag = canonicalMatch[0];
    const hrefMatch = /href=["']([^"']*)["']/i.exec(tag);
    if (!hrefMatch || !hrefMatch[1]) {
      issues.push({
        severity: 'FAIL',
        file: path.relative(root, file),
        message: 'Canonical tag present but href attribute is missing or empty.'
      });
    } else {
      const url = hrefMatch[1];
      if (!/^https?:\/\//i.test(url)) {
        issues.push({
          severity: 'FAIL',
          file: path.relative(root, file),
          message: `Relative canonical URL detected (${url}); must be an absolute URL.`
        });
      }
    }
  }

  const hasFail = issues.some(i => i.severity === 'FAIL');
  const hasWarn = issues.some(i => i.severity === 'WARN');
  return {
    status: hasFail ? 'FAIL' : (hasWarn ? 'WARN' : 'PASS'),
    checkedCount,
    issues
  };
}

function checkSitemap(root) {
  const candidates = [
    path.join(root, 'dist', 'sitemap.xml'),
    path.join(root, 'public', 'sitemap.xml'),
    path.join(root, 'sitemap.xml')
  ];

  const found = candidates.find(f => fs.existsSync(f));
  if (!found) {
    return { status: 'N/A', message: 'sitemap.xml not found (not yet generated or not applicable).' };
  }

  const content = fs.readFileSync(found, 'utf8');
  const issues = [];
  const locMatches = content.match(/<loc>([\s\S]*?)<\/loc>/g) || [];

  if (locMatches.length === 0) {
    issues.push({ severity: 'FAIL', message: 'sitemap.xml exists but contains no <loc> entries.' });
  } else {
    for (const loc of locMatches) {
      const url = loc.replace(/<\/?loc>/g, '').trim();
      if (!/^https?:\/\//i.test(url)) {
        issues.push({ severity: 'FAIL', message: `Relative URL detected in sitemap: ${url}` });
        break;
      }
    }
  }

  return {
    status: issues.length > 0 ? 'FAIL' : 'PASS',
    filePath: path.relative(root, found),
    urlCount: locMatches.length,
    issues
  };
}

function checkRobots(root) {
  const candidates = [
    path.join(root, 'dist', 'robots.txt'),
    path.join(root, 'public', 'robots.txt'),
    path.join(root, 'robots.txt')
  ];

  const found = candidates.find(f => fs.existsSync(f));
  if (!found) {
    return { status: 'N/A', message: 'robots.txt not found.' };
  }

  const content = fs.readFileSync(found, 'utf8');
  const issues = [];
  const hasSitemapDirective = /Sitemap:\s*https?:\/\//i.test(content);

  if (!hasSitemapDirective) {
    issues.push({
      severity: 'WARN',
      message: 'Sitemap directive missing or does not point to an absolute URL in robots.txt.'
    });
  }

  return {
    status: issues.length > 0 ? 'WARN' : 'PASS',
    filePath: path.relative(root, found),
    hasSitemapDirective,
    issues
  };
}

function checkLlmsTxt(root) {
  const candidates = [
    path.join(root, 'dist', 'llms.txt'),
    path.join(root, 'public', 'llms.txt'),
    path.join(root, 'llms.txt')
  ];

  const found = candidates.find(f => fs.existsSync(f));
  if (!found) {
    return { status: 'N/A', message: 'llms.txt not found (optional for AI crawlers).' };
  }

  const content = fs.readFileSync(found, 'utf8');
  const issues = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('-') && !line.includes('[') && !line.includes('http')) {
      issues.push({
        severity: 'WARN',
        message: `Line ${i + 1} in llms.txt has unlinked list item: "${line.slice(0, 50)}"`
      });
    }
  }

  return {
    status: issues.length > 0 ? 'WARN' : 'PASS',
    filePath: path.relative(root, found),
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

  const canonicalRes = checkCanonicals(htmlFiles, root);
  const sitemapRes = checkSitemap(root);
  const robotsRes = checkRobots(root);
  const llmsRes = checkLlmsTxt(root);

  const subChecks = [canonicalRes, sitemapRes, robotsRes, llmsRes];
  const hasFail = subChecks.some(c => c.status === 'FAIL');
  const hasWarn = subChecks.some(c => c.status === 'WARN');

  const status = hasFail ? 'FAIL' : (hasWarn ? 'WARN' : 'PASS');

  return {
    status,
    checks: {
      canonical: canonicalRes,
      sitemap: sitemapRes,
      robots: robotsRes,
      llms: llmsRes
    }
  };
}

if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  const res = runCheck(target);
  console.log(JSON.stringify(res, null, 2));
  process.exit(res.status === 'FAIL' ? 1 : 0);
}

module.exports = { runCheck };
