import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import ErrorAlert from '../components/ErrorAlert';
import { useMovie } from '../context/MovieContext';
import { searchMovies, discoverMovies, getTrendingMovies, BACKDROP_SIZES } from '../api/tmdb';

export default function HomePage() {
  const { lastSearchQuery, setLastSearchQuery } = useMovie();

  const [query, setQuery] = useState(lastSearchQuery || '');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [heroMovie, setHeroMovie] = useState(null);

  // Extra filter features
  const [filters, setFilters] = useState({
    genreId: '',
    year: '',
    minRating: '',
    sortBy: 'popularity.desc',
  });

  // UX Toggle: Infinite scroll vs Load More button
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const observerRef = useRef(null);

  const hasActiveFilters = Boolean(filters.genreId || filters.year || filters.minRating || filters.sortBy !== 'popularity.desc');

  // Fetch Hero movie spotlight on initial mount
  useEffect(() => {
    let isMounted = true;
    getTrendingMovies('day', 1)
      .then((data) => {
        if (isMounted && data.results && data.results.length > 0) {
          const featured = data.results.find((m) => m.backdrop_path) || data.results[0];
          setHeroMovie(featured);
        }
      })
      .catch(() => { });
    return () => {
      isMounted = false;
    };
  }, []);

  // Main data fetching function
  const fetchMoviesData = useCallback(
    async (currentPage = 1, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        let data;
        if (query.trim()) {
          // TMDB search
          data = await searchMovies(query.trim(), currentPage);
        } else {
          // Discover with filters or default popular
          data = await discoverMovies({
            page: currentPage,
            genreId: filters.genreId,
            year: filters.year,
            minRating: filters.minRating,
            sortBy: filters.sortBy,
          });
        }

        const filteredResults = data.results || [];
        setTotalPages(data.total_pages || 1);

        if (append) {
          setMovies((prev) => {
            // Deduplicate by ID
            const existingIds = new Set(prev.map((m) => m.id));
            const newItems = filteredResults.filter((m) => !existingIds.has(m.id));
            return [...prev, ...newItems];
          });
        } else {
          setMovies(filteredResults);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch movies. Please try again.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, filters]
  );

  // Trigger search on query / filters changes
  useEffect(() => {
    setPage(1);
    fetchMoviesData(1, false);
  }, [fetchMoviesData]);

  // Handle Search submission
  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    if (newQuery) {
      setLastSearchQuery(newQuery);
    }
  };

  // Handle Filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      genreId: '',
      year: '',
      minRating: '',
      sortBy: 'popularity.desc',
    });
  };

  // Reset entire search and filters
  const handleResetAll = () => {
    setQuery('');
    handleResetFilters();
  };

  // Load More logic
  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMoviesData(nextPage, true);
    }
  };

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    if (!useInfiniteScroll || loading || loadingMore || page >= totalPages) return;

    const currentElement = observerRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(currentElement);
    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [useInfiniteScroll, loading, loadingMore, page, totalPages]);

  const hasMore = page < totalPages;

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Hero Showcase Spotlight */}
      {heroMovie && !query && (
        <Box
          sx={{
            position: 'relative',
            height: { xs: 360, sm: 460, md: 520 },
            backgroundImage: heroMovie.backdrop_path
              ? `url(${BACKDROP_SIZES.original}${heroMovie.backdrop_path})`
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            mb: 4,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          {/* Gradients */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(11, 15, 25, 1) 0%, rgba(11, 15, 25, 0.7) 50%, rgba(11, 15, 25, 0.4) 100%)',
            }}
          />
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pb: { xs: 4, md: 6 } }}>

            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                color: '#fff',
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.2rem' },
                maxWidth: 800,
                textShadow: '0 4px 16px rgba(0,0,0,0.8)',
                mb: 1.5,
              }}
            >
              {heroMovie.title || heroMovie.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                maxWidth: 680,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: { xs: '0.9rem', md: '1.05rem' },
                mb: 2.5,
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              }}
            >
              {heroMovie.overview}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href={`/movie/${heroMovie.id}`}
              sx={{ fontWeight: 700, px: 3.5, py: 1.2, borderRadius: 2.5 }}
            >
              Explore Movie Details
            </Button>
          </Container>
        </Box>
      )}

      <Container maxWidth="xl">
        {/* Search Bar section */}
        <Box sx={{ mt: heroMovie && !query ? 2 : 4, mb: 2 }}>
          <SearchBar onSearch={handleSearch} activeQuery={query} />
        </Box>

        {/* Filters Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Section Heading & Result Meta */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.5,
            mb: 2,
            pt: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MovieFilterIcon color="primary" />
            <Typography variant="h5" fontWeight={800}>
              {query ? `Results for "${query}"` : hasActiveFilters ? 'Filtered Movies' : 'Discover Movies'}
            </Typography>
            {movies.length > 0 && (
              <Chip
                label={`${movies.length} loaded`}
                size="small"
                variant="outlined"
                sx={{ ml: 1, fontWeight: 600, fontSize: '0.75rem' }}
              />
            )}
          </Box>

          {/* Infinite Scroll vs Load More button toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={useInfiniteScroll}
                  onChange={(e) => setUseInfiniteScroll(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  {useInfiniteScroll ? 'Infinite Scroll ON' : 'Load More Button'}
                </Typography>
              }
            />
          </Box>
        </Box>

        {/* Error Alert with Retry */}
        {error && <ErrorAlert message={error} onRetry={() => fetchMoviesData(page, false)} />}

        {/* Movie Grid */}
        <MovieGrid
          movies={movies}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore && !useInfiniteScroll}
          onLoadMore={handleLoadMore}
          onResetSearch={handleResetAll}
          emptyMessage={query ? `No movies matching "${query}"` : 'No movies found for selected filters.'}
          emptySubtext="Try clearing your filters or searching with different keywords."
        />

        {/* Infinite Scroll Sentinel element */}
        {useInfiniteScroll && hasMore && (
          <Box
            ref={observerRef}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 4,
              color: 'text.secondary',
            }}
          >
            {loadingMore ? (
              <Typography variant="body2" fontWeight={600}>
                Loading more movies...
              </Typography>
            ) : (
              <Typography variant="caption">Scroll down to load more</Typography>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}
