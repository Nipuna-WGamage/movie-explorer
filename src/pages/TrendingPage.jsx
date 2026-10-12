import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Tabs, Tab, Chip } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MovieGrid from '../components/MovieGrid';
import ErrorAlert from '../components/ErrorAlert';
import { getTrendingMovies } from '../api/tmdb';

export default function TrendingPage() {
  const [timeWindow, setTimeWindow] = useState('week'); // 'day' | 'week'
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrending = useCallback(
    async (window, currentPage = 1, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const data = await getTrendingMovies(window, currentPage);
        setTotalPages(data.total_pages || 1);

        if (append) {
          setMovies((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newItems = (data.results || []).filter((m) => !existingIds.has(m.id));
            return [...prev, ...newItems];
          });
        } else {
          setMovies(data.results || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load trending movies.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    fetchTrending(timeWindow, 1, false);
  }, [timeWindow, fetchTrending]);

  const handleTimeChange = (e, newValue) => {
    setTimeWindow(newValue);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTrending(timeWindow, nextPage, true);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '85vh' }}>
      {/* Header & Tabs */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          mb: 4,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <WhatshotIcon sx={{ color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4" fontWeight={800}>
              Trending Movies
            </Typography>
            <Chip
              label={timeWindow === 'day' ? 'Today' : 'This Week'}
              size="small"
              color="primary"
              sx={{ fontWeight: 700, ml: 1 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Discover what audiences are watching worldwide right now
          </Typography>
        </Box>

        {/* Time Window Switcher */}
        <Tabs
          value={timeWindow}
          onChange={handleTimeChange}
          sx={{
            bgcolor: 'background.paper',
            p: 0.5,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            '& .MuiTabs-indicator': {
              borderRadius: 2,
              height: '100%',
              bgcolor: 'primary.main',
              zIndex: 0,
            },
          }}
        >
          <Tab
            value="day"
            label="Today"
            icon={<TodayIcon fontSize="small" />}
            iconPosition="start"
            sx={{
              zIndex: 1,
              fontWeight: 700,
              borderRadius: 2.5,
              minHeight: 40,
              textTransform: 'none',
              '&.Mui-selected': { color: '#fff' },
            }}
          />
          <Tab
            value="week"
            label="This Week"
            icon={<DateRangeIcon fontSize="small" />}
            iconPosition="start"
            sx={{
              zIndex: 1,
              fontWeight: 700,
              borderRadius: 2.5,
              minHeight: 40,
              textTransform: 'none',
              '&.Mui-selected': { color: '#fff' },
            }}
          />
        </Tabs>
      </Box>

      {/* Error alert */}
      {error && <ErrorAlert message={error} onRetry={() => fetchTrending(timeWindow, page, false)} />}

      {/* Grid */}
      <MovieGrid
        movies={movies}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={page < totalPages}
        onLoadMore={handleLoadMore}
        emptyMessage="No trending movies available at the moment."
      />
    </Container>
  );
}
