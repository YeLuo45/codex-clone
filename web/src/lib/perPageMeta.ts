import type { DocumentHeadMeta } from "./useDocumentHead";

const SITE_NAME = "Codex";
// Default OG/Twitter card image. SVG is the master: 1200x630 viewBox, Codex
// blossom mark, bilingual title + subtitle, gradients. Modern social
// platforms (Twitter, Slack, Mastodon, Discord) render SVG OG images;
// legacy scrapers fall back to favicon. To ship a raster, render og-card.svg
// to og-card.png via scripts/og-card-from-svg.mjs (D12 helper).
const HERO_IMAGE = "./assets/og-card.svg";

interface PageMetaInput {
  /** Page key — also used to build the canonical-ish id */
  key: "home" | "home-en" | "pricing" | "docs" | "skills" | "enterprise" | "code-search";
  title: string;
  description: string;
  image?: string;
  locale: string;
}

/**
 * Per-route metadata registry.
 *
 * Each page calls `useDocumentHead(metaFor(key))` so that crawlers / link
 * previews have meaningful <title>, description, OG and Twitter card data.
 */
export function metaFor(input: PageMetaInput): DocumentHeadMeta {
  return {
    title: `${input.title} | ${SITE_NAME}`,
    description: input.description,
    image: input.image ?? HERO_IMAGE,
    type: input.key === "home" || input.key === "home-en" ? "website" : "article",
    locale: input.locale,
  };
}

export const ROUTE_META: Record<PageMetaInput["key"], Omit<PageMetaInput, "key">> = {
  home: {
    title: "面向软件工程的 AI 编程智能体",
    description:
      "Codex — 同一款强大的编程智能体，现已入驻 ChatGPT，支持功能开发、复杂重构及代码迁移等多项任务。",
    locale: "zh_CN",
  },
  "home-en": {
    title: "Codex — A coding agent for software engineering",
    description:
      "The same powerful coding agent, now in ChatGPT. From feature development to complex refactors, Codex supports the entire engineering lifecycle.",
    locale: "en_US",
  },
  pricing: {
    title: "API Pricing",
    description:
      "Simple, transparent pricing for every Codex model. Flagship, Mini, Realtime, Image and tool pricing — pay only for what you use.",
    locale: "en_US",
  },
  docs: {
    title: "Documentation",
    description:
      "Codex 文档 — CLI 入门、IDE 扩展、API 参考、Skills 与最佳实践。",
    locale: "zh_CN",
  },
  skills: {
    title: "Agent Skills",
    description:
      "可复用的 Agent Skills — 让 Codex 学会团队的编码规范、PR 流程和测试约定。",
    locale: "zh_CN",
  },
  enterprise: {
    title: "Enterprise",
    description:
      "面向团队的 Codex 企业方案 — 私有部署、SSO、审计日志与组织级质量基线。",
    locale: "zh_CN",
  },
  "code-search": {
    title: "Code Search",
    description:
      "跨代码仓库的语义搜索 — 用自然语言定位函数、文件与上下文。",
    locale: "zh_CN",
  },
};
