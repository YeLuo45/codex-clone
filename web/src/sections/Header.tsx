import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";
import { usePersistedLang } from "../lib/usePersistedLang";

interface HeaderProps {
  onSearchOpen?: () => void;
}

export function Header({ onSearchOpen }: HeaderProps = {}) {
  const { t, i18n: i18nInstance } = useTranslation();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith("/en");

  // Sync i18n language with current route
  const currentLang = isEnglish ? "en" : "zh";

  // Persist lang across reloads
  const [, setStoredLang] = usePersistedLang();

  const toggleLanguage = () => {
    const next = currentLang === "en" ? "zh" : "en";
    i18n.changeLanguage(next);
    // Persist immediately
    setStoredLang(next);
    if (next === "zh" && location.pathname.startsWith("/en")) {
      window.location.hash = "#/";
    } else if (next === "en" && !location.pathname.startsWith("/en")) {
      window.location.hash = "#/en";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-ink-60/10">
      <div className="max-w-container-desktop mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to={isEnglish ? "/en" : "/"} className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <img src="/assets/hero-blossom-icon.png" alt="Codex" className="h-6 w-6" />
            <span>{t("brand")}</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-5 text-sm text-ink-80">
            {!isEnglish && (
              <>
                <Link to="/#surfaces" className="hover:text-ink">{t("nav.surfaces")}</Link>
                <Link to="/#features" className="hover:text-ink">{t("nav.features")}</Link>
                <Link to="/#testimonials" className="hover:text-ink">{t("nav.testimonials")}</Link>
              </>
            )}
            {isEnglish && (
              <>
                <Link to="/en#surfaces" className="hover:text-ink">{t("nav.surfaces")}</Link>
                <Link to="/en#features" className="hover:text-ink">{t("nav.features")}</Link>
                <Link to="/en#testimonials" className="hover:text-ink">{t("nav.testimonials")}</Link>
              </>
            )}
            <Link to="/code-search" className={`hover:text-ink ${location.pathname === "/code-search" ? "text-ink font-medium" : ""}`}>
              {t("nav.search")}
            </Link>
            <Link to="/skills" className={`hover:text-ink ${location.pathname === "/skills" ? "text-ink font-medium" : ""}`}>
              {t("nav.skills")}
            </Link>
            <Link to="/docs" className={`hover:text-ink ${location.pathname === "/docs" ? "text-ink font-medium" : ""}`}>
              {t("nav.docs")}
            </Link>
            <Link to="/pricing" className={`hover:text-ink ${location.pathname === "/pricing" ? "text-ink font-medium" : ""}`}>
              {t("nav.pricing")}
            </Link>
            <Link to="/enterprise" className={`hover:text-ink ${location.pathname === "/enterprise" ? "text-ink font-medium" : ""}`}>
              {t("nav.enterprise")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSearchOpen}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-60/5 hover:bg-ink-60/10 text-sm text-ink-60 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>{isEnglish ? "Search…" : "搜索…"}</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-white rounded text-ink-60 font-mono">⌘K</kbd>
          </button>
          <button
            onClick={toggleLanguage}
            className="hidden md:block text-sm text-ink-60 hover:text-ink"
          >
            {currentLang === "en" ? t("nav.switchToChinese") : t("nav.switchToEnglish")}
          </button>
          <a
            href="#"
            className="text-sm bg-ink text-white px-4 py-2 rounded-full hover:bg-ink-12 transition"
          >
            {t("nav.getStarted")}
          </a>
        </div>
      </div>
    </header>
  );
}