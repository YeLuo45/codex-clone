import { useEffect } from "react";

export interface DocumentHeadMeta {
  title: string;
  description?: string;
  /** OG card image absolute or relative URL */
  image?: string;
  /** OG type: website (default) | article | product */
  type?: string;
  /** Locale string e.g. "zh_CN" or "en_US" */
  locale?: string;
}

/**
 * Lightweight per-route <head> manager.
 * - Sets document.title and lang attribute
 * - Updates (creates if missing) <meta name="description">, og:title, og:description,
 *   og:image, og:type, og:locale, twitter:card
 *
 * Designed for a static SPA with HashRouter — no router integration required.
 * Pass `meta.title` always; everything else optional.
 *
 * No external "react-helmet" dep — keeps the bundle small.
 */
export function useDocumentHead(meta: DocumentHeadMeta) {
  useEffect(() => {
    document.title = meta.title;

    const setMeta = (attr: "name" | "property", key: string, content?: string) => {
      if (!content) return;
      let el = document.head.querySelector<HTMLMetaElement>(
        `meta[${attr}="${key}"]`
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", meta.description);
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:image", meta.image);
    setMeta("property", "og:type", meta.type ?? "website");
    setMeta("property", "og:locale", meta.locale);
    setMeta("name", "twitter:card", meta.image ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);
    setMeta("name", "twitter:image", meta.image);
  }, [meta.title, meta.description, meta.image, meta.type, meta.locale]);
}
