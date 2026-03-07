import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
      await supabase.from("favorites").delete().eq("id", existing.id);
      setFavorites(prev => prev.filter(f => f.id !== existing.id));
    } else {
      const { data } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, item_id: itemId, item_title: title, item_chapter: chapter })
        .select()
        .single();
      if (data) setFavorites(prev => [data as FavoriteItem, ...prev]);
    }
  }, [user, favorites]);

  return { favorites, loading, isFavorite, toggleFavorite };
};
