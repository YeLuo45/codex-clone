import { Header } from "../sections/Header";
import { FinalCTA } from "../sections/FinalCTA";

const flagshipModels = [
  { name: "GPT-5.5", desc: "Most capable flagship model.", price: "$5.00 / 1M input · $20.00 / 1M output" },
  { name: "GPT-5.4", desc: "Frontier reasoning model.", price: "$2.50 / 1M input · $10.00 / 1M output" },
  { name: "GPT-5.4 mini", desc: "Fast, cost-efficient.", price: "$0.25 / 1M input · $1.00 / 1M output" },
  { name: "GPT-Realtime-2", desc: "Realtime multimodal model.", price: "$4.00 / 1M input · $16.00 / 1M output" },
  { name: "GPT-Realtime-Translate", desc: "Real-time speech translation.", price: "$3.00 / 1M input · $12.00 / 1M output" },
  { name: "GPT-Realtime-Whisper", desc: "Speech-to-text transcription.", price: "$0.10 / 1M input" },
  { name: "GPT-Image-2", desc: "Image generation model.", price: "$0.05 / image" },
];

const codexModels = [
  { name: "codex-1", desc: "Latest Codex model. Optimized for long-running, agentic coding tasks.", price: "$3.00 / 1M input · $12.00 / 1M output" },
  { name: "codex-1-mini", desc: "Faster, cost-efficient Codex for everyday tasks.", price: "$0.30 / 1M input · $1.20 / 1M output" },
  { name: "codex-embed", desc: "Codebase embeddings for retrieval and search.", price: "$0.10 / 1M tokens" },
];

const tools = [
  { name: "Web search", desc: "Real-time web search for grounding.", price: "$10.00 / 1K calls" },
  { name: "Containers", desc: "Code execution sandbox for agents.", price: "$0.05 / minute" },
];

export function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-container-desktop mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-tight mb-6">
                API Pricing
              </h1>
              <p className="text-lg text-ink-60 leading-relaxed">
                Simple, transparent pricing for every model. Pay only for what
                you use, billed by token. No hidden fees, no commitments.
              </p>
            </div>

            {/* Flagship models */}
            <div className="mb-20">
              <h2 className="text-2xl font-bold text-ink mb-6 font-display">Flagship models</h2>
              <div className="border border-ink-60/10 rounded-2xl overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-background-cream">
                    <tr className="text-left text-xs text-ink-60 uppercase tracking-wide">
                      <th className="px-6 py-4 font-medium">Model</th>
                      <th className="px-6 py-4 font-medium">Description</th>
                      <th className="px-6 py-4 font-medium text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flagshipModels.map((m, i) => (
                      <tr key={m.name} className={i > 0 ? "border-t border-ink-60/10" : ""}>
                        <td className="px-6 py-4 font-mono text-sm text-ink">{m.name}</td>
                        <td className="px-6 py-4 text-sm text-ink-60">{m.desc}</td>
                        <td className="px-6 py-4 text-sm text-ink font-mono text-right">{m.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Codex models */}
            <div className="mb-20">
              <h2 className="text-2xl font-bold text-ink mb-6 font-display">Codex models</h2>
              <div className="border border-ink-60/10 rounded-2xl overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-background-cream">
                    <tr className="text-left text-xs text-ink-60 uppercase tracking-wide">
                      <th className="px-6 py-4 font-medium">Model</th>
                      <th className="px-6 py-4 font-medium">Description</th>
                      <th className="px-6 py-4 font-medium text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {codexModels.map((m, i) => (
                      <tr key={m.name} className={i > 0 ? "border-t border-ink-60/10" : ""}>
                        <td className="px-6 py-4 font-mono text-sm text-ink">{m.name}</td>
                        <td className="px-6 py-4 text-sm text-ink-60">{m.desc}</td>
                        <td className="px-6 py-4 text-sm text-ink font-mono text-right">{m.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tools */}
            <div className="mb-20">
              <h2 className="text-2xl font-bold text-ink mb-6 font-display">Tools</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {tools.map((t) => (
                  <div key={t.name} className="bg-background-cream/50 rounded-2xl border border-ink-60/10 p-6">
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h3 className="text-base font-semibold text-ink">{t.name}</h3>
                      <span className="text-sm font-mono text-ink-60">{t.price}</span>
                    </div>
                    <p className="text-sm text-ink-60 leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-ink text-white rounded-3xl p-10 md:p-16 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to start?
              </h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">
                Sign up to get started with the OpenAI API. Get $5 in free
                credit to experiment with any model.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="#" className="px-6 py-3 bg-white text-ink rounded-full text-sm font-medium hover:bg-white/90 transition">
                  Create account
                </a>
                <a href="#" className="px-6 py-3 border border-white/30 text-white rounded-full text-sm font-medium hover:border-white/60 transition">
                  Contact sales
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FinalCTA />
    </>
  );
}