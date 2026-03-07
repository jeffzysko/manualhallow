import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const CHAPTERS = [
  { id: "ch1", label: "01 · O Jogo do Premium" },
  { id: "ch2", label: "02 · Diagnóstico" },
  { id: "ch3", label: "03 · Espelhamento" },
  { id: "ch4", label: "04 · Escada do SIM" },
  { id: "ch5", label: "05 · Valor & Preço" },
  { id: "ch6", label: "06 · Persuasão" },
  { id: "ch7", label: "07 · Fechamento" },
  { id: "ch8", label: "08 · Experiência" },
  { id: "ch9", label: "09 · Planejamento" },
];

export function useReadingProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) { setProgress({}); setLoading(false); return; }
    const { data } = await supabase
      .from("reading_progress")
      .select("chapter_id, completed")
      .eq("user_id", user.id);
    const map: Record<string, boolean> = {};
    data?.forEach(r => { map[r.chapter_id] = r.completed; });
    setProgress(map);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  const toggleChapter = useCallback(async (chapterId: string) => {
    if (!user) return;
    const current = progress[chapterId] || false;
    const newVal = !current;

    setProgress(prev => ({ ...prev, [chapterId]: newVal }));

    if (current) {
      // Was completed, now uncomplete
      await supabase
        .from("reading_progress")
        .update({ completed: false, completed_at: null })
        .eq("user_id", user.id)
        .eq("chapter_id", chapterId);
    } else {
      // Mark as completed (upsert)
      await supabase
        .from("reading_progress")
        .upsert({
          user_id: user.id,
          chapter_id: chapterId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: "user_id,chapter_id" });
    }
  }, [user, progress]);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalChapters = CHAPTERS.length;
  const percentage = Math.round((completedCount / totalChapters) * 100);

  return { progress, toggleChapter, loading, completedCount, totalChapters, percentage, chapters: CHAPTERS };
}
