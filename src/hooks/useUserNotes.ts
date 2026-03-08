import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isOffline, enqueue } from "@/lib/syncQueue";

export function useUserNotes(sectionId: string, chapterId: string) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !sectionId) { setLoading(false); return; }
    supabase
      .from("user_notes")
      .select("content")
      .eq("user_id", user.id)
      .eq("section_id", sectionId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setContent(data.content);
        setLoading(false);
      });
  }, [user, sectionId]);

  const save = useCallback(async (text: string) => {
    if (!user) return;
    setContent(text);
    setSaved(false);

    if (isOffline()) {
      if (!text.trim()) {
        enqueue({ type: "delete_note", payload: { user_id: user.id, section_id: sectionId } });
      } else {
        enqueue({
          type: "upsert_note",
          payload: {
            user_id: user.id,
            section_id: sectionId,
            chapter_id: chapterId,
            content: text,
            updated_at: new Date().toISOString(),
          },
        });
      }
      setSaved(true);
      return;
    }

    if (!text.trim()) {
      await supabase
        .from("user_notes")
        .delete()
        .eq("user_id", user.id)
        .eq("section_id", sectionId);
    } else {
      await supabase
        .from("user_notes")
        .upsert({
          user_id: user.id,
          section_id: sectionId,
          chapter_id: chapterId,
          content: text,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id,section_id" });
    }
    setSaved(true);
  }, [user, sectionId, chapterId]);

  return { content, setContent, save, saved, loading };
}
