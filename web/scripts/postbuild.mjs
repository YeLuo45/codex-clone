#!/usr/bin/env node
// Postbuild: generate sitemap.xml + robots.txt + per-language hreflang entries.
//
// Update strategy:
//   - Single sitemap.xml with 7 routes; xhtml:link hreflang="en" / "zh-CN"
//     tags point to the corresponding translations (en/home pair uses #/en).
//   - robots.txt unchanged (already references sitemap.xml).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

const SITE = 'https://yeluo45.github.io/codex-clone';

const ROUTES = [
  { path: '', locale: 'zh-CN', altPath: '/en', altLocale: 'en', priority: '1.0', changefreq: 'weekly' },
  { path: '/en', locale: 'en', altPath: '', altLocale: 'zh-CN', priority: '0.9', changefreq: 'weekly' },
  { path: '/pricing', locale: 'en', altPath: null, altLocale: 'zh-CN', priority: '0.8', changefreq: 'weekly' },
  { path: '/docs', locale: 'zh-CN', altPath: null, altLocale: null, priority: '0.9', changefreq: 'weekly' },
  { path: '/skills', locale: 'zh-CN', altPath: null, altLocale: null, priority: '0.8', changefreq: 'weekly' },
  { path: '/enterprise', locale: 'zh-CN', altPath: null, altLocale: null, priority: '0.7', changefreq: 'monthly' },
  { path: '/code-search', locale: 'zh-CN', altPath: null, altLocale: null, priority: '0.7', changefreq: 'monthly' },
];

function urlTags(r) {
  const self = `${SITE}/#${r.path}`;
  const lines = [`    <loc>${self}</loc>`];
  if (r.altPath !== null) {
    const altUrl = `${SITE}/#${r.altPath}`;
    lines.unshift(`    <xhtml:link rel="alternate" hreflang="${r.locale}" href="${self}"/>`);
    lines.push(`    <xhtml:link rel="alternate" hreflang="${r.altLocale}" href="${altUrl}"/>`);
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${self}"/>`);
  }
  lines.push(`    <changefreq>${r.changefreq}</changefreq>`);
  lines.push(`    <priority>${r.priority}</priority>`);
  return lines.join('\n');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${ROUTES.map((r) => `  <url>\n${urlTags(r)}\n  </url>`).join('\n')}
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

console.log(`[postbuild] Generated sitemap.xml (${ROUTES.length} URLs with hreflang) and robots.txt`);

// Append CSP + Permissions-Policy + Referrer-Policy meta tags just before </head>.
// GitHub Pages can't set HTTP headers from a static build; meta http-equiv is the
// next best defense.
const csp = [
  "default-src 'self'",
  "img-src 'self' https: data:",
  "media-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://fonts.googleapis.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const otherMeta = [
  `<meta name="referrer" content="strict-origin-when-cross-origin">`,
  `<meta http-equiv="X-Content-Type-Options" content="nosniff">`,
  `<meta http-equiv="Permissions-Policy" content="accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()">`,
].join('\n  ');

const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  const inject = `\n  <!-- Hardening meta tags injected by scripts/postbuild.mjs -->\n  <meta http-equiv="Content-Security-Policy" content="${csp}">\n  ${otherMeta}\n`;
  if (!html.includes('Content-Security-Policy')) {
    html = html.replace('  </head>', inject + '  </head>');
    fs.writeFileSync(indexPath, html);
    console.log('[postbuild] Injected CSP + Permissions-Policy + Referrer-Policy meta tags');
  }
} else {
  console.log(`[postbuild] Skipped CSP injection (no ${path.relative(process.cwd(), indexPath)})`);
}
