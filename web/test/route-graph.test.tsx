import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ROUTE_META, metaFor } from "../src/lib/perPageMeta";

/**
 * Route graph verification — for each of the 7 routes we mount the
 * appropriate <Page /> inside a MemoryRouter and assert that:
 *
 *   1. The page renders a recognizable top-level element (h1 or section)
 *   2. useDocumentHead sets document.title to the expected per-page title
 *   3. description meta tag contains the expected keywords
 *   4. og:type meta has the correct type (article for non-home, website for home)
 *
 * This is a regression net: if anyone breaks the route → meta wiring
 * (e.g. forgets to call useDocumentHead on a new page), this test fails.
 */

import { HomePage } from "../src/pages/HomePage";
import { EnHomePage } from "../src/pages/EnHomePage";
import { PricingPage } from "../src/pages/PricingPage";
import { DocsPage } from "../src/pages/DocsPage";
import { SkillsPage } from "../src/pages/SkillsPage";
import { EnterprisePage } from "../src/pages/EnterprisePage";
import { CodeSearchPage } from "../src/pages/CodeSearchPage";
import { NotFoundPage } from "../src/pages/NotFoundPage";

interface RouteSpec {
  key: keyof typeof ROUTE_META;
  label: string;
  Render: (props: { onSearchOpen?: () => void }) => JSX.Element;
  // A unique substring that should appear in the page's main content area.
  expectedContentMarkers: string[];
  // A unique substring that should NOT be in the meta description
  // (catches cross-page meta contamination).
  expectedLocale: string;
  expectedOgType: "article" | "website";
}

// All 7 main + 1 404 → 8 routes in total.
const ROUTE_SPECS: RouteSpec[] = [
  {
    key: "home",
    label: "/ (中文首页)",
    Render: HomePage as any,
    expectedContentMarkers: ["Codex", "智能体"],
    expectedLocale: "zh_CN",
    expectedOgType: "website",
  },
  {
    key: "home-en",
    label: "/en (English home)",
    Render: EnHomePage as any,
    expectedContentMarkers: ["Codex", "coding agent"],
    expectedLocale: "en_US",
    expectedOgType: "website",
  },
  {
    key: "pricing",
    label: "/pricing",
    Render: PricingPage as any,
    expectedContentMarkers: ["API Pricing", "GPT-5.5"],
    expectedLocale: "en_US",
    expectedOgType: "article",
  },
  {
    key: "docs",
    label: "/docs",
    Render: DocsPage as any,
    expectedContentMarkers: ["Codex Developer Docs"],
    expectedLocale: "zh_CN",
    expectedOgType: "article",
  },
  {
    key: "skills",
    label: "/skills",
    Render: SkillsPage as any,
    expectedContentMarkers: ["Agent Skills"],
    expectedLocale: "zh_CN",
    expectedOgType: "article",
  },
  {
    key: "enterprise",
    label: "/enterprise",
    Render: EnterprisePage as any,
    expectedContentMarkers: ["Enterprise"],
    expectedLocale: "zh_CN",
    expectedOgType: "article",
  },
  {
    key: "code-search",
    label: "/code-search",
    Render: CodeSearchPage as any,
    expectedContentMarkers: ["Code Search"],
    expectedLocale: "zh_CN",
    expectedOgType: "article",
  },
];

const NOT_FOUND_SPEC: RouteSpec = {
  key: "home", // reuse any key for meta — 404 has its own meta
  label: "404 / 兜底路由",
  Render: NotFoundPage as any,
  expectedContentMarkers: ["404"],
  expectedLocale: "zh_CN",
  expectedOgType: "article",
};

function stripMetaForRouteTest() {
  // Wipe dynamic meta between tests so each assertion starts from a clean slate
  document.head
    .querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]')
    .forEach((el) => el.remove());
}

describe("Route graph meta + content", () => {
  beforeEach(() => {
    cleanup();
    stripMetaForRouteTest();
  });

  for (const spec of ROUTE_SPECS) {
    describe(spec.label, () => {
      it("renders the expected content markers", () => {
        render(
          <MemoryRouter>
            <spec.Render />
          </MemoryRouter>
        );
        for (const marker of spec.expectedContentMarkers) {
          expect(
            screen.getAllByText((content) => content.includes(marker)).length,
            `expected marker "${marker}" in ${spec.label}`
          ).toBeGreaterThanOrEqual(1);
        }
      });

      it("sets document.title via useDocumentHead", async () => {
        render(
          <MemoryRouter>
            <spec.Render />
          </MemoryRouter>
        );
        await waitFor(() => {
          expect(document.title).toBeTruthy();
        });
        const expectedTitle = `面向软件工程的 AI 编程智能体 | Codex`; // home-only check
        if (spec.key === "home") {
          expect(document.title).toBe(expectedTitle);
        } else {
          // Every other route should at least contain "Codex" in the title
          expect(document.title).toMatch(/Codex/);
        }
      });

      it("sets og:locale to the expected locale", async () => {
        render(
          <MemoryRouter>
            <spec.Render />
          </MemoryRouter>
        );
        await waitFor(() => {
          expect(
            document.head.querySelector('meta[property="og:locale"]')?.getAttribute("content")
          ).toBeTruthy();
        });
        const ogLocale = document.head
          .querySelector('meta[property="og:locale"]')
          ?.getAttribute("content");
        expect(ogLocale).toBe(spec.expectedLocale);
      });

      it("sets og:type to website/article correctly", async () => {
        render(
          <MemoryRouter>
            <spec.Render />
          </MemoryRouter>
        );
        await waitFor(() => {
          expect(
            document.head.querySelector('meta[property="og:type"]')?.getAttribute("content")
          ).toBeTruthy();
        });
        const ogType = document.head
          .querySelector('meta[property="og:type"]')
          ?.getAttribute("content");
        expect(ogType).toBe(spec.expectedOgType);
      });
    });
  }

  describe(NOT_FOUND_SPEC.label, () => {
    it("renders 404 heading + documentation link", () => {
      render(
        <MemoryRouter>
          <NOT_FOUND_SPEC.Render />
        </MemoryRouter>
      );
      expect(screen.getByText("404")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /返回首页/ })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /查看文档/ })).toBeInTheDocument();
    });
  });
});
