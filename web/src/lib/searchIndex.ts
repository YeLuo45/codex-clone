// Search index — built once, imported by SearchModal
import FlexSearch from "flexsearch";

export interface SearchDoc {
  id: string;
  title: string;
  url: string;
  content: string;
  tags?: string[];
}

let _index: any = null;
let _docs: Map<string, SearchDoc> | null = null;

export function buildIndex(docs: SearchDoc[]) {
  _docs = new Map();
  _index = new (FlexSearch as any).Document({
    document: {
      id: "id",
      index: ["title", "content", "tags"],
      store: ["title", "url", "tags"],
    },
    tokenize: "forward",
    cache: true,
  });
  docs.forEach((d) => {
    _docs!.set(d.id, d);
    _index!.add(d);
  });
}

export interface SearchHit {
  id: string;
  title: string;
  url: string;
  snippet: string;
}

export function search(query: string, limit = 8): SearchHit[] {
  if (!_index || !_docs || !query.trim()) return [];

  const results = _index.search(query, { limit, enrich: true });
  const seen = new Set<string>();
  const hits: SearchHit[] = [];

  for (const field of results) {
    for (const result of field.result) {
      const id = String((result as any).id);
      if (seen.has(id)) continue;
      seen.add(id);
      const doc = _docs.get(id);
      if (!doc) continue;

      // Build snippet around query match
      const q = query.toLowerCase();
      const lower = doc.content.toLowerCase();
      const idx = lower.indexOf(q);
      let snippet = "";
      if (idx >= 0) {
        const start = Math.max(0, idx - 40);
        const end = Math.min(doc.content.length, idx + query.length + 80);
        snippet = (start > 0 ? "…" : "") + doc.content.slice(start, end) + (end < doc.content.length ? "…" : "");
      } else {
        snippet = doc.content.slice(0, 120) + (doc.content.length > 120 ? "…" : "");
      }

      hits.push({
        id,
        title: doc.title,
        url: doc.url,
        snippet,
      });
      if (hits.length >= limit) return hits;
    }
  }
  return hits;
}

// Default Codex docs corpus — built into the bundle
export const DEFAULT_DOCS: SearchDoc[] = [
  {
    id: "home",
    title: "Codex — Coding agents for software engineering",
    url: "/#/",
    content:
      "Codex is OpenAI's coding agent. From routine pull requests to your hardest problems, Codex reliably completes tasks end to end. Built on OpenAI's frontier coding models for software engineering. Agentic coding command center. Built-in worktrees and cloud environments. Multi-agent workflows. Adapts to your team. Always-on background work. Raises the bar across your team. Codex in ChatGPT. Codex IDE extension. Codex CLI. Engineering teams use Codex. Wonderful. Harvey. Sierra. Ramp. Duolingo.",
    tags: ["home", "overview", "codex"],
  },
  {
    id: "skills",
    title: "Agent Skills",
    url: "/#/skills",
    content:
      "Agent Skills. Reusable instruction sets that teach Codex your team's standards. Test Generator. Code Review. Refactor Assistant. Documentation Writer. Migration Helper. Security Auditor. Define skills in plain YAML or JavaScript. Apply consistently across tasks.",
    tags: ["skills", "automation"],
  },
  {
    id: "code-search",
    title: "Code Search — Find any code in any repo",
    url: "/#/code-search",
    content:
      "Semantic code search. Understands intent, not just keywords. Cross-repo index. Symbol-aware. Find all references. Find functions. Patterns. Codebase search. Blazing fast. Incremental updates.",
    tags: ["search", "code-search", "tools"],
  },
  {
    id: "docs",
    title: "Codex Developer Docs",
    url: "/#/docs",
    content:
      "Codex developer documentation. Get started. Quickstart. CLI installation. Authentication. SDK usage. Tasks API. Worktrees. Cloud environments. Skills. Tools. Async tasks. Parallel execution. Cost controls. Observability. Eval framework. Production checklist. Security. Compliance. Audit logs.",
    tags: ["docs", "documentation"],
  },
  {
    id: "pricing",
    title: "API Pricing",
    url: "/#/pricing",
    content:
      "OpenAI API pricing. Flagship models. GPT-5.5. GPT-5.4. GPT-5.4 mini. GPT-Realtime-2. GPT-Image-2. Codex models. codex-1. codex-1-mini. codex-embed. Tools. Web search. Containers. Per-token billing. No commitments.",
    tags: ["pricing", "billing"],
  },
  {
    id: "enterprise",
    title: "Codex for Enterprise",
    url: "/#/enterprise",
    content:
      "Codex Enterprise. SSO. SAML. OIDC. RBAC. Role-based access control. Audit logs. Data residency. GDPR. SOC 2. Custom environments. Cost controls. Private models. Bring your own model.",
    tags: ["enterprise", "admin"],
  },
  {
    id: "pricing-models",
    title: "Models and Pricing Details",
    url: "/#/pricing",
    content:
      "GPT-5.5 most capable flagship. GPT-5.4 frontier reasoning. GPT-5.4 mini fast cost-efficient. GPT-Realtime-2 multimodal. GPT-Image-2 image generation. Codex-1 optimized for long-running agentic coding. Codex-1-mini faster cost-efficient. Code search. Container sandbox for agents.",
    tags: ["models", "pricing", "codex"],
  },
  {
    id: "testimonials",
    title: "What builders are saying",
    url: "/#/",
    content:
      "Daniel Sikorskiy Wonderful. Codex CLI has fully replaced every other agent framework. Joey Wang Harvey. Codex cuts early iteration time by 30% to 50%. Tess Rosania Sierra. We completed in a weekend what used to take a quarter. Austin Ray Ramp. PR review finds issues the team missed. Aaron Wang Duolingo. Backend Python code review. Backwards compatibility issues. Forge ahead.",
    tags: ["testimonials", "reviews"],
  },
];