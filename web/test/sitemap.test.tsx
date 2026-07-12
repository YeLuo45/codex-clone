import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "node:child_process";
import { writeFileSync, readFileSync, rmSync, existsSync, renameSync } from "node:fs";
import { resolve } from "node:path";

const WEB = resolve(__dirname, "..");
const POSTBUILD = "scripts/postbuild.mjs";

function run(cmd: string) {
  return execSync(cmd, { encoding: "utf8", cwd: WEB, stdio: "pipe" });
}

describe("scripts/postbuild.mjs — sitemap with hreflang", () => {
  beforeEach(() => {
    if (!existsSync(resolve(WEB, "dist"))) {
      run("npm run build");
    }
  });

  it("generates 7 <url> entries", () => {
    run(`node ${POSTBUILD}`);
    const xml = readFileSync(resolve(WEB, "dist", "sitemap.xml"), "utf8");
    const matches = (xml.match(/<url>/g) || []).length;
    expect(matches).toBe(7);
  });

  it("includes xhtml namespace", () => {
    run(`node ${POSTBUILD}`);
    const xml = readFileSync(resolve(WEB, "dist", "sitemap.xml"), "utf8");
    expect(xml).toMatch(/xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
  });

  it("home route has hreflang zh-CN + en + x-default pair", () => {
    run(`node ${POSTBUILD}`);
    const xml = readFileSync(resolve(WEB, "dist", "sitemap.xml"), "utf8");
    // The home <url> block should contain three alternate links
    const homeIdx = xml.indexOf(`<loc>https://yeluo45.github.io/codex-clone/#</loc>`);
    expect(homeIdx).toBeGreaterThanOrEqual(0);
    const homeBlock = xml.slice(homeIdx, homeIdx + 700);
    expect(homeBlock).toMatch(/hreflang="zh-CN"/);
    expect(homeBlock).toMatch(/hreflang="en"/);
    expect(homeBlock).toMatch(/hreflang="x-default"/);
  });

  it("non-translated routes (docs, skills, etc) have NO hreflang tags", () => {
    run(`node ${POSTBUILD}`);
    const xml = readFileSync(resolve(WEB, "dist", "sitemap.xml"), "utf8");
    // /docs block — find and check it has no xhtml:link tags within its block.
    // The block boundary is the next </url> after the docs <loc>.
    const docsStart = xml.indexOf(`<loc>https://yeluo45.github.io/codex-clone/#/docs</loc>`);
    expect(docsStart).toBeGreaterThanOrEqual(0);
    const after = xml.slice(docsStart);
    const blockEnd = after.indexOf("</url>");
    expect(blockEnd).toBeGreaterThan(0);
    const docsBlock = after.slice(0, blockEnd + "</url>".length);
    expect(docsBlock).not.toMatch(/xhtml:link/);
  });

  it("robots.txt still references sitemap.xml", () => {
    run(`node ${POSTBUILD}`);
    const robots = readFileSync(resolve(WEB, "dist", "robots.txt"), "utf8");
    expect(robots).toMatch(/Sitemap:.*sitemap\.xml/);
  });
});

describe("scripts/postbuild.mjs — CSP hardening meta injection", () => {
  beforeEach(() => {
    if (!existsSync(resolve(WEB, "dist"))) {
      run("npm run build");
    }
  });

  it("injects Content-Security-Policy meta into dist/index.html", () => {
    run(`node ${POSTBUILD}`);
    const html = readFileSync(resolve(WEB, "dist", "index.html"), "utf8");
    expect(html).toMatch(/<meta\s+http-equiv="Content-Security-Policy"/);
    expect(html).toMatch(/default-src 'self'/);
    expect(html).toMatch(/frame-ancestors 'self'/);
  });

  it("injects Permissions-Policy meta with sensor + payment + usb blocked", () => {
    run(`node ${POSTBUILD}`);
    const html = readFileSync(resolve(WEB, "dist", "index.html"), "utf8");
    expect(html).toMatch(/<meta\s+http-equiv="Permissions-Policy"/);
    expect(html).toMatch(/camera=\(\)/);
    expect(html).toMatch(/microphone=\(\)/);
    expect(html).toMatch(/payment=\(\)/);
  });

  it("injects Referrer-Policy meta + X-Content-Type-Options nosniff", () => {
    run(`node ${POSTBUILD}`);
    const html = readFileSync(resolve(WEB, "dist", "index.html"), "utf8");
    expect(html).toMatch(/<meta\s+name="referrer"\s+content="strict-origin-when-cross-origin"/);
    expect(html).toMatch(/<meta\s+http-equiv="X-Content-Type-Options"\s+content="nosniff"/);
  });

  it("postbuild is idempotent — does NOT re-inject when CSP already present", () => {
    run(`node ${POSTBUILD}`);
    const firstHtml = readFileSync(resolve(WEB, "dist", "index.html"), "utf8");
    const firstCspCount = (firstHtml.match(/Content-Security-Policy/g) || []).length;

    run(`node ${POSTBUILD}`);
    const secondHtml = readFileSync(resolve(WEB, "dist", "index.html"), "utf8");
    const secondCspCount = (secondHtml.match(/Content-Security-Policy/g) || []).length;

    expect(secondCspCount).toBe(firstCspCount);
  });

  it("postbuild skips CSP injection gracefully when index.html is missing", () => {
    const indexPath = resolve(WEB, "dist", "index.html");
    const backup = resolve(WEB, "dist", "index.html.csp-test.bak");
    if (!existsSync(indexPath)) {
      run("npm run build");
    }
    renameSync(indexPath, backup);
    try {
      let stdout = "";
      try {
        stdout = run(`node ${POSTBUILD}`);
      } catch (e: any) {
        stdout = (e.stdout || "") + (e.stderr || "");
      }
      expect(stdout).toMatch(/Skipped CSP injection/);
      // sitemap.xml + robots.txt must STILL be written even when index.html is absent
      expect(existsSync(resolve(WEB, "dist", "sitemap.xml"))).toBe(true);
      expect(existsSync(resolve(WEB, "dist", "robots.txt"))).toBe(true);
    } finally {
      if (existsSync(backup)) {
        if (existsSync(indexPath)) {
          require("node:fs").unlinkSync(indexPath);
        }
        renameSync(backup, indexPath);
      }
    }
  });
});
