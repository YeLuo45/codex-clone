import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDocumentHead, type DocumentHeadMeta } from "../src/lib/useDocumentHead";
import { metaFor, ROUTE_META } from "../src/lib/perPageMeta";

describe("metaFor()", () => {
  it("stamps SITE_NAME suffix on title", () => {
    const m = metaFor({ key: "home", ...ROUTE_META.home });
    expect(m.title).toMatch(/\| Codex$/);
    expect(m.title).toContain("面向软件工程");
  });

  it("selects article type for non-home pages", () => {
    expect(metaFor({ key: "pricing", ...ROUTE_META.pricing }).type).toBe("article");
    expect(metaFor({ key: "docs", ...ROUTE_META.docs }).type).toBe("article");
  });

  it("selects website type for home pages", () => {
    expect(metaFor({ key: "home", ...ROUTE_META.home }).type).toBe("website");
    expect(metaFor({ key: "home-en", ...ROUTE_META["home-en"] }).type).toBe("website");
  });

  it("propagates locale", () => {
    expect(metaFor({ key: "home", ...ROUTE_META.home }).locale).toBe("zh_CN");
    expect(metaFor({ key: "pricing", ...ROUTE_META.pricing }).locale).toBe("en_US");
  });

  it("falls back to default og image when page has no image", () => {
    const m = metaFor({ key: "docs", ...ROUTE_META.docs });
    expect(m.image).toBeTruthy();
    expect(m.image).toContain("og-card");
  });
});

describe("ROUTE_META registry", () => {
  it("contains all 7 expected page keys", () => {
    const expected = ["home", "home-en", "pricing", "docs", "skills", "enterprise", "code-search"];
    for (const k of expected) {
      expect(ROUTE_META).toHaveProperty(k);
    }
  });

  it("every entry has non-empty title + description + locale", () => {
    for (const [key, meta] of Object.entries(ROUTE_META)) {
      expect(meta.title, key).toBeTruthy();
      expect(meta.description, key).toBeTruthy();
      expect(meta.locale, key).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    }
  });
});

describe("useDocumentHead()", () => {
  let originalTitle: string;

  beforeEach(() => {
    originalTitle = document.title;
    // Strip meta tags we will create between tests
    document.head.querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]').forEach((el) => el.remove());
  });

  afterEach(() => {
    document.title = originalTitle;
  });

  it("sets document.title from meta", () => {
    const m: DocumentHeadMeta = { title: "Test Title | X" };
    renderHook(() => useDocumentHead(m));
    expect(document.title).toBe("Test Title | X");
  });

  it("creates a description meta when missing", () => {
    const m: DocumentHeadMeta = { title: "T", description: "Hello desc" };
    renderHook(() => useDocumentHead(m));
    const el = document.head.querySelector('meta[name="description"]');
    expect(el?.getAttribute("content")).toBe("Hello desc");
  });

  it("updates an existing description meta rather than duplicating", () => {
    const initial = document.createElement("meta");
    initial.setAttribute("name", "description");
    initial.setAttribute("content", "OLD DESC");
    document.head.appendChild(initial);

    const m: DocumentHeadMeta = { title: "T", description: "NEW DESC" };
    renderHook(() => useDocumentHead(m));

    const all = document.head.querySelectorAll('meta[name="description"]');
    expect(all.length).toBe(1);
    expect(all[0].getAttribute("content")).toBe("NEW DESC");
  });

  it("creates og:* and twitter:* meta tags from the same registry", () => {
    const m: DocumentHeadMeta = {
      title: "Page",
      description: "Page desc",
      image: "/assets/og.png",
      type: "article",
      locale: "zh_CN",
    };
    renderHook(() => useDocumentHead(m));
    expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe("Page");
    expect(document.head.querySelector('meta[property="og:locale"]')?.getAttribute("content")).toBe("zh_CN");
    expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute("content")).toBe("article");
    expect(document.head.querySelector('meta[name="twitter:card"]')?.getAttribute("content")).toBe("summary_large_image");
  });

  it("switches to summary card when no image is provided", () => {
    const m: DocumentHeadMeta = { title: "No Image", description: "Desc" };
    renderHook(() => useDocumentHead(m));
    expect(document.head.querySelector('meta[name="twitter:card"]')?.getAttribute("content")).toBe("summary");
  });

  it("does not set image meta when image is empty", () => {
    const m: DocumentHeadMeta = { title: "No Img", description: "Desc", image: "" };
    renderHook(() => useDocumentHead(m));
    // og:image tag should not exist (never written)
    expect(document.head.querySelector('meta[property="og:image"]')).toBeNull();
  });

  it("re-runs on title change and updates document.title", () => {
    const { rerender } = renderHook(({ t }: { t: string }) =>
      useDocumentHead({ title: t })
    , { initialProps: { t: "First" } });
    expect(document.title).toBe("First");
    rerender({ t: "Second" });
    expect(document.title).toBe("Second");
  });
});
