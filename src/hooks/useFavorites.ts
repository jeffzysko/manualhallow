import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isOffline, enqueue } from "@/lib/syncQueue";

export interface FavoriteItem {
  id: string;
  item_id: string;
  item_title: string;
  item_chapter: string;
  created_at: string;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) { setFavorites([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setFavorites((data as FavoriteItem[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const isFavorite = useCallback(
    (itemId: string) => favorites.some(f => f.item_id === itemId),
    [favorites]
  );

  const toggleFavorite = useCallback(async (itemId: string, title: string, chapter: string) => {
    if (!user) return;
    const existing = favorites.find(f => f.item_id === itemId);

    if (existing) {
      // Optimistic update
      setFavorites(prev => prev.filter(f => f.id !== existing.id));

      if (isOffline()) {
        enqueue({ type: "remove_favorite", payload: { id: existing.id } });
        return;
      }
      await supabase.from("favorites").delete().eq("id", existing.id);
    } else {
      // Optimistic update with temp id
      const tempItem: FavoriteItem = {
        id: crypto.randomUUID(),
        item_id: itemId,
        item_title: title,
        item_chapter: chapter,
        created_at: new Date().toISOString(),
      };
      setFavorites(prev => [tempItem, ...prev]);

      if (isOffline()) {
        enqueue({
          type: "add_favorite",
          payload: { user_id: user.id, item_id: itemId, item_title: title, item_chapter: chapter },
        });
        return;
      }

      const { data } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, item_id: itemId, item_title: title, item_chapter: chapter })
        .select()
        .single();
      if (data) {
        setFavorites(prev => prev.map(f => f.id === tempItem.id ? (data as FavoriteItem) : f));
      }
    }
  }, [user, favorites]);

  return { favorites, loading, isFavorite, toggleFavorite };
};
