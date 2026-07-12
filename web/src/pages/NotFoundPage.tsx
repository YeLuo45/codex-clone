import { Link } from "react-router-dom";
import { Header } from "../sections/Header";
import { useDocumentHead } from "../lib/useDocumentHead";

export function NotFoundPage({ onSearchOpen }: { onSearchOpen?: () => void } = {}) {
  useDocumentHead({
    title: "404 — 找不到页面",
    description: "您访问的页面不存在。返回首页继续浏览 Codex。",
    type: "article",
    locale: "zh_CN",
  });
  return (
    <>
      <Header onSearchOpen={onSearchOpen} />
      <main className="min-h-[60vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-md text-center">
          <div className="font-display text-8xl md:text-9xl font-bold text-ink-60/20 mb-2 select-none">
            404
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
            找不到这个页面
          </h1>
          <p className="text-ink-60 mb-2 leading-relaxed">
            您访问的链接可能已被移动、重命名，或者从未存在过。
          </p>
          <p className="text-sm text-ink-60/70 mb-8">
            您可以试试文档搜索，或者回到首页继续浏览。
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 bg-ink text-white text-sm font-medium rounded-full hover:bg-ink-12 transition"
            >
              返回首页
            </Link>
            <Link
              to="/docs"
              className="px-5 py-2.5 border border-ink/15 text-ink text-sm font-medium rounded-full hover:border-ink/30 transition"
            >
              查看文档
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
