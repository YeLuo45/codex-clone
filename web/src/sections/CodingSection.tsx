const features = [
  {
    title: "云端沙箱环境",
    desc: "专为 AI Agent 打造的云端开发环境，内置文件系统与终端。",
  },
  {
    title: "集成资源一站配齐",
    desc: "数据库、对象存储、AI 模型 API 等基础设施按需取用。",
  },
  {
    title: "模型API按需取用",
    desc: "支持多种主流大模型 API，按需选择，灵活组合。",
  },
];

export function CodingSection() {
  return (
    <section className="bg-cream-100 py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 max-w-2xl">
          扣子编程，
          <br />
          一站式从开发到上线
        </h2>
        <p className="mt-6 text-base text-ink-800/70 max-w-3xl leading-relaxed">
          你的 AI 开发伙伴，提供强大的 Vibe Coding 基础设施。通过自然语言对话，开发小程序、App、
          网页应用、智能体、工作流、技能 Skill，支持一键部署上线。
        </p>

        <div className="mt-12 grid md:grid-cols-[3fr_2fr] gap-6">
          {/* Video card (dark) */}
          <div className="bg-ink-700 rounded-3xl aspect-[16/10] flex items-center justify-center relative overflow-hidden">
            <video
              src="/assets/coze-coding-intro-720p.mp4"
              poster="/assets/coze-coding-intro-poster.jpg"
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>

          {/* Feature list */}
          <div className="bg-white rounded-3xl border border-black/5 p-8">
            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={f.title} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-ink-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
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
        </div>
      </div>
    </section>
  );
}