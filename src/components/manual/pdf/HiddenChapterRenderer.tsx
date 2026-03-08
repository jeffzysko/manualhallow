import { lazy, Suspense, forwardRef } from "react";
import { FavoritesContext } from "@/contexts/FavoritesContext";

const Chapter1Content = lazy(() => import("@/components/manual/chapters/Chapter1Content"));
const Chapter2Content = lazy(() => import("@/components/manual/chapters/Chapter2Content"));
const Chapter3Content = lazy(() => import("@/components/manual/chapters/Chapter3Content"));
const Chapter4Content = lazy(() => import("@/components/manual/chapters/Chapter4Content"));
const Chapter5Content = lazy(() => import("@/components/manual/chapters/Chapter5Content"));
const Chapter6Content = lazy(() => import("@/components/manual/chapters/Chapter6Content"));
const Chapter7Content = lazy(() => import("@/components/manual/chapters/Chapter7Content"));
const Chapter8Content = lazy(() => import("@/components/manual/chapters/Chapter8Content"));
const Chapter9Content = lazy(() => import("@/components/manual/chapters/Chapter9Content"));

const CHAPTER_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  ch1: Chapter1Content,
  ch2: Chapter2Content,
  ch3: Chapter3Content,
  ch4: Chapter4Content,
  ch5: Chapter5Content,
  ch6: Chapter6Content,
  ch7: Chapter7Content,
  ch8: Chapter8Content,
  ch9: Chapter9Content,
};

// Stub context so FavoritableCard doesn't crash
const stubFavContext = {
  isFavorite: () => false,
  toggleFavorite: (_id: string, _title: string, _chapter: string) => {},
  isLoggedIn: false,
};

interface Props {
  chapterIds: string[];
}

const HiddenChapterRenderer = forwardRef<HTMLDivElement, Props>(({ chapterIds }, ref) => (
  <FavoritesContext.Provider value={stubFavContext}>
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        left: "-9999px",
        top: 0,
        width: "800px",
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      {chapterIds.map((id) => {
        const Comp = CHAPTER_COMPONENTS[id];
        if (!Comp) return null;
        return (
          <div key={id} data-chapter-id={id}>
            <Suspense fallback={null}>
              <Comp />
            </Suspense>
          </div>
        );
      })}
    </div>
  </FavoritesContext.Provider>
));

HiddenChapterRenderer.displayName = "HiddenChapterRenderer";

export default HiddenChapterRenderer;
