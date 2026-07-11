const modes = [
  {
    title: "多种协作模式",
    desc: "一人多 Agent 协作、多人 + 多 Agent 协作，让 Agent 各司其职，团队高效同步上下文，与 Agent 同频工作。",
    icon: "👥",
  },
  {
    title: "多项目创建，专项管理",
    desc: "每个项目独立管理，数据隔离，独立沉淀。",
    icon: "📂",
  },
  {
    title: "项目资产沉淀",
    desc: "每个项目独立沉淀沉淀，让经验成为长期资产。",
    icon: "💎",
  },
];

export function CollaborationSection() {
  return (
    <section className="bg-cream-100 py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 max-w-2xl">
          人和 Agent，
          <br />
          共同协作
        </h2>
        <p className="mt-6 text-base text-ink-800/70 max-w-3xl leading-relaxed">
          一人或多人与多 Agent 协作，让 Agent 各司其职，团队高效同步上下文，与 Agent 同频工作。
        </p>

        <div className="mt-12 grid lg:grid-cols-[3fr_2fr] gap-6 items-stretch">
          {/* Left: feature list */}
          <div className="bg-white rounded-3xl border border-black/5 p-8 md:p-10">
            <div className="space-y-8">
              {modes.map((m) => (
                <div key={m.title} className="flex gap-4">
                  <div className="text-2xl shrink-0">{m.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink-900 mb-2">{m.title}</h3>
                    <p className="text-sm text-ink-800/70 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: illustration */}
          <div className="rounded-3xl overflow-hidden bg-cream-50 border border-black/5 flex items-center justify-center">
            <img
              src="/assets/collaboration-illustration.svg"
              alt="人和 Agent 协作"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}