import { Box, Typography, Skeleton, Button, CircularProgress } from '@mui/material';
import MovieCard from './MovieCard';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function MovieGrid({
  movies = [],
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  emptyMessage = 'No movies found.',
  emptySubtext = 'Try adjusting your search query or filters.',
  onResetSearch,
}) {
  if (loading && (!movies || movies.length === 0)) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
          my: 3,
        }}
      >
        {Array.from(new Array(10)).map((_, index) => (
          <Box key={index} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Skeleton variant="rectangular" sx={{ paddingTop: '150%', borderRadius: 3 }} animation="wave" />
            <Box sx={{ pt: 1.5 }}>
              <Skeleton width="85%" height={24} animation="wave" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Skeleton width="30%" height={18} animation="wave" />
                <Skeleton width="40%" height={18} animation="wave" />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (!loading && (!movies || movies.length === 0)) {
    return (
      <Box
        sx={{
          py: 10,
          px: 2,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          bgcolor: 'background.subtle',
          border: '1px dashed',
          borderColor: 'divider',
          my: 4,
        }}
      >
        <SentimentDissatisfiedIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {emptyMessage}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mb: 3 }}>
          {emptySubtext}
        </Typography>
        {onResetSearch && (
          <Button variant="outlined" color="primary" onClick={onResetSearch}>
            Clear Search & Filters
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ my: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}-${movie.release_date || ''}`} movie={movie} />
        ))}
      </Box>

      {/* Load More Button Section */}
      {hasMore && onLoadMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={onLoadMore}
            disabled={loadingMore}
            startIcon={loadingMore ? <CircularProgress size={20} color="inherit" /> : <ExpandMoreIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(229, 9, 20, 0.3)',
            }}
          >
            {loadingMore ? 'Loading More Movies...' : 'Load More Movies'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
