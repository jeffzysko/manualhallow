import { useState, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import { useNavigate as useRouterNavigate } from "react-router-dom";
import "@/styles/manual.css";
import ManualCover from "@/components/manual/ManualCover";
import ManualTOC from "@/components/manual/ManualTOC";
import CollapsibleChapter from "@/components/manual/CollapsibleChapter";
import BottomTabBar from "@/components/manual/BottomTabBar";
import TopHeader from "@/components/manual/TopHeader";
import SearchOverlay from "@/components/manual/SearchOverlay";
import FavoritesOverlay from "@/components/manual/FavoritesOverlay";
import NotesDrawer from "@/components/manual/NotesDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { FavoritesContext } from "@/contexts/FavoritesContext";

import ChapterSkeleton from "@/components/manual/ChapterSkeleton";

const Chapter1Content = lazy(() => import("@/components/manual/chapters/Chapter1Content"));
const Chapter2Content = lazy(() => import("@/components/manual/chapters/Chapter2Content"));
const Chapter3Content = lazy(() => import("@/components/manual/chapters/Chapter3Content"));
const Chapter4Content = lazy(() => import("@/components/manual/chapters/Chapter4Content"));
const Chapter5Content = lazy(() => import("@/components/manual/chapters/Chapter5Content"));
const Chapter6Content = lazy(() => import("@/components/manual/chapters/Chapter6Content"));
const Chapter7Content = lazy(() => import("@/components/manual/chapters/Chapter7Content"));
const Chapter8Content = lazy(() => import("@/components/manual/chapters/Chapter8Content"));
const Chapter9Content = lazy(() => import("@/components/manual/chapters/Chapter9Content"));
const AppendixContent = lazy(() => import("@/components/manual/chapters/AppendixContent"));

const ManualPage = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [scriptsMode, setScriptsMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { progress, toggleChapter } = useReadingProgress();
  const routerNavigate = useRouterNavigate();

  const rafRef = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const h = document.documentElement;
        const progress = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        setScrollProgress(Math.min(progress, 100));
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const navigate = useCallback((target: string) => {
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleOpenFavorites = useCallback(() => {
    if (!user) {
      routerNavigate("/auth");
      return;
    }
    setFavoritesOpen(true);
  }, [user, routerNavigate]);

  const handleRemoveFavorite = useCallback((itemId: string) => {
    toggleFavorite(itemId, "", "");
  }, [toggleFavorite]);

  const tldr: Record<string, string[]> = {
    ch1: ["O cliente não compra produto — compra risco evitado e previsibilidade", "Preço premium se sustenta quando o valor percebido supera a âncora de custo", "Nunca entre na guerra de preço; entre na lógica risco × transformação"],
    ch2: ["Diagnóstico bom = entender cenário + critério de decisão + próximo passo", "Use SPIN: Situação → Problema → Implicação → Ganho", "Follow-up sempre com avanço de valor, nunca com 'e aí?'"],
    ch3: ["Espelhamento acontece em 3 níveis: palavras, ritmo e emoção", "Reflita o vocabulário e tom do cliente para gerar confiança em minutos", "Espelhar é entender, não manipular — faça com ética"],
    ch4: ["Microcompromissos reduzem resistência e tornam o 'sim' final natural", "Cada confirmação pequena gera consistência psicológica", "Use a técnica Rotular + Validar + Perguntar em cada interação"],
    ch5: ["Preço só entra quando já existe: cenário + critério + encaixe", "Ancoragem positiva antes do valor: mostre o que está incluso primeiro", "Use a fórmula: custo da inação > investimento na solução"],
    ch6: ["Reciprocidade, prova social e escassez são os 3 gatilhos mais eficazes", "Urgência real (agenda limitada) funciona melhor que pressão artificial", "Autoridade se constrói com dados e cases, não com autopromoção"],
    ch7: ["Fechamento premium = próximo passo claro, não pedido de compra", "Os 3 melhores: por próximo passo, por escolha, por resumo", "Nunca deixe o cliente sem saber o que fazer depois"],
    ch8: ["Pós-venda gera recompra e indicações — é o início do próximo ciclo", "Follow-up de entrega cria confiança e previne cancelamentos", "Cada cliente satisfeito vale 3 indicações em média"],
    ch9: ["Metas claras geram foco — sem meta, sem direção", "Acompanhe semanalmente, não apenas no final do mês", "Celebre conquistas intermediárias para manter motivação"],
  };

  return (
    <FavoritesContext.Provider value={{ isFavorite, toggleFavorite, isLoggedIn: !!user }}>
      <div className={`manual-page${scriptsMode ? " scripts-mode" : ""}`}>
        <div className="progress-bar" style={{ transform: `scaleX(${scrollProgress / 100})` }} />

        <TopHeader />

        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
        <FavoritesOverlay
          open={favoritesOpen}
          onClose={() => setFavoritesOpen(false)}
          favorites={favorites}
          onNavigate={navigate}
          onRemove={handleRemoveFavorite}
        />
        <NotesDrawer open={notesOpen} onClose={() => setNotesOpen(false)} />

        <main role="main">
          <ManualCover />
          <ManualTOC onNavigate={navigate} />

          <Suspense fallback={<ChapterSkeleton />}>
            <CollapsibleChapter id="ch1" num="01" numBg="var(--ch1)" tag="Estratégia" tagColor="var(--ch1)" title={<h2>O Jogo do<br/><em style={{color:"var(--ch1)"}}>Premium</em></h2>} lead="Como vender 2× mais caro sem entrar na guerra de preço. O cliente não compra piscina — compra risco evitado, previsibilidade e transformação." tldr={tldr.ch1} isRead={progress.ch1} onToggleRead={() => toggleChapter("ch1")} scriptsMode={scriptsMode}>
              <Chapter1Content />
            </CollapsibleChapter>

            <CollapsibleChapter id="ch2" num="02" numBg="var(--ch2)" tag="Descoberta" tagColor="var(--ch2)" title={<h2>Diagnóstico —<br/><em style={{color:"var(--ch2)"}}>Entenda o Cliente</em></h2>} lead="Diagnóstico bom não parece interrogatório. Parece conversa — que extrai cenário, critério e próximo passo sem que o cliente perceba." bgStyle="var(--bg2)" tldr={tldr.ch2} isRead={progress.ch2} onToggleRead={() => toggleChapter("ch2")} scriptsMode={scriptsMode}>
              <Chapter2Content />
            </CollapsibleChapter>

            <CollapsibleChapter id="ch3" num="03" numBg="var(--ch3)" tag="Conexão" tagColor="var(--ch3)" title={<h2>Espelhamento —<br/><em style={{color:"var(--ch3)"}}>Gere Confiança em Minutos</em></h2>} lead="Espelhamento é o cliente sentir que você entende o padrão dele. Acontece em 3 níveis: palavras, ritmo e emoção. Faça com ética." tldr={tldr.ch3} isRead={progress.ch3} onToggleRead={() => toggleChapter("ch3")} scriptsMode={scriptsMode}>
              <Chapter3Content />
            </CollapsibleChapter>

            <CollapsibleChapter id="ch4" num="04" numBg="var(--ch4)" numColor="#fff" tag="Decisão" tagColor="var(--ch4)" title={<h2>Escada do SIM —<br/><em style={{color:"var(--ch4)"}}>Microcompromissos</em></h2>} lead="Microcompromissos geram consistência: o cliente vai confirmando pequenas verdades até a decisão final parecer natural." bgStyle="var(--bg2)" tldr={tldr.ch4} isRead={progress.ch4} onToggleRead={() => toggleChapter("ch4")} scriptsMode={scriptsMode}>
              <Chapter4Content />
            </CollapsibleChapter>

            <CollapsibleChapter id="ch5" num="05" numBg="var(--ch5)" tag="Valor" tagColor="var(--ch5)" title={<h2>Valor &<br/><em style={{color:"var(--ch5)"}}>Preço Premium</em></h2>} lead="Preço alto só vira problema quando o valor percebido é menor que o custo. Monte a equação certa." tldr={tldr.ch5} isRead={progress.ch5} onToggleRead={() => toggleChapter("ch5")} scriptsMode={scriptsMode}>
              <Chapter5Content />
            </CollapsibleChapter>

            <CollapsibleChapter id="ch6" num="06" numBg="var(--ch6)" tag="Influência" tagColor="var(--ch6)" title={<h2>Persuasão —<br/><em style={{color:"var(--ch6)"}}>Influência Ética</em></h2>} lead="Persuasão premium é ética: ajudar o cliente a decidir com segurança. Gatilho mental não é frase mágica — é estrutura." bgStyle="var(--bg2)" tldr={tldr.ch6} isRead={progress.ch6} onToggleRead={() => toggleChapter("ch6")} scriptsMode={scriptsMode}>
              <Chapter6Content />
            </CollapsibleChapter>

            <CollapsibleChapter id="ch7" num="07" numBg="var(--ch7)" tag="Fechamento" tagColor="var(--ch7)" title={<h2>Conduza para<br/><em style={{color:"var(--ch7)"}}>a Decisão</em></h2>} lead="Fechamento premium é próximo passo claro. Você não fecha pedindo compra; fecha conduzindo." tldr={tldr.ch7} isRead={progress.ch7} onToggleRead={() => toggleChapter("ch7")} scriptsMode={scriptsMode}>
              <Chapter7Content />
            </CollapsibleChapter>

            <CollapsibleChapter id="ch8" num="08" numBg="var(--ch8)" numColor="#fff" tag="Experiência" tagColor="var(--ch8)" title={<h2>Experiência &<br/><em style={{color:"var(--ch8)"}}>Fidelização</em></h2>} lead="O atendimento que vira indicação. Os 7 pontos de ouro do pós-venda premium." bgStyle="var(--bg2)" tldr={tldr.ch8} isRead={progress.ch8} onToggleRead={() => toggleChapter("ch8")} scriptsMode={scriptsMode}>
              <Chapter8Content />
            </CollapsibleChapter>

            <CollapsibleChapter id="ch9" num="09" numBg="var(--ch1)" tag="Execução" tagColor="var(--ch1)" title={<h2>Planejamento &<br/><em style={{color:"var(--ch1)"}}>Metas 2026</em></h2>} lead="Meta é consequência de processo. Foque em taxa de avanço por etapa do funil." tldr={tldr.ch9} isRead={progress.ch9} onToggleRead={() => toggleChapter("ch9")} scriptsMode={scriptsMode}>
              <Chapter9Content />
            </CollapsibleChapter>

            <AppendixContent />
          </Suspense>

          <footer id="footer">
            <div className="footer-logo">HALLOW</div>
            <div className="footer-tagline">Comunicação · 2026</div>
          </footer>
        </main>

        <BottomTabBar
          onScrollTop={scrollToTop}
          onOpenDrawer={() => navigate("toc")}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenFavorites={handleOpenFavorites}
          onOpenNotes={() => {
            if (!user) { routerNavigate("/auth"); return; }
            setNotesOpen(true);
          }}
          onToggleScripts={() => setScriptsMode(!scriptsMode)}
          scriptsMode={scriptsMode}
        />
      </div>
    </FavoritesContext.Provider>
  );
};

export default ManualPage;
