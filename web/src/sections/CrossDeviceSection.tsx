const features = [
  {
    title: "本地文件处理",
    desc: "本地文件统一管理，让本地文件可被 Agent 直接访问、调用并处理。",
  },
  {
    title: "跨端协同 无缝衔接",
    desc: "跨端协同桌面与移动，让 Agent 在跨端间无缝衔接。",
  },
  {
    title: "复杂任务便捷完成",
    desc: "桌面端处理复杂任务与长任务，让长期任务执行效率大幅提升。",
  },
];

export function CrossDeviceSection() {
  return (
    <section className="bg-cream-200 py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 max-w-2xl">
          跨端接力，
          <br />
          持续推进
        </h2>
        <p className="mt-6 text-base text-ink-800/70 max-w-3xl leading-relaxed">
          桌面端处理任务，移动端快速同步、跨端协同完成任务，任务随时随地无缝推进。
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {/* Desktop card */}
          <div className="bg-white rounded-3xl border border-black/5 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-7 border-2 border-ink-900/30 rounded-sm relative">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-ink-900/30 rounded-b" />
              </div>
              <span className="text-base font-medium text-ink-900">桌面端</span>
            </div>
            <p className="text-sm text-ink-800/70 mb-6 leading-relaxed">
              本地文件统一管理，让本地文件可被 Agent 直接访问。
            </p>
            <div className="space-y-5">
              <div>
                <div className="text-sm font-medium text-ink-900">本地文件处理</div>
                <p className="text-xs text-ink-800/60 mt-1">本地文件统一管理，让 Agent 可访问、调用并处理。</p>
              </div>
              <div>
                <div className="text-sm font-medium text-ink-900">跨端协同 无缝衔接</div>
                <p className="text-xs text-ink-800/60 mt-1">跨端协同桌面与移动，Agent 跨端间无缝衔接。</p>
              </div>
            </div>
          </div>

          {/* Mobile card */}
          <div className="bg-white rounded-3xl border border-black/5 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-10 border-2 border-ink-900/30 rounded-md" />
              <span className="text-base font-medium text-ink-900">移动端</span>
            </div>
            <p className="text-sm text-ink-800/70 mb-6 leading-relaxed">
              移动端快速同步任务状态，下班后查看进度，任务随时随地推进。
            </p>
            <div className="space-y-5">
              <div>
                <div className="text-sm font-medium text-ink-900">全新多人多 Agent 协作</div>
                <p className="text-xs text-ink-800/60 mt-1">全新多人多 Agent 协作，跨设备任务执行。</p>
              </div>
              <div>
                <div className="text-sm font-medium text-ink-900">复杂任务便捷完成</div>
                <p className="text-xs text-ink-800/60 mt-1">桌面端处理复杂任务与长任务，让 Agent 跨设备执行。</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#download-desktop"
                className="px-5 py-2.5 bg-ink-900 text-white rounded-full text-xs font-medium"
              >
                桌面端下载
              </a>
              <a
                href="#download-mobile"
                className="px-5 py-2.5 bg-cream-200 text-ink-900 rounded-full text-xs font-medium"
              >
                移动端下载
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}