import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type EventType = "chapter_view" | "reading_time" | "ai_chat" | "favorite" | "note" | "search" | "login";

export function useAnalytics() {
  const { user } = useAuth();
  const timerRef = useRef<Record<string, number>>({});

  const track = useCallback(
    async (eventType: EventType, data?: { chapter_id?: string; duration_seconds?: number; event_data?: Record<string, unknown> }) => {
      if (!user) return;
      try {
        await supabase.from("analytics_events").insert({
          user_id: user.id,
          event_type: eventType,
          chapter_id: data?.chapter_id || null,
          duration_seconds: data?.duration_seconds || null,
          event_data: (data?.event_data as any) || {},
        });
      } catch {
        // silent fail — analytics should never break UX
      }
    },
    [user]
  );

  const startTimer = useCallback((chapterId: string) => {
    timerRef.current[chapterId] = Date.now();
  }, []);

  const stopTimer = useCallback(
    (chapterId: string) => {
      const start = timerRef.current[chapterId];
      if (!start) return;
      const seconds = Math.round((Date.now() - start) / 1000);
      delete timerRef.current[chapterId];
      if (seconds > 3) {
        track("reading_time", { chapter_id: chapterId, duration_seconds: seconds });
      }
    },
    [track]
  );

  return { track, startTimer, stopTimer };
}
