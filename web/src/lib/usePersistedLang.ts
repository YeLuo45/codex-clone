import { useEffect, useState, useCallback } from "react";
import i18n from "./i18n";

/** localStorage key for the user's preferred Codex language. */
export const LANG_STORAGE_KEY = "codex:lang";

export type Lang = "zh" | "en";

function readStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    return v === "zh" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

function writeStoredLang(lang: Lang | null) {
  try {
    if (lang === null) {
      localStorage.removeItem(LANG_STORAGE_KEY);
    } else {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
  } catch {
    /* swallow (e.g. SSR, private browsing quota) */
  }
}

/**
 * usePersistedLang — read/write the user's preferred language,
 * pinned in localStorage across reloads.
 *
 * Returns `[lang, setLang]`. The setter updates both i18n and the
 * localStorage entry.
 *
 * The first render uses `null` (hydrating), then a useEffect snaps
 * to the stored value to avoid hydration mismatch.
 */
export function usePersistedLang(): [Lang | null, (next: Lang) => void] {
  const [lang, setLangState] = useState<Lang | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = readStoredLang();
    if (stored) {
      setLangState(stored);
      // Sync i18n if it disagrees (e.g. /en route hard-coded zh initially)
      if (i18n.language !== stored) {
        void i18n.changeLanguage(stored);
      }
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    writeStoredLang(next);
    void i18n.changeLanguage(next);
  }, []);

  return [lang, setLang];
}

/** Read the persisted lang without React — useful for non-component code. */
export function getStoredLang(): Lang | null {
  return readStoredLang();
}

/** Set the persisted lang without React — useful for non-component code. */
export function setStoredLang(lang: Lang | null): void {
  writeStoredLang(lang);
}
