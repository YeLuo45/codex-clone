import { useTranslation } from "react-i18next";

export function FinalCTA() {
  const { t } = useTranslation();
  return (
    <section className="bg-ink text-white">
      <div className="max-w-container-desktop mx-auto px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
            {t("cta.finalTitle")}
          </h2>
          <p className="text-base md:text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            {t("cta.finalDesc")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#"
              className="px-6 py-3 bg-white text-ink rounded-full text-sm font-medium hover:bg-white/90 transition"
            >
              {t("cta.finalStart")}
            </a>
            <a
              href="#"
              className="px-6 py-3 border border-white/30 text-white rounded-full text-sm font-medium hover:border-white/60 transition"
            >
              {t("cta.finalDocs")}
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <div className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <img src="/assets/hero-blossom-icon.png" alt="" className="h-4 w-4" />
              {t("brand")}
            </div>
            <ul className="space-y-2 text-xs text-white/60">
              <li><a href="#" className="hover:text-white">{t("footer.research")}</a></li>
              <li><a href="#" className="hover:text-white">{t("footer.news")}</a></li>
              <li><a href="#" className="hover:text-white">{t("footer.api")}</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white mb-4">{t("footer.productTitle")}</div>
            <ul className="space-y-2 text-xs text-white/60">
              <li><a href="#" className="hover:text-white">{t("footer.chatgpt")}</a></li>
              <li><a href="#" className="hover:text-white">{t("footer.codexIde")}</a></li>
              <li><a href="#" className="hover:text-white">{t("footer.codexCli")}</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white mb-4">{t("footer.companyTitle")}</div>
            <ul className="space-y-2 text-xs text-white/60">
              <li><a href="#" className="hover:text-white">{t("footer.about")}</a></li>
              <li><a href="#" className="hover:text-white">{t("footer.careers")}</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white mb-4">{t("footer.resourcesTitle")}</div>
            <ul className="space-y-2 text-xs text-white/60">
              <li><a href="#" className="hover:text-white">{t("footer.docsLink")}</a></li>
              <li><a href="#" className="hover:text-white">{t("footer.blog")}</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white mb-4">{t("footer.supportTitle")}</div>
            <ul className="space-y-2 text-xs text-white/60">
              <li><a href="#" className="hover:text-white">{t("footer.contact")}</a></li>
              <li><a href="#" className="hover:text-white">{t("footer.security")}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/40">
          <div>{t("footer.copyright")}</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60">{t("footer.terms")}</a>
            <a href="#" className="hover:text-white/60">{t("footer.privacy")}</a>
          </div>
        </div>
      </div>
    </section>
  );
}