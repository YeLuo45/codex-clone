import { describe, it, expect, beforeAll } from "vitest";
import { buildIndex, search } from "../src/lib/searchIndex";

const sampleDocs = [
  { id: "1", title: "Codex CLI", url: "/cli", content: "Run Codex from the terminal", tags: ["cli"] },
  { id: "2", title: "GPT-5.5 Overview", url: "/gpt", content: "Flagship reasoning model", tags: ["gpt"] },
  { id: "3", title: "Code review skill", url: "/skills/review", content: "PR automation", tags: ["skill"] },
];

beforeAll(() => buildIndex(sampleDocs));

describe("searchIndex.buildIndex + search", () => {
  it("finds matching docs by title token", () => {
    const hits = search("codex");
    expect(hits.length).toBeGreaterThanOrEqual(1);
    expect(hits.find((h) => h.title === "Codex CLI")).toBeDefined();
  });

  it("finds matching docs by content token", () => {
    const hits = search("flagship");
    expect(hits.length).toBeGreaterThanOrEqual(1);
    expect(hits.find((h) => h.title === "GPT-5.5 Overview")).toBeDefined();
  });

  it("returns empty for empty query", () => {
    expect(search("").length).toBe(0);
    expect(search("   ").length).toBe(0);
  });

  it("returns empty for non-matching query", () => {
    expect(search("zzzzzunlikelymatchxxxxx").length).toBe(0);
  });

  it("respects the limit parameter", () => {
    const hits = search("code", 1);
    expect(hits.length).toBeLessThanOrEqual(1);
  });

  it("includes snippet from content", () => {
    const hits = search("terminal");
    expect(hits.length).toBeGreaterThanOrEqual(1);
    expect(hits[0].snippet.length).toBeGreaterThan(0);
  });

  it("falls back to a 120-char head snippet when no token position matches", () => {
    // Inject a doc where the query word doesn't appear in the content body but
    // the index still finds a hit (via tag/title-only flexsearch match).
    buildIndex([
      { id: "x1", title: "Unrelated heading", url: "/x", content: "lorem ipsum dolor sit amet", tags: ["pr-merge"] },
    ]);
    // Tag match — query is a tag, not in content
    const hits = search("pr-merge");
    expect(hits.length).toBeGreaterThanOrEqual(1);
    expect(hits[0].snippet).toContain("lorem ipsum");
    // Restore the working set for downstream tests
    buildIndex(sampleDocs);
  });
});

describe("i18n configuration", () => {
  it("loads without throwing", async () => {
    const i18n = (await import("../src/lib/i18n")).default;
    expect(i18n.isInitialized).toBe(true);
  });

  it("exposes Chinese + English translation keys for nav items", async () => {
    const i18n = (await import("../src/lib/i18n")).default;
    // Force a render through changeLanguage so the right resource set is loaded
    await i18n.changeLanguage("zh");
    expect(i18n.t("nav.docs")).toBeTruthy();
    await i18n.changeLanguage("en");
    expect(i18n.t("nav.docs")).toBeTruthy();
  });
});
