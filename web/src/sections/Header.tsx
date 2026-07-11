export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-ink-60/10">
      <div className="max-w-container-desktop mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <img src="/assets/hero-blossom-icon.png" alt="Codex" className="h-6 w-6" />
            <span>Codex</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-ink-80">
            <a href="#surfaces" className="hover:text-ink">使用方式</a>
            <a href="#features" className="hover:text-ink">核心需求</a>
            <a href="#testimonials" className="hover:text-ink">真实反馈</a>
            <a href="#" className="hover:text-ink">文档</a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden md:block text-sm text-ink-80 hover:text-ink"
          >
            登录
          </a>
          <a
            href="#"
            className="text-sm bg-ink text-white px-4 py-2 rounded-full hover:bg-ink-12 transition"
          >
            开始使用
          </a>
        </div>
      </div>
    </header>
  );
}