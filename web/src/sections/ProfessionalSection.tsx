const features = [
  {
    title: "模型自由切换",
    desc: "Doubao-Seed / Kimi / GLM / MiniMax，新国产模型 × 主流开源模型，按场景自由调度。",
  },
  {
    title: "完整 Harness 能力",
    desc: "内置 shell、浏览器、文件、Skills、云手机/云电脑，全链路执行能力。",
  },
  {
    title: "越用越懂你",
    desc: "长期记忆 + 上下文持续积累，越用越懂你的偏好与节奏。",
  },
];

export function ProfessionalSection() {
  return (
    <section className="bg-cream-100 py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 max-w-2xl">
          专业伙伴，
          <br />
          开箱即用
        </h2>
        <p className="mt-6 text-base text-ink-800/70 max-w-3xl leading-relaxed">
          扣子 Agent 持续满配在线，拥有云手机/云电脑，长期记忆越用越懂你，持续自主推进任务；
          从开发到上线，在编程项目中轻松完成；从灵感到成片，在视频项目中尽情创作。
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {/* Left: feature list */}
          <div className="bg-white rounded-3xl border border-black/5 p-8">
            <div className="flex items-baseline justify-between mb-8">
              <h3 className="text-xl font-semibold text-ink-900">扣子 Agent</h3>
              <span className="text-xs text-ink-800/60">满配在线</span>
            </div>
            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={f.title} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-base font-medium text-ink-900">{f.title}</div>
                    <p className="text-sm text-ink-800/70 mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: feature highlight card with diagonal stripes + illustration */}
          <div className="bg-stripes-yellow rounded-3xl relative overflow-hidden flex flex-col justify-between p-10 min-h-[480px]">
            <div className="relative z-10">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-ink-900 mb-4">
                让 Agent 成为
                <br />
                你的工作日常
              </h3>
              <p className="text-sm text-ink-900/80 leading-relaxed">
                无需复杂的脚本编写，让复杂任务无缝串联。
                投入产品策划，方案独立产出能力。
              </p>
            </div>
            <div className="relative z-10 mt-6">
              <img
                src="/assets/agent-daily-illustration.png"
                alt="Agent daily"
                className="w-full max-w-md mx-auto mix-blend-multiply"
              />
            </div>
            <div className="relative z-10 mt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-ink-900">
                立即试用
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}