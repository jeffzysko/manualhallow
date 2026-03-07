import { createContext, useContext } from "react";

interface FavoritesContextType {
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (itemId: string, title: string, chapter: string) => void;
  isLoggedIn: boolean;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  isFavorite: () => false,
  toggleFavorite: () => {},
  isLoggedIn: false,
});

export const useFavoritesContext = () => useContext(FavoritesContext);
