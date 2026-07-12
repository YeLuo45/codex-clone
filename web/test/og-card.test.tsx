import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OG_SVG = resolve(__dirname, "..", "public", "assets", "og-card.svg");

describe("public/assets/og-card.svg (Open Graph card)", () => {
  it("exists at the expected path", () => {
    expect(existsSync(OG_SVG)).toBe(true);
  });

  it("declares the 1200x630 dimension (OG card spec)", () => {
    const svg = readFileSync(OG_SVG, "utf8");
    expect(svg).toMatch(/<svg[^>]+width="1200"[^>]+height="630"/);
  });

  it("contains the Codex wordmark", () => {
    const svg = readFileSync(OG_SVG, "utf8");
    expect(svg).toMatch(/>Codex</);
  });

  it("contains the 5-petal Codex blossom (5 ellipses)", () => {
    const svg = readFileSync(OG_SVG, "utf8");
    // Each petal is an <ellipse> — 5 petals + 1 inner circle + 1 outer circle = at least 6+1
    const ellipseCount = (svg.match(/<ellipse/g) || []).length;
    expect(ellipseCount, "expected at least 5 petal ellipses").toBeGreaterThanOrEqual(5);
  });

  it("uses the brand color stop #7C5CFF (Codex purple)", () => {
    const svg = readFileSync(OG_SVG, "utf8");
    expect(svg).toContain("#7C5CFF");
  });

  it("is renderable as XML (well-formed)", () => {
    const svg = readFileSync(OG_SVG, "utf8");
    // Self-closing <ellipse .../> is allowed (no </ellipse> needed).
    // Verify only that the SVG opens and closes exactly once each.
    expect((svg.match(/<svg[\s>]/g) || []).length).toBe(1);
    expect((svg.match(/<\/svg>/g) || []).length).toBe(1);
    // No raw `&` (must be &amp;) — entity well-formedness sanity
    expect((svg.match(/&[^;\s<]*[;\s<]/g) || []).filter((m) => !/^&(amp|lt|gt|quot|apos);/.test(m))).toEqual([]);
  });
});

describe("perPageMeta references og-card correctly", () => {
  it("HERO_IMAGE points to assets/og-card.svg after D12", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const src = fs.readFileSync(
      path.resolve(__dirname, "..", "src", "lib", "perPageMeta.ts"),
      "utf8"
    );
    expect(src).toMatch(/HERO_IMAGE\s*=\s*["']\.\/assets\/og-card\.svg["']/);
  });

  it("every route's metaFor() defaults to og-card when image omitted", async () => {
    const { ROUTE_META, metaFor } = await import("../src/lib/perPageMeta");
    for (const key of [
      "home",
      "home-en",
      "pricing",
      "docs",
      "skills",
      "enterprise",
      "code-search",
    ] as const) {
      const m = metaFor({ key, ...ROUTE_META[key] });
      expect(m.image, `${key} should default to og-card`).toMatch(/og-card\.(svg|png)/);
    }
  });
});
