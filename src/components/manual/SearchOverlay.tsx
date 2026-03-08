import { useState, useEffect, useRef, useCallback } from "react";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (target: string) => void;
}

interface SearchableItem {
  text: string;
  chapter: string;
  sectionId: string;
}

const SearchOverlay = ({ open, onClose, onNavigate }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchableItem[]>([]);
  const [indexReady, setIndexReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const indexRef = useRef<SearchableItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Build search index from DOM
  const buildIndex = useCallback(() => {
    if (indexRef.current.length > 0) { setIndexReady(true); return; }

    setTimeout(() => {
      const sections = document.querySelectorAll(".manual-page section[id]");
      const items: SearchableItem[] = [];

      sections.forEach(section => {
        const id = section.id;
        if (id === "cover") return;
        const chLabel = section.querySelector(".ch-label-tag")?.textContent?.trim() || id;

        const selectors = ".script-text, .obj-q, .obj-branch-text, .audio-text, .prose, .check-text, h3, h4, .key-phrase, .callout p, .fu-msg, .step-body p, .step-body h4, .profile-card h4, .profile-card p, .mind-card h4, .mind-card p, .ponto-content h4, .ponto-content p, .phrase-item";
        const elements = section.querySelectorAll(selectors);

        elements.forEach(el => {
          const text = el.textContent?.trim() || "";
          if (text.length > 8) {
            items.push({ text: text.substring(0, 250), chapter: chLabel, sectionId: id });
          }
        });
      });

      indexRef.current = items;
      setIndexReady(true);
    }, 200);
  }, []);

  useEffect(() => {
    if (open) {
      buildIndex();
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, buildIndex]);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      onNavigate(results[activeIndex].sectionId);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  }, [results, activeIndex, onNavigate, onClose]);

  // Scroll active result into view
  useEffect(() => {
    if (activeIndex < 0) return;
    const el = resultsRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const search = useCallback((q: string) => {
    if (q.length < 2) { setResults([]); setActiveIndex(-1); return; }
    const lower = q.toLowerCase();
    const found = indexRef.current.filter(item => item.text.toLowerCase().includes(lower));

    const seen = new Set<string>();
    const unique = found.filter(item => {
      const key = item.text.substring(0, 80).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setResults(unique.slice(0, 20));
    setActiveIndex(-1);
  }, []);

  const handleInput = (val: string) => {
    setQuery(val);
    search(val);
  };

  const highlight = (text: string) => {
    if (!query || query.length < 2) return text;
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div
      ref={overlayRef}
      className={`search-overlay${open ? " open" : ""}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Buscar no manual"
    >
      <div className="search-box" onKeyDown={handleKeyDown}>
        <div className="search-input-wrap">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Buscar scripts, objeções, técnicas…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={e => handleInput(e.target.value)}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results-list"
            aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
          />
          <button className="search-close" onClick={onClose} aria-label="Fechar busca">ESC</button>
        </div>
        <div className="search-results" ref={resultsRef} id="search-results-list" role="listbox">
          {query.length < 2 && (
            <div className="search-hint">
              {indexReady
                ? `Digite para buscar em ${indexRef.current.length} itens do manual`
                : "Indexando conteúdo…"
              }
            </div>
          )}
          {query.length >= 2 && results.length === 0 && (
            <div className="search-empty">Nenhum resultado para "<strong>{query}</strong>"</div>
          )}
          {results.map((item, i) => (
            <div
              key={i}
              id={`search-result-${i}`}
              className={`search-result-item${i === activeIndex ? " search-result-item--active" : ""}`}
              onClick={() => { onNavigate(item.sectionId); onClose(); }}
              role="option"
              aria-selected={i === activeIndex}
            >
              <div className="search-result-chapter">{item.chapter}</div>
              <div className="search-result-text" dangerouslySetInnerHTML={{ __html: highlight(item.text) }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
