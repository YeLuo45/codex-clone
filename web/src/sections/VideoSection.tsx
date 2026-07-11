const features = [
  {
    title: "全流程打通",
    desc: "内置 Seedance 2.0 模型，从脚本、分镜到视频生成，支持导出剪映工程文件。",
    icon: "🎞️",
  },
  {
    title: "多人协作",
    desc: "支持多人协作完成视频项目，大幅提升视频创作与修改的密度。",
    icon: "👥",
  },
  {
    title: "资产共享",
    desc: "全项目文件（角色、道具、分镜、动效）由团队沉淀为长期资产。",
    icon: "📦",
  },
];

export function VideoSection() {
  return (
    <section className="bg-cream-100 py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 max-w-2xl">
          视频创作，
          <br />
          专业级从灵感到成片
        </h2>
        <p className="mt-6 text-base text-ink-800/70 max-w-3xl leading-relaxed">
          打通视频创作全流程。支持多人协作，团队内全项目文件共享，内置最新 Seedance 2.0 模型。
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-black/5 p-7 hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-5">{f.icon}</div>
              <h3 className="text-lg font-semibold text-ink-900 mb-3">{f.title}</h3>
              <p className="text-sm text-ink-800/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}