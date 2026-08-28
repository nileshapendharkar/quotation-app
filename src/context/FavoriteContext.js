import React, { createContext, useState, useCallback, useMemo } from 'react';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  // O(1) lookup set, kept in sync with favorites array
  const favoriteIds = useMemo(() => new Set(favorites.map(item => item.id)), [favorites]);

  const toggleFavorite = useCallback((product) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  const isFavorite = useCallback((productId) => {
    return favoriteIds.has(productId);
  }, [favoriteIds]);

  const contextValue = useMemo(() => ({
    favorites,
    toggleFavorite,
    isFavorite
  }), [favorites, toggleFavorite, isFavorite]);

  return (
    <FavoriteContext.Provider value={contextValue}>
      {children}
    </FavoriteContext.Provider>
  );
};
