import { useState } from "react";
import { Header } from "../sections/Header";
import { FinalCTA } from "../sections/FinalCTA";
import { useDocumentHead } from "../lib/useDocumentHead";
import { metaFor, ROUTE_META } from "../lib/perPageMeta";

const demoResults = [
  {
    file: "src/auth/session.ts",
    line: 42,
    match: "if (session.expiresAt < Date.now()) {",
    context: "Refresh expired sessions before returning",
    language: "typescript",
  },
  {
    file: "src/api/users.ts",
    line: 117,
    match: "async function getUserById(id: string) {",
    context: "Fetch user with role-based permissions",
    language: "typescript",
  },
  {
    file: "tests/auth.test.ts",
    line: 28,
    match: "test('session refresh on expiry', async () => {",
    context: "Validates session refresh logic",
    language: "typescript",
  },
];

const features = [
  { title: "Semantic understanding", desc: "Find code by intent, not just keywords. Search 'validate input' to find every place input validation happens." },
  { title: "Cross-repo index", desc: "Single search across your monorepo, with file path, owner, and last-modified metadata." },
  { title: "Symbol-aware", desc: "Find all references to a function, class, or type — across your codebase, not just within the same file." },
  { title: "Blazing fast", desc: "Indexes in seconds, queries in milliseconds. Incremental updates as you commit." },
];

export function CodeSearchPage({ onSearchOpen }: { onSearchOpen?: () => void } = {}) {
  const [query, setQuery] = useState("session refresh");
  const [results, setResults] = useState(demoResults);

  return (
    <>
      <Header onSearchOpen={onSearchOpen} />
      <main>
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-container-desktop mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 mb-4 text-sm text-ink-60">
                <img src="/assets/hero-blossom-icon.png" alt="" className="h-4 w-4" />
                <span>Code Search</span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-tight mb-6">
                Find any code,
                <br />
                in any repo
              </h1>
              <p className="text-lg text-ink-60 leading-relaxed">
                Semantic code search that understands intent. Find functions,
                references, and patterns across your entire codebase.
              </p>
            </div>

            {/* Search demo */}
            <div className="mb-20">
              <div className="bg-ink text-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-ink-60 shrink-0">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setResults(demoResults.filter((r) =>
                        r.match.toLowerCase().includes(e.target.value.toLowerCase()) ||
                        r.context.toLowerCase().includes(e.target.value.toLowerCase()) ||
                        r.file.toLowerCase().includes(e.target.value.toLowerCase())
                      ));
                    }}
                    placeholder="Search code…"
                    className="flex-1 bg-transparent text-white text-lg placeholder:text-ink-60 outline-none"
                  />
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="text-xs text-ink-60 uppercase tracking-wide mb-3">
                    {results.length} results
                  </div>
                  <div className="space-y-3">
                    {results.length === 0 && (
                      <div className="text-sm text-ink-60 py-4 text-center">
                        No matches found. Try a different query.
                      </div>
                    )}
                    {results.map((r, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="text-sm font-mono text-white">
                            {r.file}
                            <span className="text-ink-60">:{r.line}</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-ink-60">
                            {r.language}
                          </span>
                        </div>
                        <pre className="text-sm font-mono text-white/90 overflow-x-auto mb-2">
                          <code>{r.match}</code>
                        </pre>
                        <p className="text-xs text-ink-60">{r.context}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-20">
              <h2 className="font-display text-2xl font-bold text-ink mb-8">
                More than grep
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((f) => (
                  <div key={f.title} className="bg-background-cream/50 rounded-2xl border border-ink-60/10 p-7">
                    <h3 className="text-lg font-semibold text-ink mb-3">{f.title}</h3>
                    <p className="text-sm text-ink-60 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ink text-white rounded-3xl p-10 md:p-16 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Index once. Search forever.
              </h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">
                Codex indexes your repos in seconds. Every commit updates the
                index. Search stays instant as your codebase grows.
              </p>
              <a href="#" className="inline-block px-6 py-3 bg-white text-ink rounded-full text-sm font-medium hover:bg-white/90 transition">
                Get started
              </a>
            </div>
          </div>
        </section>
      </main>
      <FinalCTA />
    </>
  );
}