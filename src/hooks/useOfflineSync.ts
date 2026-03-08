import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { peekQueue, dequeue, clearQueue } from "@/lib/syncQueue";
import { toast } from "sonner";

/**
 * Listens for online events and replays queued mutations.
 * Mount once at the app root level.
 */
export function useOfflineSync() {
  const { user } = useAuth();
  const syncingRef = useRef(false);

  const processQueue = useCallback(async () => {
    if (!user || syncingRef.current) return;
    const queue = peekQueue();
    if (queue.length === 0) return;

    syncingRef.current = true;
    let synced = 0;

    for (const action of queue) {
      try {
        const p = action.payload;
        switch (action.type) {
          case "upsert_note":
            await supabase.from("user_notes").upsert({
              user_id: p.user_id as string,
              section_id: p.section_id as string,
              chapter_id: p.chapter_id as string,
              content: p.content as string,
              updated_at: p.updated_at as string,
            }, { onConflict: "user_id,section_id" });
            break;
          case "delete_note":
            await supabase.from("user_notes")
              .delete()
              .eq("user_id", p.user_id as string)
              .eq("section_id", p.section_id as string);
            break;
          case "add_favorite":
            await supabase.from("favorites").insert({
              user_id: p.user_id as string,
              item_id: p.item_id as string,
              item_title: p.item_title as string,
              item_chapter: p.item_chapter as string,
            });
            break;
          case "remove_favorite":
            await supabase.from("favorites")
              .delete()
              .eq("id", p.id as string);
            break;
        }
        dequeue(action.id);
        synced++;
      } catch {
        // If one fails, stop — will retry on next online event
        break;
      }
    }

    syncingRef.current = false;
    if (synced > 0) {
      toast.success(`${synced} alteração${synced > 1 ? "ões" : ""} sincronizada${synced > 1 ? "s" : ""}`);
    }
  }, [user]);

  useEffect(() => {
    // Process on mount (in case we're already online with pending items)
    processQueue();

    const handleOnline = () => {
      processQueue();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [processQueue]);

  return { processQueue };
}
