const agents = [
  { name: "Claude Code", desc: "local / self-hosted", icon: "/assets/icon-claude-code.png" },
  { name: "Codex", desc: "local / self-hosted", icon: "/assets/icon-codex.svg" },
  { name: "Openclaw", desc: "local / self-hosted", icon: "/assets/icon-openclaw.svg" },
  { name: "扣子 Agent", desc: "行业专家级 Agent", icon: "/assets/icon-coze-agent.png" },
];

export function DefineAgentsSection() {
  return (
    <section className="bg-cream-200 py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 max-w-2xl">
          你的 Agent，
          <br />
          你来定义
        </h2>
        <p className="mt-6 text-base text-ink-800/70 max-w-3xl leading-relaxed">
          创建行业专家级 Agent，或将本地的 Claude Code、Codex CLI、Openclaw 等一键接入，协作无间。
        </p>

        <div className="mt-12 bg-white rounded-3xl border border-black/5 p-8 md:p-12">
          <div className="flex items-baseline justify-between gap-4 mb-8">
            <h3 className="text-xl font-semibold text-ink-900">你的阵容</h3>
            <span className="text-sm text-ink-800/60">打开扣子，就能添加、使用它们。</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {agents.map((a) => (
              <div
                key={a.name}
                className="bg-cream-50 rounded-2xl border border-black/5 p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-black/5 flex items-center justify-center mb-4 p-2">
                  <img src={a.icon} alt={a.name} className="w-full h-full object-contain" />
                </div>
                <div className="text-base font-semibold text-ink-900">{a.name}</div>
                <div className="text-xs text-ink-800/60 mt-1 font-mono">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}