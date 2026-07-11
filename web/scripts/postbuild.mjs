#!/usr/bin/env node
// Postbuild: generate sitemap.xml + robots.txt
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

const SITE = 'https://yeluo45.github.io/codex-clone';

const ROUTES = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/en', priority: '0.9', changefreq: 'weekly' },
  { path: '/pricing', priority: '0.8', changefreq: 'weekly' },
  { path: '/docs', priority: '0.9', changefreq: 'weekly' },
  { path: '/skills', priority: '0.8', changefreq: 'weekly' },
  { path: '/enterprise', priority: '0.7', changefreq: 'monthly' },
  { path: '/code-search', priority: '0.7', changefreq: 'monthly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (r) =>
    `  <url>\n    <loc>${SITE}/#${r.path}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
).join('\n')}
</urlset>
`;

const robots = `# robots.txt for Codex clone (OpenAI Codex 中文站复刻)
User-agent: *
Allow: /

# AI crawlers — explicit allow
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(distDir, 'robots.txt'), robots);

console.log(`[postbuild] Generated sitemap.xml (${ROUTES.length} URLs) and robots.txt`);