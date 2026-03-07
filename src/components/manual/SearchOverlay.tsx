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
  const indexRef = useRef<SearchableItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build search index from DOM — runs once when overlay opens and index is empty
  const buildIndex = useCallback(() => {
    if (indexRef.current.length > 0) { setIndexReady(true); return; }

    // Small delay to ensure lazy chunks are rendered
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
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open, buildIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); }
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const search = useCallback((q: string) => {
    if (q.length < 2) { setResults([]); return; }
    const lower = q.toLowerCase();
    const found = indexRef.current.filter(item => item.text.toLowerCase().includes(lower));

    // Deduplicate by text similarity
    const seen = new Set<string>();
    const unique = found.filter(item => {
      const key = item.text.substring(0, 80).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setResults(unique.slice(0, 20));
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
    <div className={`search-overlay${open ? " open" : ""}`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="search-box">
        <div className="search-input-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Buscar scripts, objeções, técnicas…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={e => handleInput(e.target.value)}
          />
          <button className="search-close" onClick={onClose}>ESC</button>
        </div>
        <div className="search-results">
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
            <div key={i} className="search-result-item" onClick={() => { onNavigate(item.sectionId); onClose(); }}>
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
