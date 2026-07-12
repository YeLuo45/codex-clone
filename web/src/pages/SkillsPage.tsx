import { Header } from "../sections/Header";
import { FinalCTA } from "../sections/FinalCTA";
import { CodeBlock } from "../components/CodeBlock";
import { useDocumentHead } from "../lib/useDocumentHead";
import { metaFor, ROUTE_META } from "../lib/perPageMeta";

const skills = [
  {
    title: "Test Generator",
    desc: "Automatically generates unit tests, integration tests, and snapshot tests for new code. Follows your project's testing conventions.",
    code: `skill: test-generator
description: "Generate tests for any new function"
trigger: "on file create"
output: src/**/*.{test,spec}.{ts,tsx,js,jsx}`,
  },
  {
    title: "Code Review",
    desc: "Reviews pull requests for code quality, security issues, and adherence to team conventions. Posts inline comments and can request changes.",
    code: `skill: code-review
description: "PR review agent"
trigger: "on PR open/update"
checks:
  - lint
  - type errors
  - security vulnerabilities
  - test coverage > 80%`,
  },
  {
    title: "Refactor Assistant",
    desc: "Identifies code smells and applies refactoring patterns (extract method, rename, replace conditional with polymorphism) with test verification.",
    code: `skill: refactor-assistant
description: "Apply safe refactors"
patterns:
  - extract-method
  - inline-variable
  - replace-magic-number
verify: "all tests pass"`,
  },
  {
    title: "Documentation Writer",
    desc: "Writes and updates JSDoc, README files, and inline comments based on code analysis. Keeps documentation in sync with the codebase.",
    code: `skill: docs-writer
description: "Generate documentation"
formats:
  - JSDoc
  - README.md
  - inline comments
trigger: "on commit or PR merge"`,
  },
  {
    title: "Migration Helper",
    desc: "Handles large-scale API migrations, dependency upgrades, and framework transitions with rollback safety.",
    code: `skill: migration-helper
description: "Major version migrations"
strategy: "incremental with feature flags"
rollback: "automatic on test failure"
verify:
  - "type check"
  - "all tests pass"
  - "no new lint warnings"`,
  },
  {
    title: "Security Auditor",
    desc: "Scans for OWASP top 10 vulnerabilities, hardcoded secrets, and unsafe dependencies. Generates patch suggestions.",
    code: `skill: security-auditor
description: "Security review"
checks:
  - SQL injection
  - XSS
  - CSRF
  - hardcoded secrets
  - vulnerable deps
severity: ["critical", "high", "medium"]`,
  },
];

export function SkillsPage({ onSearchOpen }: { onSearchOpen?: () => void } = {}) {
  useDocumentHead(metaFor({ key: "skills", ...ROUTE_META.skills }));
  return (
    <>
      <Header onSearchOpen={onSearchOpen} />
      <main>
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-container-desktop mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <div className="inline-flex items-center gap-2 mb-4 text-sm text-ink-60">
                <img src="/assets/hero-blossom-icon.png" alt="" className="h-4 w-4" />
                <span>Agent Skills</span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-tight mb-6">
                Agent Skills
              </h1>
              <p className="text-lg text-ink-60 leading-relaxed">
                Skills are reusable instruction sets that teach Codex your team's
                standards, workflows, and conventions. Define a skill once,
                apply it consistently across every task.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {skills.map((s) => (
                <div key={s.title} className="bg-background-cream/50 rounded-2xl border border-ink-60/10 p-7 card-hover">
                  <h3 className="text-xl font-semibold text-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-ink-60 leading-relaxed mb-5">{s.desc}</p>
                  <CodeBlock code={s.code} lang="yaml" filename={s.title.toLowerCase().replace(/ /g, '-') + '.skill'} />
                </div>
              ))}
            </div>

            <div className="mt-16 bg-ink text-white rounded-3xl p-10 md:p-16 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Build your own skill
              </h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">
                Define a skill in plain YAML or JavaScript. Codex loads it
                automatically when relevant context is detected.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="#" className="px-6 py-3 bg-white text-ink rounded-full text-sm font-medium hover:bg-white/90 transition">
                  View docs
                </a>
                <a href="#" className="px-6 py-3 border border-white/30 text-white rounded-full text-sm font-medium hover:border-white/60 transition">
                  Skill examples
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