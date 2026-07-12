import { Header } from "../sections/Header";
import { FinalCTA } from "../sections/FinalCTA";
import { useDocumentHead } from "../lib/useDocumentHead";
import { metaFor, ROUTE_META } from "../lib/perPageMeta";

export function EnHomePage({ onSearchOpen }: { onSearchOpen?: () => void } = {}) {
  useDocumentHead(metaFor({ key: "home-en", ...ROUTE_META["home-en"] }));
  return (
    <>
      <Header onSearchOpen={onSearchOpen} />
      <main>
        {/* Hero (English) */}
        <section className="relative overflow-hidden bg-hero-glow">
          <div className="max-w-container-desktop mx-auto px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-6 text-sm text-ink-60">
                <img src="/assets/hero-blossom-icon.png" alt="" className="h-4 w-4" />
                <span>Codex in ChatGPT</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-ink mb-6">
                Codex
              </h1>
              <p className="text-xl md:text-2xl text-ink-80 leading-snug mb-6 font-display">
                The best way to build with agents
              </p>
              <p className="text-base md:text-lg text-ink-60 leading-relaxed max-w-2xl mx-auto">
                The same powerful coding agent—now in ChatGPT. From routine pull
                requests to your hardest problems, Codex reliably completes tasks
                end to end. Built on OpenAI's frontier coding models.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <a href="#" className="px-6 py-3 bg-ink text-white rounded-full text-sm font-medium hover:bg-ink-12 transition">
                  Get started
                </a>
                <a href="#" className="px-6 py-3 border border-ink/15 text-ink rounded-full text-sm font-medium hover:border-ink/30 transition">
                  Read the docs
                </a>
              </div>
            </div>
            <div className="mt-16 md:mt-20">
              <div className="bg-gradient-to-br from-background-cream to-white rounded-3xl border border-ink-60/10 aspect-[16/9] flex items-center justify-center">
                <div className="text-center">
                  <img src="/assets/hero-blossom-icon.png" alt="Codex" className="w-16 h-16 mx-auto mb-3" />
                  <p className="text-sm text-ink-60">Codex product demo</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Surfaces (English) */}
        <section id="surfaces" className="bg-background-cream py-20 md:py-28">
          <div className="max-w-container-desktop mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-ink leading-tight mb-4">
                The same agent
                <br />
                everywhere you code
              </h2>
              <p className="text-base text-ink-60 leading-relaxed">
                Across ChatGPT, your editor, and the terminal — Codex follows
                you, with all your work connected through your ChatGPT account.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              {[
                { t: "Codex in ChatGPT", d: "A command center for agentic coding. With built-in worktrees and cloud environments, agents run in parallel across multiple projects — turning weeks into days.", img: "/assets/surface-chatgpt-app.png" },
                { t: "Codex IDE extension", d: "Run Codex in your favorite IDE. Code completion, refactors, PR review — all from your editor.", img: "/assets/surface-ide-extension.png" },
                { t: "Codex CLI", d: "Talk to Codex from your terminal. Pipe agents into scripts, CI/CD pipelines, and your daily workflow.", img: "/assets/surface-cli.png" },
              ].map((s) => (
                <div key={s.t} className="bg-white rounded-2xl border border-ink-60/10 overflow-hidden card-hover">
                  <div className="aspect-[4/3] bg-ink-60/5 overflow-hidden">
                    <img src={s.img} alt={s.t} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-ink mb-2">{s.t}</h3>
                    <p className="text-sm text-ink-60 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features (English) */}
        <section id="features" className="bg-white py-20 md:py-28">
          <div className="max-w-container-desktop mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-ink leading-tight mb-4">
                Built to drive
                <br />
                real engineering work
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { t: "Designed for multi-agent workflows", d: "Codex in ChatGPT is a command center for agentic coding. With built-in worktrees and cloud environments, agents run in parallel across multiple projects — turning weeks into days.", img: "/assets/feature-built.png" },
                { t: "Adapts to how your team builds", d: 'With Skills, you can teach Codex your team\'s standards, workflows, and conventions. Codex consistently applies them across tasks — getting more done with less supervision.', img: "/assets/feature-designed.png" },
                { t: "Made for always-on background work", d: "Hand off the routine work — triaging tickets, monitoring alerts, running CI/CD — so your team can stay focused on the code that matters most.", img: "/assets/feature-adapts.png" },
                { t: "Raises the bar across your team", d: "Codex raises engineering quality through rigorous design, comprehensive testing, and high-quality code review — reducing risk and shipping with confidence.", img: "/assets/feature-raise-bar.png" },
              ].map((f) => (
                <div key={f.t} className="bg-background-cream/50 rounded-2xl border border-ink-60/8 overflow-hidden card-hover">
                  <div className="aspect-[4/3] bg-white overflow-hidden">
                    <img src={f.img} alt={f.t} className="w-full h-full object-cover object-center" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-semibold text-ink mb-3">{f.t}</h3>
                    <p className="text-sm text-ink-60 leading-relaxed">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials (English) */}
        <section id="testimonials" className="bg-background-cream py-20 md:py-28">
          <div className="max-w-container-desktop mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-ink leading-tight mb-4">
                What builders are saying
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { q: "At Wonderful, for the deep reasoning and understanding required for core technical and architectural work, Codex CLI has fully replaced every other agent framework we used.", a: "Daniel Sikorskiy", r: "Principal Architect, Wonderful" },
                { q: "At Harvey, Codex has fundamentally changed how we build. It cuts early iteration time by 30% to 50%, letting engineers focus on system design and high-leverage decisions.", a: "Joey Wang", r: "Head of Mobile, Harvey" },
                { q: "With Codex, we completed in a weekend what used to take a quarter. We're now taking on projects we previously couldn't, and it's become indispensable to how we work.", a: "Tess Rosania", r: "Software Engineer, Sierra" },
              ].map((t, i) => (
                <figure key={i} className="bg-white rounded-2xl border border-ink-60/10 p-8 flex flex-col">
                  <blockquote className="text-base text-ink-80 leading-relaxed flex-1 mb-6">
                    "{t.q}"
                  </blockquote>
                  <figcaption>
                    <div className="text-sm font-semibold text-ink">{t.a}</div>
                    <div className="text-xs text-ink-60 mt-0.5">{t.r}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>
      <FinalCTA />
    </>
  );
}