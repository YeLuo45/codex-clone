import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { SearchHit } from "../lib/searchIndex";

/**
 * SearchModal — opens via Cmd/Ctrl+K. Pre-loaded chrome; the actual
 * FlexSearch index is only built (and the searchIndex module chunked
 * out of the main bundle) the FIRST time the modal opens.
 */
export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  // Module-handle cache for the search runtime; lazy-imported so that
  // FlexSearch ~1MB+ doesn't ship in the initial bundle.
  const searchIndexRef = useRef<typeof import("../lib/searchIndex") | null>(null);

  // Lazy-load + build index on first open
  useEffect(() => {
    if (!searchIndexRef.current) {
      void import("../lib/searchIndex").then((mod) => {
        searchIndexRef.current = mod;
        mod.buildIndex(mod.DEFAULT_DOCS);
      });
    }
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setHits([]);
      setActiveIdx(0);
    }
  }, [open]);

  // Update hits on query change
  useEffect(() => {
    if (!query.trim() || !searchIndexRef.current) {
      setHits([]);
    } else {
      setHits(searchIndexRef.current.search(query));
    }
    setActiveIdx(0);
  }, [query]);

  if (!open) return null;

  const handleSelect = (hit: SearchHit) => {
    navigate(hit.url);
    onClose();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && hits[activeIdx]) {
      e.preventDefault();
      handleSelect(hits[activeIdx]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-ink-60/10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-ink-60 shrink-0">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-ink-60"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs bg-ink-60/10 rounded text-ink-60 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() === "" && (
            <div className="p-8 text-center text-sm text-ink-60">
              <p className="mb-2">{t("search.empty")}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {((t("search.suggestions", { returnObjects: true }) as string[]) || []).map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 rounded-full bg-ink-60/5 hover:bg-ink-60/10 text-xs text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() !== "" && hits.length === 0 && (
            <div className="p-8 text-center text-sm text-ink-60">
              {t("search.noResults")} "<span className="text-ink font-medium">{query}</span>"
            </div>
          )}

          {hits.map((hit, i) => (
            <button
              key={hit.id}
              onClick={() => handleSelect(hit)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`w-full text-left px-5 py-3 border-b border-ink-60/5 last:border-0 transition ${
                i === activeIdx ? "bg-ink-60/5" : "hover:bg-ink-60/3"
              }`}
            >
              <div className="text-sm font-semibold text-ink mb-1">{hit.title}</div>
              <div className="text-xs text-ink-60 line-clamp-2">{hit.snippet}</div>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-ink-60/10 bg-ink-60/3 text-xs text-ink-60 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span><kbd className="px-1.5 py-0.5 bg-white rounded text-ink-60 font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white rounded text-ink-60 font-mono">↓</kbd> {t("search.navigate")}</span>
            <span><kbd className="px-1.5 py-0.5 bg-white rounded text-ink-60 font-mono">↵</kbd> {t("search.open")}</span>
          </div>
          <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded text-ink-60 font-mono">ESC</kbd> {t("search.close")}</span>
        </div>
      </div>
    </div>
  );
}

// Hook to manage the modal state
export function useSearchModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return { open, setOpen };
}