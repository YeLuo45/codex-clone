export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-glow">
      <div className="max-w-container-desktop mx-auto px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 text-sm text-ink-60">
            <img src="/assets/hero-blossom-icon.png" alt="" className="h-4 w-4" />
            <span>ChatGPT 中的 Codex</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-ink mb-6">
            Codex
          </h1>

          <p className="text-xl md:text-2xl text-ink-80 leading-snug mb-6 font-display">
            使用智能体进行构建的最佳方式
          </p>

          <p className="text-base md:text-lg text-ink-60 leading-relaxed max-w-2xl mx-auto">
            同一款强大的编程智能体 — 现已入驻 ChatGPT。从常规的 Pull Request
            到最具挑战的核心难题，Codex 都能为你提供端到端的任务支持。
            依托 OpenAI 的前沿编码大模型，Codex 能够胜任功能开发、复杂重构及代码迁移等多项任务。
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="#"
              className="px-6 py-3 bg-ink text-white rounded-full text-sm font-medium hover:bg-ink-12 transition"
            >
              立即开始
            </a>
            <a
              href="#"
              className="px-6 py-3 border border-ink/15 text-ink rounded-full text-sm font-medium hover:border-ink/30 transition"
            >
              查看文档
            </a>
          </div>
        </div>

        {/* Hero visual */}
        <div className="mt-16 md:mt-20 relative">
          <div className="bg-gradient-to-br from-background-cream to-white rounded-3xl border border-ink-60/10 aspect-[16/9] flex items-center justify-center overflow-hidden">
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4">
                <img src="/assets/hero-blossom-icon.png" alt="Codex" className="w-12 h-12" />
              </div>
              <p className="text-sm text-ink-60">Codex 产品演示</p>
              <p className="text-xs text-ink-60/70 mt-1">（视频嵌入位置）</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}