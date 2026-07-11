export function FinalCTA() {
  return (
    <section className="bg-ink text-white">
      <div className="max-w-container-desktop mx-auto px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
            开始使用 Codex
          </h2>
          <p className="text-base md:text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            同一款强大的编程智能体，已入驻 ChatGPT。
            从功能开发、复杂重构到代码迁移，Codex 在你的整个工程生命周期中提供端到端的支持。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#"
              className="px-6 py-3 bg-white text-ink rounded-full text-sm font-medium hover:bg-white/90 transition"
            >
              立即开始
            </a>
            <a
              href="#"
              className="px-6 py-3 border border-white/30 text-white rounded-full text-sm font-medium hover:border-white/60 transition"
            >
              查看文档
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <div className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <img src="/assets/hero-blossom-icon.png" alt="" className="h-4 w-4" />
              Codex
            </div>
            <ul className="space-y-2 text-xs text-white/60">
              <li><a href="#" className="hover:text-white">研究</a></li>
              <li><a href="#" className="hover:text-white">新闻</a></li>
              <li><a href="#" className="hover:text-white">API</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white mb-4">产品</div>
            <ul className="space-y-2 text-xs text-white/60">
              <li><a href="#" className="hover:text-white">ChatGPT</a></li>
              <li><a href="#" className="hover:text-white">Codex IDE</a></li>
              <li><a href="#" className="hover:text-white">Codex CLI</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white mb-4">公司</div>
            <ul className="space-y-2 text-xs text-white/60">
              <li><a href="#" className="hover:text-white">关于我们</a></li>
              <li><a href="#" className="hover:text-white">招贤纳士</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white mb-4">资源</div>
            <ul className="space-y-2 text-xs text-white/60">
              <li><a href="#" className="hover:text-white">文档</a></li>
              <li><a href="#" className="hover:text-white">博客</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white mb-4">支持</div>
            <ul className="space-y-2 text-xs text-white/60">
              <li><a href="#" className="hover:text-white">联系</a></li>
              <li><a href="#" className="hover:text-white">安全</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/40">
          <div>© 2025 OpenAI Clone · 仅供学习研究</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60">服务条款</a>
            <a href="#" className="hover:text-white/60">隐私政策</a>
          </div>
        </div>
      </div>
    </section>
  );
}