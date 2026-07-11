const testimonials = [
  {
    quote:
      "在 Wonderful，对于需要深度推理和理解的核心技术及架构工作，Codex CLI 已经完全取代了所有其他智能体框架。",
    author: "Daniel Sikorskiy",
    role: "Wonderful 首席架构师",
  },
  {
    quote:
      "在 Harvey，Codex 彻底改变了我们的开发模式。它将早期迭代时间缩短了 30% 到 50%，让工程师能腾出精力，专注于系统设计和具有高杠杆效应的决策。",
    author: "Joey Wang",
    role: "Harvey 移动端负责人",
  },
  {
    quote:
      "有了 Codex，我们能在一个周末完成以往需要一个季度才能交付的工作。我们现在能够承接更多过去无法实现的项目，它已成为我们不可或缺的利器。",
    author: "Tess Rosania",
    role: "Sierra 软件工程师",
  },
  {
    quote:
      "近期发布的 Codex 版本带来了质的飞跃。Codex 的 PR 审查能发现团队容易忽略的漏洞，让我们在交付代码时更有底气。现在，我们正将 CLI 和桌面应用深度融入到更多工作流中 — 每一次版本更迭都在树立新的行业标杆。",
    author: "Austin Ray",
    role: "Ramp AI 开发者体验团队负责人",
  },
  {
    quote:
      "Codex 在我们的后端 Python 代码审查基准测试中表现最佳。它是唯一能发现棘手的向后兼容性问题的工具，并且能始终如一地找出其他机器人遗漏的核心漏洞。",
    author: "Aaron Wang",
    role: "Duolingo 高级软件工程师",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-background-cream py-20 md:py-28">
      <div className="max-w-container-desktop mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-ink leading-tight mb-4">
            开发者的真实反馈
          </h2>
          <p className="text-base text-ink-60 leading-relaxed">
            各行业一线团队的工程负责人如何评价 Codex。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="bg-white rounded-2xl border border-ink-60/10 p-8 flex flex-col"
            >
              <blockquote className="text-base text-ink-80 leading-relaxed flex-1 mb-6">
                "{t.quote}"
              </blockquote>
              <figcaption>
                <div className="text-sm font-semibold text-ink">{t.author}</div>
                <div className="text-xs text-ink-60 mt-0.5">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}