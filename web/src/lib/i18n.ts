// i18n configuration — pragmatic subset
// Only common UI strings (Header, FinalCTA footer, SearchModal) are translated here.
// Page content (hero copy, testimonials, pricing tables) stays per-page since it's
// content rather than UI strings and would explode the bundle if duplicated.

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      brand: "Codex",
      nav: {
        surfaces: "Surfaces",
        features: "Features",
        testimonials: "Testimonials",
        search: "Search",
        skills: "Skills",
        docs: "Docs",
        pricing: "Pricing",
        enterprise: "Enterprise",
        login: "Log in",
        getStarted: "Get started",
        switchToChinese: "中文",
        switchToEnglish: "EN",
      },
      search: {
        placeholder: "Search Codex docs…",
        empty: "Try searching for:",
        noResults: 'No results for',
        navigate: "navigate",
        open: "open",
        close: "to close",
        suggestions: ["agent skills", "GPT-5.5", "CLI", "code review", "pricing"],
      },
      cta: {
        finalTitle: "Get started with Codex",
        finalDesc: "The same powerful coding agent — now in ChatGPT. From feature development to complex refactors to code migrations, Codex provides end-to-end support across your entire engineering lifecycle.",
        finalStart: "Get started",
        finalDocs: "Read the docs",
      },
      footer: {
        research: "Research",
        news: "News",
        api: "API",
        productTitle: "Product",
        chatgpt: "ChatGPT",
        codexIde: "Codex IDE",
        codexCli: "Codex CLI",
        companyTitle: "Company",
        about: "About",
        careers: "Careers",
        resourcesTitle: "Resources",
        docsLink: "Docs",
        blog: "Blog",
        supportTitle: "Support",
        contact: "Contact",
        security: "Security",
        copyright: "© 2025 OpenAI Clone — for educational purposes only",
        privacy: "Privacy",
        terms: "Terms",
      },
    },
  },
  zh: {
    translation: {
      brand: "Codex",
      nav: {
        surfaces: "使用方式",
        features: "核心需求",
        testimonials: "真实反馈",
        search: "搜索",
        skills: "技能",
        docs: "文档",
        pricing: "定价",
        enterprise: "企业版",
        login: "登录",
        getStarted: "开始使用",
        switchToChinese: "中文",
        switchToEnglish: "EN",
      },
      search: {
        placeholder: "搜索 Codex 文档…",
        empty: "试试搜索：",
        noResults: "未找到匹配结果",
        navigate: "浏览",
        open: "打开",
        close: "关闭",
        suggestions: ["agent skills", "GPT-5.5", "CLI", "代码审查", "定价"],
      },
      cta: {
        finalTitle: "开始使用 Codex",
        finalDesc: "同一款强大的编程智能体，已入驻 ChatGPT。从功能开发、复杂重构到代码迁移，Codex 在你的整个工程生命周期中提供端到端的支持。",
        finalStart: "立即开始",
        finalDocs: "查看文档",
      },
      footer: {
        research: "研究",
        news: "新闻",
        api: "API",
        productTitle: "产品",
        chatgpt: "ChatGPT",
        codexIde: "Codex IDE",
        codexCli: "Codex CLI",
        companyTitle: "公司",
        about: "关于我们",
        careers: "招贤纳士",
        resourcesTitle: "资源",
        docsLink: "文档",
        blog: "博客",
        supportTitle: "支持",
        contact: "联系",
        security: "安全",
        copyright: "© 2025 OpenAI Clone · 仅供学习研究",
        privacy: "隐私政策",
        terms: "服务条款",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "zh", // Default to Chinese
  fallbackLng: "zh",
  interpolation: { escapeValue: false },
});

export default i18n;
export type Lang = "en" | "zh";