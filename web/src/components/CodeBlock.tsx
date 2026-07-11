import { useEffect, useState } from "react";

interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
}

let _highlighterPromise: Promise<any> | null = null;
async function getHighlighter() {
  if (!_highlighterPromise) {
    const [
      { createHighlighterCore },
      bash,
      ts,
      tsx,
      js,
      yaml,
      json,
      theme,
    ] = await Promise.all([
      import("shiki/core"),
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/tsx.mjs"),
      import("shiki/langs/javascript.mjs"),
      import("shiki/langs/yaml.mjs"),
      import("shiki/langs/json.mjs"),
      import("shiki/themes/github-dark.mjs"),
    ]);
    _highlighterPromise = createHighlighterCore({
      themes: [theme.default],
      langs: [bash.default, ts.default, tsx.default, js.default, yaml.default, json.default],
    });
  }
  return _highlighterPromise;
}

export function CodeBlock({ code, lang = "bash", filename }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getHighlighter()
      .then((highlighter) => {
        if (cancelled) return;
        try {
          const loadedLangs = highlighter.getLoadedLanguages();
          const useLang = loadedLangs.includes(lang) ? lang : "bash";
          const out = highlighter.codeToHtml(code, {
            lang: useLang,
            theme: "github-dark",
          });
          setHtml(out);
        } catch {
          setHtml(
            `<pre style="background:#0d1117;color:#c9d1d9;padding:1rem;border-radius:0.5rem;overflow-x:auto;font-family:ui-monospace,monospace;font-size:0.8125rem;line-height:1.6;margin:0"><code>${escapeHtml(code)}</code></pre>`
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHtml(
            `<pre style="background:#0d1117;color:#c9d1d9;padding:1rem;border-radius:0.5rem;overflow-x:auto;font-family:ui-monospace,monospace;font-size:0.8125rem;line-height:1.6;margin:0"><code>${escapeHtml(code)}</code></pre>`
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden border border-ink-60/10">
      {filename && (
        <div className="bg-ink-60/5 px-4 py-2 text-xs font-mono text-ink-60 border-b border-ink-60/10">
          {filename}
        </div>
      )}
      <div className="bg-[#0d1117] overflow-x-auto text-sm">
        {html ? (
          <div
            className="[&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-4 [&>pre]:!rounded-none [&_code]:!font-mono [&_code]:!text-[0.8125rem] [&_code]:!leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="!bg-transparent !m-0 !p-4 text-white/60 font-mono text-[0.8125rem] leading-relaxed">
            <code>{code}</code>
          </pre>
        )}
      </div>
      <button
        onClick={copy}
        aria-label="Copy code"
        className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs opacity-0 group-hover:opacity-100 transition"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}