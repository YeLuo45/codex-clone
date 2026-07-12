import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, "..", "public");

describe("favicon / manifest / browser config assets", () => {
  it("exposes SVG favicon for modern browsers", () => {
    const f = resolve(PUBLIC, "assets", "favicon.svg");
    expect(existsSync(f)).toBe(true);
    const text = readFileSync(f, "utf8");
    expect(text).toMatch(/<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    // 5-petal Codex blossom mark
    expect((text.match(/ellipse/g) || []).length).toBeGreaterThanOrEqual(5);
  });

  it("exposes manifest.webmanifest with required PWA fields", () => {
    const f = resolve(PUBLIC, "manifest.webmanifest");
    expect(existsSync(f)).toBe(true);
    const m = JSON.parse(readFileSync(f, "utf8"));
    expect(m.name).toBeTruthy();
    expect(m.short_name).toBeTruthy();
    expect(m.start_url).toBeTruthy();
    expect(m.display).toBe("standalone");
    expect(Array.isArray(m.icons)).toBe(true);
    expect(m.icons.length).toBeGreaterThanOrEqual(1);
  });

  it("exposes browserconfig.xml for Microsoft tile config", () => {
    const f = resolve(PUBLIC, "browserconfig.xml");
    expect(existsSync(f)).toBe(true);
    const text = readFileSync(f, "utf8");
    expect(text).toMatch(/<TileColor>/);
    expect(text).toMatch(/square150x150logo/);
  });
});

describe("index.html meta tags", () => {
  const html = readFileSync(resolve(__dirname, "..", "index.html"), "utf8");

  it("declares theme-color", () => {
    expect(html).toMatch(/<meta\s+name="theme-color"\s+content="[^"]+"/);
  });

  it("declares viewport with viewport-fit=cover (iOS safe-area)", () => {
    expect(html).toMatch(/viewport-fit=cover/);
  });

  it("declares og:site_name", () => {
    expect(html).toMatch(/<meta\s+property="og:site_name"/);
  });

  it("declares twitter:card metadata", () => {
    expect(html).toMatch(/<meta\s+name="twitter:card"/);
  });

  it("links the SVG favicon first (modern browsers)", () => {
    const svgLink = html.match(/<link\s+rel="icon"\s+type="image\/svg\+xml"[^>]+>/);
    expect(svgLink).toBeTruthy();
  });

  it("points og:image / twitter:image to og-card.svg", () => {
    expect(html).toMatch(/<meta\s+property="og:image"\s+content="\.\/assets\/og-card\.svg"/);
    expect(html).toMatch(/<meta\s+name="twitter:image"\s+content="\.\/assets\/og-card\.svg"/);
  });

  it("falls back to og-card.png via image_src for legacy scrapers", () => {
    expect(html).toMatch(/<link\s+rel="image_src"\s+href="\.\/assets\/og-card\.png"/);
  });

  it("links apple-touch-icon", () => {
    expect(html).toMatch(/<link\s+rel="apple-touch-icon"/);
  });

  it("links mask-icon (Safari pinned tab)", () => {
    expect(html).toMatch(/<link\s+rel="mask-icon"/);
  });

  it("links manifest.webmanifest", () => {
    expect(html).toMatch(/<link\s+rel="manifest"\s+href="\.\/manifest\.webmanifest"/);
  });
});
