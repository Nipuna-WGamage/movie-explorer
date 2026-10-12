import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import MovieGrid from '../components/MovieGrid';
import { useMovie } from '../context/MovieContext';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useMovie();
  const navigate = useNavigate();

  const [searchFilter, setSearchFilter] = useState('');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const filteredFavorites = favorites.filter((movie) => {
    if (!searchFilter.trim()) return true;
    const title = (movie.title || movie.name || '').toLowerCase();
    return title.includes(searchFilter.trim().toLowerCase());
  });

  const handleConfirmClear = () => {
    clearFavorites();
    setConfirmClearOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '85vh' }}>
      {/* Header */}
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
            <FavoriteIcon sx={{ color: '#ef4444', fontSize: 32 }} />
            <Typography variant="h4" fontWeight={800}>
              My Favorite Movies
            </Typography>
            <Chip
              label={`${favorites.length} saved`}
              size="small"
              color="primary"
              sx={{ fontWeight: 700, ml: 1 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Your personal watchlist saved in local storage
          </Typography>
        </Box>

        {favorites.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', md: 'auto' } }}>
            <TextField
              size="small"
              placeholder="Search your favorites..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ minWidth: { xs: '100%', sm: 260 } }}
            />

            <Button
              variant="outlined"
              color="error"
              size="medium"
              startIcon={<DeleteSweepIcon />}
              onClick={() => setConfirmClearOpen(true)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Clear All
            </Button>
          </Box>
        )}
      </Box>

      {/* Grid of Favorites */}
      {favorites.length === 0 ? (
        <Box
          sx={{
            py: 12,
            px: 3,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            bgcolor: 'background.subtle',
            border: '2px dashed',
            borderColor: 'divider',
          }}
        >
          <FavoriteIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.4 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            No favorite movies yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 450, mb: 4 }}>
            Click the heart icon on any movie card or detail page to add movies to your personal collection.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ExploreIcon />}
            onClick={() => navigate('/')}
            sx={{ borderRadius: 3, fontWeight: 700, px: 4 }}
          >
            Explore Movies Now
          </Button>
        </Box>
      ) : (
        <MovieGrid
          movies={filteredFavorites}
          emptyMessage={`No saved favorites matching "${searchFilter}"`}
          emptySubtext="Try clearing the search filter above."
          onResetSearch={() => setSearchFilter('')}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmClearOpen} onClose={() => setConfirmClearOpen(false)}>
        <DialogTitle fontWeight={700}>Clear All Favorites?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove all {favorites.length} movies from your favorites list? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setConfirmClearOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmClear} color="error" variant="contained">
            Yes, Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
