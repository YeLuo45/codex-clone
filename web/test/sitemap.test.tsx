import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "node:child_process";
import { writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
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
    // /docs block — find and check it has no xhtml:link tags within its block
    const docsIdx = xml.indexOf(`<loc>https://yeluo45.github.io/codex-clone/#/docs</loc>`);
    expect(docsIdx).toBeGreaterThanOrEqual(0);
    const docsBlock = xml.slice(docsIdx, docsIdx + 500);
    expect(docsBlock).not.toMatch(/xhtml:link/);
  });

  it("robots.txt still references sitemap.xml", () => {
    run(`node ${POSTBUILD}`);
    const robots = readFileSync(resolve(WEB, "dist", "robots.txt"), "utf8");
    expect(robots).toMatch(/Sitemap:.*sitemap\.xml/);
  });
});
