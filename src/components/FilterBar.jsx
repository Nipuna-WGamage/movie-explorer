import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Typography,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useMovie } from '../context/MovieContext';

const selectMenuProps = {
  sx: {
    '& .MuiPaper-root': {
      maxHeight: '250px !important',
      overflowY: 'auto !important',
    },
  },
  PaperProps: {
    sx: {
      borderRadius: 2,
      mt: 0.5,
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
      scrollbarWidth: 'thin',
      '&::-webkit-scrollbar': { width: 6 },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(150, 150, 150, 0.3)',
        borderRadius: 3,
      },
    },
  },
  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  transformOrigin: { vertical: 'top', horizontal: 'left' },
};

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  hasActiveFilters,
}) {
  const { genres } = useMovie();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        mb: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterAltIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700}>
            Filter & Refine Movies
          </Typography>
        </Box>

        {hasActiveFilters && (
          <Button
            size="small"
            variant="text"
            color="primary"
            startIcon={<RestartAltIcon />}
            onClick={onResetFilters}
            sx={{ fontWeight: 600, fontSize: '0.8rem' }}
          >
            Reset Filters
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {/* Genre Selector */}
        <FormControl size="small" fullWidth>
          <InputLabel id="genre-select-label">Genre</InputLabel>
          <Select
            labelId="genre-select-label"
            id="genre-select"
            value={filters.genreId || ''}
            label="Genre"
            onChange={(e) => onFilterChange('genreId', e.target.value)}
            MenuProps={selectMenuProps}
          >
            <MenuItem value="">
              <em>All Genres</em>
            </MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Release Year */}
        <FormControl size="small" fullWidth>
          <InputLabel id="year-select-label">Release Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={filters.year || ''}
            label="Release Year"
            onChange={(e) => onFilterChange('year', e.target.value)}
            MenuProps={selectMenuProps}
          >
            <MenuItem value="">
              <em>All Years</em>
            </MenuItem>
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Minimum Rating */}
        <FormControl size="small" fullWidth>
          <InputLabel id="rating-select-label">Min Rating</InputLabel>
          <Select
            labelId="rating-select-label"
            id="rating-select"
            value={filters.minRating || ''}
            label="Min Rating"
            onChange={(e) => onFilterChange('minRating', e.target.value)}
            MenuProps={selectMenuProps}
          >
            <MenuItem value="">
              <em>Any Rating</em>
            </MenuItem>
            <MenuItem value="8">★ 8.0+ (Masterpieces)</MenuItem>
            <MenuItem value="7">★ 7.0+ (Highly Rated)</MenuItem>
            <MenuItem value="6">★ 6.0+ (Decent)</MenuItem>
            <MenuItem value="5">★ 5.0+ (Average)</MenuItem>
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl size="small" fullWidth>
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={filters.sortBy || 'popularity.desc'}
            label="Sort By"
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            MenuProps={selectMenuProps}
          >
            <MenuItem value="popularity.desc">Most Popular</MenuItem>
            <MenuItem value="vote_average.desc">Highest Rated</MenuItem>
            <MenuItem value="primary_release_date.desc">Newest Releases</MenuItem>
            <MenuItem value="revenue.desc">Top Box Office</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Quick genre pill bar */}
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center', mr: 0.5, fontWeight: 600 }}>
          Popular:
        </Typography>
        {genres.slice(0, 7).map((g) => {
          const isSelected = String(filters.genreId) === String(g.id);
          return (
            <Chip
              key={g.id}
              label={g.name}
              size="small"
              clickable
              color={isSelected ? 'primary' : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              onClick={() => onFilterChange('genreId', isSelected ? '' : g.id)}
              sx={{ fontSize: '0.75rem', fontWeight: isSelected ? 700 : 500 }}
            />
          );
        })}
      </Box>
    </Box>
  );
}
