import { useState, lazy, Suspense } from "react";
import { Header } from "../sections/Header";
import { FinalCTA } from "../sections/FinalCTA";
import { useDocumentHead } from "../lib/useDocumentHead";
import { metaFor, ROUTE_META } from "../lib/perPageMeta";

// Lazy-load CodeBlock — it pulls in ~140KB of shiki core + per-language chunks.
// Pages without code blocks (Home, Pricing, Enterprise, CodeSearch) never load it.
const CodeBlock = lazy(() => import("../components/CodeBlock").then((m) => ({ default: m.CodeBlock })));

const sidebarSections = [
  {
    title: "Get started",
    items: ["Overview", "Quickstart", "Authentication", "Rate limits", "Libraries"],
  },
  {
    title: "Core concepts",
    items: ["Worktrees", "Cloud environments", "Tasks", "Threads", "Sessions", "Skills", "Tools"],
  },
  {
    title: "Agents SDK",
    items: ["What is the SDK?", "Building agents", "Tool calling", "Memory & state", "Streaming", "Deployment"],
  },
  {
    title: "Tools",
    items: ["Shell", "File editor", "Browser", "Code search", "Web fetch"],
  },
  {
    title: "Run and scale",
    items: ["Async tasks", "Parallel execution", "Cost controls", "Observability", "Failure handling"],
  },
  {
    title: "Evaluation",
    items: ["Eval framework", "Benchmarks", "Custom tasks", "Reporting"],
  },
  {
    title: "Going live",
    items: ["Production checklist", "Security", "Compliance", "Audit logs"],
  },
];

const quickstart = `# Install the Codex CLI
npm install -g @openai/codex

# Authenticate with your ChatGPT account
codex login

# Run your first task
codex "add unit tests for the auth module"

# Run an interactive session
codex
> refactor the user service to use the new error types

# Schedule a background job
codex schedule "triage new issues labeled needs-triage"
`;

const apiExample = `# Run a coding task programmatically
import { Codex } from "@openai/codex";

const client = new Codex();

const task = await client.tasks.create({
  prompt: "Migrate the legacy auth middleware to use JWT",
  environment: "cloud",
  worktree: true,
});

console.log(\`Started task: \${task.id}\`);
console.log(\`Track progress: https://chatgpt.com/codex/tasks/\${task.id}\`);
`;

export function DocsPage({ onSearchOpen }: { onSearchOpen?: () => void } = {}) {
  const [activeItem, setActiveItem] = useState("Quickstart");
  useDocumentHead(metaFor({ key: "docs", ...ROUTE_META.docs }));

  return (
    <>
      <Header onSearchOpen={onSearchOpen} />
      <main className="bg-white">
        <div className="max-w-container-desktop mx-auto px-6 lg:px-8 py-12">
          {/* Page header */}
          <div className="mb-12">
            <div className="text-sm text-ink-60 mb-2">Codex</div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
              Codex Developer Docs
            </h1>
            <p className="text-lg text-ink-60 max-w-2xl">
              Learn how to integrate Codex into your engineering workflow — from
              the CLI, the SDK, or the ChatGPT UI.
            </p>
          </div>

          <div className="grid lg:grid-cols-[240px_1fr] gap-12">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <nav className="space-y-8">
                {sidebarSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs font-semibold text-ink-60 uppercase tracking-wide mb-3">
                      {section.title}
                    </h3>
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <li key={item}>
                          <button
                            onClick={() => setActiveItem(item)}
                            className={`text-sm w-full text-left px-3 py-1.5 rounded-md transition ${
                              activeItem === item
                                ? "bg-ink text-white font-medium"
                                : "text-ink-80 hover:bg-ink-60/5 hover:text-ink"
                            }`}
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <article className="prose-content">
              <div className="bg-background-cream rounded-2xl p-6 mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-ink text-white flex items-center justify-center text-xs font-bold">
                    ?
                  </div>
                  <h3 className="text-base font-semibold text-ink">Search the Codex docs</h3>
                </div>
                <input
                  type="text"
                  placeholder="Ask anything about Codex…"
                  className="w-full px-4 py-2.5 bg-white border border-ink-60/15 rounded-lg text-sm focus:outline-none focus:border-ink"
                />
              </div>

              <h2 className="font-display text-3xl font-bold text-ink mb-4">{activeItem}</h2>

              <p className="text-base text-ink-80 leading-relaxed mb-6">
                Codex is OpenAI's coding agent — designed to complete real
                engineering tasks end to end. This guide walks you through
                installation, authentication, and your first coding task.
              </p>

              <h3 className="font-display text-xl font-bold text-ink mt-10 mb-4">
                Quickstart
              </h3>
              <p className="text-base text-ink-80 leading-relaxed mb-4">
                Get up and running with Codex in under a minute. Install the
                CLI, sign in with your ChatGPT account, and dispatch your
                first coding task.
              </p>

              <Suspense fallback={<pre className="bg-background-cream p-4 rounded-lg text-xs overflow-x-auto">{quickstart}</pre>}>
                <CodeBlock code={quickstart} lang="bash" filename="terminal" />
              </Suspense>

              <h3 className="font-display text-xl font-bold text-ink mt-10 mb-4">
                SDK usage
              </h3>
              <p className="text-base text-ink-80 leading-relaxed mb-4">
                For programmatic access, install the{" "}
                <code className="bg-ink-60/10 px-1.5 py-0.5 rounded text-sm font-mono">
                  @openai/codex
                </code>{" "}
                SDK and dispatch tasks from your own application. Tasks run in
                cloud environments with built-in worktrees.
              </p>

              <Suspense fallback={<pre className="bg-background-cream p-4 rounded-lg text-xs overflow-x-auto">{apiExample}</pre>}>
                <CodeBlock code={apiExample} lang="typescript" filename="task.ts" />
              </Suspense>

              <h3 className="font-display text-xl font-bold text-ink mt-10 mb-4">
                Core concepts
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { t: "Tasks", d: "A unit of work dispatched to Codex — typically a coding request like 'add tests' or 'refactor X'." },
                  { t: "Worktrees", d: "Isolated git branches where Codex makes changes. Multiple worktrees run in parallel without conflicts." },
                  { t: "Cloud environments", d: "Sandboxed dev environments with your full repo. Pre-installed with common toolchains." },
                  { t: "Skills", d: "Reusable instructions that teach Codex your team's standards, conventions, and workflows." },
                ].map((c) => (
                  <div key={c.t} className="bg-background-cream/50 rounded-xl p-5 border border-ink-60/10">
                    <h4 className="text-sm font-semibold text-ink mb-2">{c.t}</h4>
                    <p className="text-sm text-ink-60 leading-relaxed">{c.d}</p>
                  </div>
                ))}
              </div>

              <h3 className="font-display text-xl font-bold text-ink mt-10 mb-4">
                Next steps
              </h3>
              <ul className="space-y-2 mb-8">
                {[
                  "Install the Codex CLI and authenticate",
                  "Run your first background task",
                  "Define Skills for your team's conventions",
                  "Set up parallel worktrees for safe experimentation",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-ink-80">
                    <span className="w-6 h-6 rounded-full bg-ink text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </main>
      <FinalCTA />
    </>
  );
}