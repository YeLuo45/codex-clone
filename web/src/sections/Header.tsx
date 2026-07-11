import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith("/en");

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-ink-60/10">
      <div className="max-w-container-desktop mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to={isEnglish ? "/en" : "/"} className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <img src="/assets/hero-blossom-icon.png" alt="Codex" className="h-6 w-6" />
            <span>Codex</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-ink-80">
            {!isEnglish && (
              <>
                <Link to="/#surfaces" className="hover:text-ink">使用方式</Link>
                <Link to="/#features" className="hover:text-ink">核心需求</Link>
                <Link to="/#testimonials" className="hover:text-ink">真实反馈</Link>
              </>
            )}
            {isEnglish && (
              <>
                <Link to="/en#surfaces" className="hover:text-ink">Surfaces</Link>
                <Link to="/en#features" className="hover:text-ink">Features</Link>
                <Link to="/en#testimonials" className="hover:text-ink">Testimonials</Link>
              </>
            )}
            <Link to="/pricing" className={`hover:text-ink ${location.pathname === "/pricing" ? "text-ink font-medium" : ""}`}>
              Pricing
            </Link>
            <Link to="/docs" className={`hover:text-ink ${location.pathname === "/docs" ? "text-ink font-medium" : ""}`}>
              Docs
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={isEnglish ? "/" : "/en"}
            className="hidden md:block text-sm text-ink-60 hover:text-ink"
          >
            {isEnglish ? "中文" : "EN"}
          </Link>
          <a
            href="#"
            className="text-sm bg-ink text-white px-4 py-2 rounded-full hover:bg-ink-12 transition"
          >
            {isEnglish ? "Get started" : "开始使用"}
          </a>
        </div>
      </div>
    </header>
  );
}