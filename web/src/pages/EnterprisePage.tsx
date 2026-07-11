import { Header } from "../sections/Header";
import { FinalCTA } from "../sections/FinalCTA";

const features = [
  {
    title: "SSO + RBAC",
    desc: "Single sign-on with your existing identity provider. Role-based access control for local vs cloud features.",
  },
  {
    title: "Audit logs",
    desc: "Every agent action is logged with full context — what file, what command, what user approved. Exportable for compliance.",
  },
  {
    title: "Data residency",
    desc: "Pin cloud environments to specific regions. Code stays in your chosen jurisdiction. GDPR & SOC 2 compliant.",
  },
  {
    title: "Custom environments",
    desc: "Pre-bake your toolchain: languages, package managers, internal CLI tools. Every agent gets the same base.",
  },
  {
    title: "Cost controls",
    desc: "Per-team budgets, per-task spend limits, automatic pause when monthly caps are hit. Full transparency.",
  },
  {
    title: "Private models",
    desc: "Use Codex with fine-tuned versions of OpenAI models, or bring your own model endpoint.",
  },
];

const setup = [
  { step: 1, title: "Connect your IdP", desc: "SAML or OIDC integration with Okta, Azure AD, Google Workspace, or any provider." },
  { step: 2, title: "Provision environments", desc: "Pre-install your toolchain. Set per-team resource limits." },
  { step: 3, title: "Define skills", desc: "Codify your team's standards as reusable Skills — apply them automatically to every task." },
  { step: 4, title: "Roll out gradually", desc: "Start with one team, monitor usage, expand to the full org." },
];

export function EnterprisePage({ onSearchOpen }: { onSearchOpen?: () => void } = {}) {
  return (
    <>
      <Header onSearchOpen={onSearchOpen} />
      <main>
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-container-desktop mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <div className="inline-flex items-center gap-2 mb-4 text-sm text-ink-60">
                <img src="/assets/hero-blossom-icon.png" alt="" className="h-4 w-4" />
                <span>For organizations</span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-tight mb-6">
                Codex for Enterprise
              </h1>
              <p className="text-lg text-ink-60 leading-relaxed">
                Learn how to configure Codex for your ChatGPT Enterprise
                workspace. SOC 2 compliant, SSO ready, audit-logged out of the box.
              </p>
            </div>

            {/* Features grid */}
            <div className="mb-20">
              <h2 className="font-display text-2xl font-bold text-ink mb-8">
                Built for teams
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((f) => (
                  <div key={f.title} className="bg-background-cream/50 rounded-2xl border border-ink-60/10 p-7">
                    <h3 className="text-lg font-semibold text-ink mb-3">{f.title}</h3>
                    <p className="text-sm text-ink-60 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Setup steps */}
            <div className="mb-20">
              <h2 className="font-display text-2xl font-bold text-ink mb-8">
                Setup in four steps
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                {setup.map((s) => (
                  <div key={s.step} className="relative bg-white rounded-2xl border border-ink-60/10 p-6">
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-ink text-white text-sm font-bold flex items-center justify-center">
                      {s.step}
                    </div>
                    <div className="mt-2">
                      <h3 className="text-base font-semibold text-ink mb-2">{s.title}</h3>
                      <p className="text-sm text-ink-60 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ink text-white rounded-3xl p-10 md:p-16 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to roll out Codex?
              </h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">
                Talk to our team about pricing, security review, and rollout
                planning for your organization.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="#" className="px-6 py-3 bg-white text-ink rounded-full text-sm font-medium hover:bg-white/90 transition">
                  Contact sales
                </a>
                <a href="#" className="px-6 py-3 border border-white/30 text-white rounded-full text-sm font-medium hover:border-white/60 transition">
                  Read security docs
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