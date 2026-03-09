import { useEffect, useRef, useState, useCallback } from "react";

export function usePullToRefresh(onRefresh?: () => Promise<void> | void) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const pullDistanceRef = useRef(0);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);
  const threshold = 80;

  // Keep refs in sync without re-binding listeners
  onRefreshRef.current = onRefresh;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY > 5 || refreshingRef.current) return;
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || refreshingRef.current) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff < 0) {
      if (pullDistanceRef.current !== 0) {
        pullDistanceRef.current = 0;
        setPullDistance(0);
        setPulling(false);
      }
      return;
    }
    const dampened = Math.min(diff * 0.4, 120);
    pullDistanceRef.current = dampened;
    setPullDistance(dampened);
    setPulling(dampened > 10);
    if (dampened > 20) e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(async () => {
    isDragging.current = false;
    const dist = pullDistanceRef.current;
    if (dist >= threshold && !refreshingRef.current) {
      refreshingRef.current = true;
      setRefreshing(true);
      try {
        if (onRefreshRef.current) await onRefreshRef.current();
        else window.location.reload();
      } finally {
        setTimeout(() => {
          refreshingRef.current = false;
          setRefreshing(false);
          setPulling(false);
          setPullDistance(0);
          pullDistanceRef.current = 0;
        }, 400);
      }
    } else {
      setPulling(false);
      setPullDistance(0);
      pullDistanceRef.current = 0;
    }
  }, []);

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
