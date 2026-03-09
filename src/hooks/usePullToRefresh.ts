import { useEffect, useRef, useState, useCallback } from "react";

export function usePullToRefresh(onRefresh?: () => Promise<void> | void) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const threshold = 80;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY > 5) return;
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || refreshing) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff < 0) { setPullDistance(0); return; }
    // Dampen the pull
    const dampened = Math.min(diff * 0.4, 120);
    setPullDistance(dampened);
    setPulling(dampened > 10);
    if (dampened > 20) e.preventDefault();
  }, [refreshing]);

  const handleTouchEnd = useCallback(async () => {
    isDragging.current = false;
    if (pullDistance >= threshold && !refreshing) {
      setRefreshing(true);
      try {
        if (onRefresh) await onRefresh();
        else window.location.reload();
      } finally {
        // Small delay for visual feedback
        setTimeout(() => {
          setRefreshing(false);
          setPulling(false);
          setPullDistance(0);
        }, 400);
      }
    } else {
      setPulling(false);
      setPullDistance(0);
    }
  }, [pullDistance, refreshing, onRefresh]);

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { pulling, pullDistance, refreshing, threshold };
}
