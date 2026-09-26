#!/usr/bin/env node
// Checks the built site in dist/ for SEO and link problems.
// Usage: npm run build && npm run check
// Exits with code 1 if any error is found. Warnings don't fail the run.

import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
if (!fs.existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const all = walk(DIST);
const htmlFiles = all.filter((f) => f.endsWith('.html'));
const rel = (f) => '/' + path.relative(DIST, f).split(path.sep).join('/');
const urlPathOf = (f) => rel(f).replace(/index\.html$/, '');

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const metas = (html, key, value) =>
  [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => m[0]).filter((t) => attr(t, key) === value);
const metaContent = (html, key, value) => {
  const t = metas(html, key, value);
  return t.length ? attr(t[0], 'content') : undefined;
};
const decode = (s = '') =>
  s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// Resolve a site-relative URL path to a file in dist/
function exists(urlPath) {
  const clean = decodeURI(urlPath.split(/[?#]/)[0]);
  const target = path.join(DIST, clean);
  if (clean.endsWith('/')) return fs.existsSync(path.join(target, 'index.html'));
  return fs.existsSync(target);
}

let siteOrigin;
const sitemapText = all
  .filter((f) => /sitemap-\d+\.xml$/.test(f))
  .map((f) => fs.readFileSync(f, 'utf8'))
  .join('\n');
const sitemapUrls = new Set([...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));

const titles = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const name = rel(file);
  const html = fs.readFileSync(file, 'utf8');
  const is404 = name === '/404.html';
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);

  // <html lang>
  if (!/<html[^>]*\slang="[a-z]{2}/.test(html)) err(name, 'missing <html lang="…">');

  // <title>
  const titleMatches = [...html.matchAll(/<title>([^<]*)<\/title>/g)];
  if (titleMatches.length !== 1) err(name, `expected exactly 1 <title>, found ${titleMatches.length}`);
  const title = decode(titleMatches[0]?.[1]?.trim());
  if (title) {
    if (title.length > 70) warn(name, `title is ${title.length} characters; search results cut off around 60–70`);
    if (!noindex) titles.set(title, [...(titles.get(title) ?? []), name]);
  }

  // meta description
  const desc = decode(metaContent(html, 'name', 'description'));
  if (!desc) err(name, 'missing meta description');
  else if (!noindex) {
    if (desc.length < 50) warn(name, `description is only ${desc.length} characters; aim for 120–155`);
    if (desc.length > 160) warn(name, `description is ${desc.length} characters; search results cut off around 155`);
    if (!noindex) descriptions.set(desc, [...(descriptions.get(desc) ?? []), name]);
  }

  // Exactly one h1
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) err(name, `expected exactly 1 <h1>, found ${h1s}`);

  // Canonical
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) err(name, 'missing <link rel="canonical">');
  else {
    const u = new URL(canonical);
    siteOrigin ??= u.origin;
    if (u.protocol !== 'https:') err(name, `canonical is not https: ${canonical}`);
    if (!is404 && u.pathname !== urlPathOf(file)) err(name, `canonical path ${u.pathname} doesn't match page path ${urlPathOf(file)}`);
    if (!is404 && !noindex && sitemapUrls.size && !sitemapUrls.has(canonical)) err(name, 'page is not in the sitemap');
  }

  // Open Graph / Twitter
  for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
    if (!metaContent(html, 'property', p)) err(name, `missing <meta property="${p}">`);
  }
  if (!metaContent(html, 'name', 'twitter:card')) err(name, 'missing <meta name="twitter:card">');
  const ogImage = metaContent(html, 'property', 'og:image');
  if (ogImage) {
    const p = new URL(ogImage).pathname;
    if (!exists(p)) err(name, `og:image file not found in dist: ${p}`);
  }

  // JSON-LD must parse; posts need BlogPosting
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const types = [];
  for (const [, json] of ld) {
    try {
      const data = JSON.parse(json);
      types.push(data['@type']);
    } catch (e) {
      err(name, `JSON-LD does not parse: ${e.message}`);
    }
  }
  const isPost = /^\/writing\/(?!topics\/)[^/]+\/index\.html$/.test(name);
  if (isPost && !types.includes('BlogPosting')) err(name, 'post is missing BlogPosting JSON-LD');
  if (isPost && metaContent(html, 'property', 'og:type') !== 'article') err(name, 'post og:type should be "article"');
  if (name === '/index.html' && !types.includes('ProfilePage')) err(name, 'home page is missing ProfilePage JSON-LD');

  // Images need alt text
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(img)) err(name, `image without alt attribute: ${img.slice(0, 80)}…`);
    else if (/\salt=""/.test(img)) warn(name, `image with empty alt text (fine only if purely decorative): ${attr(img, 'src')}`);
    const src = attr(img, 'src');
    if (src?.startsWith('/') && !src.startsWith('//') && !exists(src)) err(name, `image file not found: ${src}`);
  }

  // Internal links resolve
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (!exists(href)) err(name, `broken internal link: ${href}`);
    else if (!href.includes('.') && !href.split(/[?#]/)[0].endsWith('/')) warn(name, `internal link without trailing slash: ${href}`);
  }
}

if (siteOrigin?.includes('your-github-username'))
  warn('src/site.config.ts', 'site URL is still the placeholder. Set `url` to https://<username>.github.io before deploying');

// Duplicates across pages
for (const [t, pages] of titles) if (pages.length > 1) err(pages.join(', '), `duplicate title "${t}"`);
for (const [d, pages] of descriptions) if (pages.length > 1) warn(pages.join(', '), `duplicate description "${d.slice(0, 60)}…"`);

// Site-wide files
for (const f of ['robots.txt', 'sitemap-index.xml', 'rss.xml', 'favicon.svg']) {
  if (!fs.existsSync(path.join(DIST, f))) err('/', `missing /${f}`);
}
if (fs.existsSync(path.join(DIST, 'robots.txt')) && !/Sitemap:\s*https:\/\//.test(fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8')))
  err('/robots.txt', 'robots.txt does not point to the sitemap');
if (sitemapText.includes('/404')) err('/sitemap', '404 page should not be in the sitemap');

// Report
for (const w of warnings) console.warn(`warn   ${w}`);
for (const e of errors) console.error(`error  ${e}`);
console.log(`\nChecked ${htmlFiles.length} pages: ${errors.length} errors, ${warnings.length} warnings.`);
process.exit(errors.length ? 1 : 0);
