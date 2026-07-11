const features = [
  {
    title: "专为多智能体工作流而设计",
    desc: "ChatGPT 中的 Codex 是智能体编程 (agentic coding) 的指挥中心。借助内置的工作树与云端环境，智能体能够在多个项目间并行工作，将原需数周的开发周期缩短至数天。",
    image: "/assets/feature-built.png",
  },
  {
    title: "适应贵团队的构建方式",
    desc: '借助"技能 (Skill)"功能，你可以让 Codex 理解团队的标准、工作流程和工作方式。Codex 会在各项任务中始终如一地应用这些规范，从而能在减少人工监督的情况下更高效地输出成果。',
    image: "/assets/feature-designed.png",
  },
  {
    title: "为长时间后台工作而设计",
    desc: "安排 Codex 接手诸如工单或问题分发 (issue triage)、告警监控、CI/CD 等繁琐但关键的日常工作，让你的团队能够专心投入到核心开发中。",
    image: "/assets/feature-adapts.png",
  },
  {
    title: "全面提升团队的质量标准",
    desc: "Codex 通过严谨的设计、全面的测试与高质量的代码审查提升整体工程水准，从源头化解风险，确保团队稳健交付。",
    image: "/assets/feature-raise-bar.png",
  },
  {
    title: "为实际工程任务的核心需求而打造",
    desc: "Codex 专为真实软件工程场景设计 — 从代码评审到架构决策，每一项输出都基于深度推理与全栈代码库上下文。",
    image: "/assets/feature-made-for.png",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20 md:py-28">
      <div className="max-w-container-desktop mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-ink leading-tight mb-4">
            为实际工程任务的核心需求
            <br />
            而打造
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-background-cream/50 rounded-2xl border border-ink-60/8 overflow-hidden card-hover"
            >
              <div className="aspect-[4/3] bg-white overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-semibold text-ink mb-3">{f.title}</h3>
                <p className="text-sm text-ink-60 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}