#!/usr/bin/env node
/**
 * Post-build smoke test for the SPA bundle.
 *
 * Asserts that the production dist/ contains:
 *   - index.html (entry point)
 *   - sitemap.xml with 7 URL entries
 *   - robots.txt referencing the sitemap
 *   - at least one main JS chunk
 *
 * No network needed — runs against ./dist/ after `npm run build`.
 * Exit code 0 = pass; 1 = any required artifact missing.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");

const failures = [];

function assertExists(relPath, label) {
  const full = join(DIST, relPath);
  if (!existsSync(full)) {
    failures.push(`missing ${label}: ${relPath}`);
  }
}

function assertContains(relPath, needle, label) {
  const full = join(DIST, relPath);
  if (!existsSync(full)) {
    failures.push(`missing ${label}: ${relPath}`);
    return;
  }
  const text = readFileSync(full, "utf8");
  if (!text.includes(needle)) {
    failures.push(`${label} does not contain "${needle}"`);
  }
}

function assertMatches(relPath, regex, label) {
  const full = join(DIST, relPath);
  if (!existsSync(full)) {
    failures.push(`missing ${label}: ${relPath}`);
    return;
  }
  const text = readFileSync(full, "utf8");
  const m = text.match(regex);
  if (!m) {
    failures.push(`${label} does not match ${regex}`);
  }
  return m;
}

const EXPECTED_SITEMAP_PATHS = [
  "https://yeluo45.github.io/codex-clone/#",
  "https://yeluo45.github.io/codex-clone/#/en",
  "https://yeluo45.github.io/codex-clone/#/pricing",
  "https://yeluo45.github.io/codex-clone/#/docs",
  "https://yeluo45.github.io/codex-clone/#/skills",
  "https://yeluo45.github.io/codex-clone/#/enterprise",
  "https://yeluo45.github.io/codex-clone/#/code-search",
];

// 1. Required files
assertExists("index.html", "index.html");
assertExists("sitemap.xml", "sitemap.xml");
assertExists("robots.txt", "robots.txt");

// 2. index.html sanity
assertMatches("index.html", /<title>.*Codex.*<\/title>/, "index.html title");
assertMatches("index.html", /<div id="root"><\/div>/, "index.html root div");
assertMatches("index.html", /src="\.\/assets\/index-[A-Za-z0-9_-]+\.js"/, "index.html main JS bundle");

// 3. sitemap.xml: 7 routes
const sitemapCount = EXPECTED_SITEMAP_PATHS.filter((u) => {
  const sitemapPath = join(DIST, "sitemap.xml");
  if (!existsSync(sitemapPath)) return false;
  return readFileSync(sitemapPath, "utf8").includes(u);
}).length;
if (sitemapCount < EXPECTED_SITEMAP_PATHS.length) {
  failures.push(`sitemap.xml contains ${sitemapCount}/${EXPECTED_SITEMAP_PATHS.length} expected routes`);
}

// 4. robots.txt references sitemap
assertContains("robots.txt", "sitemap.xml", "robots.txt");

// 5. At least one main JS chunk + the per-route metadata registry excerpt
const assets = existsSync(join(DIST, "assets")) ? readdirSync(join(DIST, "assets")) : [];
const mainChunks = assets.filter((f) => /^index-.*\.js$/.test(f));
if (mainChunks.length < 1) {
  failures.push("no main index-*.js chunk in dist/assets/");
}
const lazyChunks = assets.filter((f) => /^(CodeBlock|searchIndex)-.*\.js$/.test(f));
if (lazyChunks.length < 2) {
  failures.push(`expected ≥2 lazy chunks (CodeBlock, searchIndex); got ${lazyChunks.length}`);
}

// 6. Output
if (failures.length === 0) {
  console.log(`[check-dist] PASS — index.html + sitemap.xml(${EXPECTED_SITEMAP_PATHS.length} routes) + robots.txt + ${mainChunks.length} main chunk + ${lazyChunks.length} lazy chunks`);
  process.exit(0);
} else {
  console.error(`[check-dist] FAIL`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
