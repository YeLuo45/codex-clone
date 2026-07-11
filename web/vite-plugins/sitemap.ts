// Vite plugin: generate sitemap.xml + robots.txt after build
import type { Plugin } from "vite";

const SITE = "https://yeluo45.github.io/codex-clone";

const ROUTES = [
  { path: "", priority: "1.0", changefreq: "weekly" },
  { path: "/en", priority: "0.9", changefreq: "weekly" },
  { path: "/pricing", priority: "0.8", changefreq: "weekly" },
  { path: "/docs", priority: "0.9", changefreq: "weekly" },
  { path: "/skills", priority: "0.8", changefreq: "weekly" },
  { path: "/enterprise", priority: "0.7", changefreq: "monthly" },
  { path: "/code-search", priority: "0.7", changefreq: "monthly" },
];

export function sitemapPlugin(): Plugin {
  return {
    name: "codex-sitemap",
    apply: "build",
    closeBundle() {
      // @ts-ignore
      const fs = require("node:fs");
      // @ts-ignore
      const path = require("node:path");
      const outDir = path.resolve(process.cwd(), "dist");

      // Generate sitemap.xml (each path is HashRouter-formatted: /#/path)
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (r) =>
    `  <url>\n    <loc>${SITE}/#${r.path}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
).join("\n")}
</urlset>
`;
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);

      // robots.txt
      const robots = `# robots.txt for Codex clone
User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml

# AI crawlers — explicit policy
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /
`;
      fs.writeFileSync(path.join(outDir, "robots.txt"), robots);

      console.log(`✓ Generated sitemap.xml (${ROUTES.length} URLs) and robots.txt`);
    },
  };
}