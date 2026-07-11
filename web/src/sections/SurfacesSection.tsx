const surfaces = [
  {
    title: "ChatGPT 中的 Codex",
    desc: "智能体编程 (agentic coding) 的指挥中心。借助内置的工作树与云端环境，智能体能够在多个项目间并行工作，将原需数周的开发周期缩短至数天。",
    image: "/assets/surface-chatgpt-app.png",
  },
  {
    title: "Codex IDE 扩展",
    desc: "在你常用的 IDE 中直接调用 Codex，让代码补全、重构、PR 审查与你的编辑器无缝衔接。",
    image: "/assets/surface-ide-extension.png",
  },
  {
    title: "Codex CLI",
    desc: "在终端中与 Codex 对话，将智能体嵌入到脚本、CI/CD 与日常开发流。",
    image: "/assets/surface-cli.png",
  },
];

export function SurfacesSection() {
  return (
    <section id="surfaces" className="bg-background-cream py-20 md:py-28">
      <div className="max-w-container-desktop mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-ink leading-tight mb-4">
            在各个编码场景中
            <br />
            使用同一智能体
          </h2>
          <p className="text-base text-ink-60 leading-relaxed">
            跨越 ChatGPT、编辑器与终端，你都能无缝使用 Codex，
            所有体验由你的 ChatGPT 账号统一连接。
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {surfaces.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-2xl border border-ink-60/10 overflow-hidden card-hover"
            >
              <div className="aspect-[4/3] bg-ink-60/5 overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-ink-60 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}