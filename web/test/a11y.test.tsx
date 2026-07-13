/**
 * D16 - axe-core a11y audit for the main rendered pages.
 *
 * Uses axe-core (the de-facto a11y engine) directly inside jsdom via
 * vitest-axe. The renderer runs each route through HomePage/PricingPage/
 * etc. inside MemoryRouter, then runs axe.run() against the rendered DOM.
 *
 * Severity policy:
 *   - critical / serious violations => fail
 *   - moderate / minor violations   => log + warn, but pass (still surfacing
 *     in test output so they're visible)
 *
 * The test is intentionally lenient on the moderate/minor tiers because
 * this is a static SPA clone and small issues (e.g. color contrast on a
 * third-party font) are not worth a red CI gate. Critical/serious issues
 * (missing alt, missing form labels, no main landmark, etc) MUST be zero.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axe from "axe-core";

import "../src/lib/i18n";

import { HomePage } from "../src/pages/HomePage";
import { PricingPage } from "../src/pages/PricingPage";
import { DocsPage } from "../src/pages/DocsPage";
import { SkillsPage } from "../src/pages/SkillsPage";
import { EnHomePage } from "../src/pages/EnHomePage";
import { EnterprisePage } from "../src/pages/EnterprisePage";
import { CodeSearchPage } from "../src/pages/CodeSearchPage";
import { NotFoundPage } from "../src/pages/NotFoundPage";

// jsdom lacks scrollTo, IntersectionObserver, etc. Stub them once for all tests.
beforeAll(() => {
  const w = globalThis as unknown as {
    window?: { scrollTo?: () => void };
    IntersectionObserver?: unknown;
  };
  if (w.window && !w.window.scrollTo) {
    w.window.scrollTo = () => {};
  }
  if (!w.IntersectionObserver) {
    w.IntersectionObserver = class {
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    };
  }
});

afterAll(() => {
  cleanup();
});

interface AxeResults {
  violations: Array<{
    id: string;
    impact: "minor" | "moderate" | "serious" | "critical" | null;
    description: string;
    nodes: Array<{ target: string[]; html: string }>;
  }>;
}

async function auditAt(path: string, node: React.ReactNode) {
  const { container } = render(
    <MemoryRouter initialEntries={[path]}>{node}</MemoryRouter>
  );
  // axe-core needs layout to be settled for color-contrast rules; jsdom
  // doesn't compute layout, so disable rules that require geometry.
  const results = (await axe.run(container, {
    rules: {
      "color-contrast": { enabled: false },
      "link-in-text-block": { enabled: false },
    },
  })) as AxeResults;

  const critical = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious"
  );
  const all = results.violations;

  return { critical, all, container };
}

function fmtViolations(violations: AxeResults["violations"]): string {
  return violations
    .map((v) => {
      const targets = v.nodes
        .slice(0, 3)
        .map((n) => n.target.join(" "))
        .join("\n      ");
      return `    - [${v.impact ?? "unknown"}] ${v.id}: ${v.description}\n      targets: ${targets}`;
    })
    .join("\n");
}

describe("D16 - axe-core a11y audit (critical + serious = 0)", () => {
  it("HomePage (/) has no critical or serious violations", async () => {
    const { critical, all } = await auditAt("/", <HomePage />);
    if (all.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`HomePage a11y (${all.length} total):\n${fmtViolations(all)}`);
    }
    expect(critical, `critical violations:\n${fmtViolations(critical)}`).toEqual([]);
  });

  it("EnHomePage (/en) has no critical or serious violations", async () => {
    const { critical, all } = await auditAt("/en", <EnHomePage />);
    if (all.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`EnHomePage a11y (${all.length} total):\n${fmtViolations(all)}`);
    }
    expect(critical, `critical violations:\n${fmtViolations(critical)}`).toEqual([]);
  });

  it("PricingPage (/pricing) has no critical or serious violations", async () => {
    const { critical, all } = await auditAt("/pricing", <PricingPage />);
    if (all.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`PricingPage a11y (${all.length} total):\n${fmtViolations(all)}`);
    }
    expect(critical, `critical violations:\n${fmtViolations(critical)}`).toEqual([]);
  });

  it("DocsPage (/docs) has no critical or serious violations", async () => {
    const { critical, all } = await auditAt("/docs", <DocsPage />);
    if (all.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`DocsPage a11y (${all.length} total):\n${fmtViolations(all)}`);
    }
    expect(critical, `critical violations:\n${fmtViolations(critical)}`).toEqual([]);
  });

  it("SkillsPage (/skills) has no critical or serious violations", async () => {
    const { critical, all } = await auditAt("/skills", <SkillsPage />);
    if (all.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`SkillsPage a11y (${all.length} total):\n${fmtViolations(all)}`);
    }
    expect(critical, `critical violations:\n${fmtViolations(critical)}`).toEqual([]);
  });

  it("EnterprisePage (/enterprise) has no critical or serious violations", async () => {
    const { critical, all } = await auditAt("/enterprise", <EnterprisePage />);
    if (all.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`EnterprisePage a11y (${all.length} total):\n${fmtViolations(all)}`);
    }
    expect(critical, `critical violations:\n${fmtViolations(critical)}`).toEqual([]);
  });

  it("CodeSearchPage (/code-search) has no critical or serious violations", async () => {
    const { critical, all } = await auditAt("/code-search", <CodeSearchPage />);
    if (all.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`CodeSearchPage a11y (${all.length} total):\n${fmtViolations(all)}`);
    }
    expect(critical, `critical violations:\n${fmtViolations(critical)}`).toEqual([]);
  });

  it("NotFoundPage has no critical or serious violations", async () => {
    const { critical, all } = await auditAt("/this-route-does-not-exist", <NotFoundPage />);
    if (all.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`NotFoundPage a11y (${all.length} total):\n${fmtViolations(all)}`);
    }
    expect(critical, `critical violations:\n${fmtViolations(critical)}`).toEqual([]);
  });
});

describe("D16 - axe-core a11y audit (specific rules)", () => {
  // Targeted checks for the rules most likely to break in a clone:
  //  - html-has-lang
  //  - landmark-one-main
  //  - region (all content inside landmarks)
  //  - page-has-heading-one (single H1 per page)
  //  - image-alt
  // These tests are cheap to run and pin specific a11y contracts.

  async function rulesAt(path: string, node: React.ReactNode, ruleIds: string[]) {
    const { container } = render(
      <MemoryRouter initialEntries={[path]}>{node}</MemoryRouter>
    );
    const results = (await axe.run(container, {
      runOnly: { type: "rule", values: ruleIds },
    })) as AxeResults;
    return results.violations;
  }

  it("all routes have a single h1", async () => {
    for (const [path, node] of [
      ["/", <HomePage key="h" />],
      ["/pricing", <PricingPage key="p" />],
      ["/docs", <DocsPage key="d" />],
      ["/skills", <SkillsPage key="s" />],
    ] as const) {
      const violations = await rulesAt(path, node, ["heading-order", "page-has-heading-one"]);
      expect(
        violations,
        `${path} heading violations: ${fmtViolations(violations)}`
      ).toEqual([]);
    }
  });

  it("all routes have a <main> landmark", async () => {
    for (const [path, node] of [
      ["/", <HomePage key="h" />],
      ["/pricing", <PricingPage key="p" />],
      ["/docs", <DocsPage key="d" />],
      ["/skills", <SkillsPage key="s" />],
      ["/enterprise", <EnterprisePage key="e" />],
      ["/code-search", <CodeSearchPage key="c" />],
    ] as const) {
      const violations = await rulesAt(path, node, ["landmark-one-main", "region"]);
      expect(
        violations,
        `${path} landmark violations: ${fmtViolations(violations)}`
      ).toEqual([]);
    }
  });

  it("all <img> tags have alt attributes", async () => {
    for (const [path, node] of [
      ["/", <HomePage key="h" />],
      ["/pricing", <PricingPage key="p" />],
      ["/docs", <DocsPage key="d" />],
    ] as const) {
      const violations = await rulesAt(path, node, ["image-alt"]);
      expect(
        violations,
        `${path} image-alt violations: ${fmtViolations(violations)}`
      ).toEqual([]);
    }
  });
});

// Reduce test noise: silence the stub-intersection-observer warning that
// React sometimes emits when an unmounted component still has observer refs.
vi.spyOn(console, "warn").mockImplementation(() => {});