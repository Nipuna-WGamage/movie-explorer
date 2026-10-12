import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMovieGenres } from '../api/tmdb';

const MovieContext = createContext(null);

const STORAGE_KEYS = {
  FAVORITES: 'movie_explorer_favorites',
  LAST_SEARCH: 'movie_explorer_last_search',
  RECENT_SEARCHES: 'movie_explorer_recent_searches',
};

export const MovieProvider = ({ children }) => {
  // Favorites persistence
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Last searched query persistence
  const [lastSearchQuery, setLastSearchQueryState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SEARCH) || '';
    } catch {
      return '';
    }
  });

  // Recent searches list persistence
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Genres cache
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (lastSearchQuery) {
      localStorage.setItem(STORAGE_KEYS.LAST_SEARCH, lastSearchQuery);
    }
  }, [lastSearchQuery]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    let isMounted = true;
    getMovieGenres()
      .then((data) => {
        if (isMounted) setGenres(data);
      })
      .catch((err) => console.error('Failed to load genres:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  const setLastSearchQuery = (query) => {
    const trimmed = query?.trim() || '';
    setLastSearchQueryState(trimmed);
    if (trimmed) {
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
        return [trimmed, ...filtered].slice(0, 8);
      });
    }
  };

  const removeRecentSearch = (queryToRemove) => {
    setRecentSearches((prev) => prev.filter((q) => q !== queryToRemove));
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === Number(movieId) || movie.id === movieId);
  };

  const addFavorite = (movie) => {
    if (!movie || !movie.id) return;
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [
        {
          id: movie.id,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date || movie.first_air_date,
          overview: movie.overview,
          genre_ids: movie.genre_ids || movie.genres?.map((g) => g.id),
        },
        ...prev,
      ];
    });
  };

  const removeFavorite = (movieId) => {
    setFavorites((prev) => prev.filter((m) => m.id !== Number(movieId) && m.id !== movieId));
  };

  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const getGenreName = (genreId) => {
    const match = genres.find((g) => g.id === Number(genreId));
    return match ? match.name : null;
  };

  return (
    <MovieContext.Provider
      value={{
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearFavorites,
        lastSearchQuery,
        setLastSearchQuery,
        recentSearches,
        removeRecentSearch,
        genres,
        getGenreName,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovie must be used within MovieProvider');
  }
  return context;
};
