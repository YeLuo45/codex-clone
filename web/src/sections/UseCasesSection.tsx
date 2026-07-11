const useCases = [
  { tag: "职场", title: "调研多个 Agent 能力", desc: "调度多个 Agent 能力完成内容，效率大幅提升。" },
  { tag: "客服与销售", title: "复刻任务深度执行", desc: "自动化执行指定重复任务，效率大幅提升。" },
  { tag: "其他", title: "CLI 与 MCP 集成", desc: "一键安装多个 Agent，可扩展性大幅提升。" },
  { tag: "更多", title: "一键安装客户端", desc: "支持多种平台一键安装，无需复杂配置即可上手。" },
  { tag: "编程", title: "代码托管与协作", desc: "支持 GitHub / GitLab 等代码托管平台直接接入，代码管理与协作一体化。" },
  { tag: "创意", title: "智能素材生成", desc: "AI 自动生成图片、视频、音频素材，覆盖创意全流程。" },
];

export function UseCasesSection() {
  return (
    <section className="bg-cream-100 py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 max-w-2xl">
          各场景各人群，
          <br />
          开启全新 Agent 体验
        </h2>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {useCases.map((u) => (
            <div
              key={u.title}
              className="bg-white rounded-2xl border border-black/5 p-7 hover:shadow-md transition-shadow"
            >
              <div className="text-xs text-ink-800/60 mb-3">{u.tag}</div>
              <h3 className="text-lg font-semibold text-ink-900 mb-3">{u.title}</h3>
              <p className="text-sm text-ink-800/70 leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}