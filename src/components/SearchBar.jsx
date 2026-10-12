import React, { useState, useEffect } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Chip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import RestoreIcon from '@mui/icons-material/Restore';
import { useMovie } from '../context/MovieContext';

export default function SearchBar({ onSearch, activeQuery = '' }) {
  const { lastSearchQuery, recentSearches, removeRecentSearch } = useMovie();
  const [inputValue, setInputValue] = useState(activeQuery);

  useEffect(() => {
    setInputValue(activeQuery);
  }, [activeQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  const handleSelectRecent = (query) => {
    setInputValue(query);
    onSearch(query);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 780, mx: 'auto', mb: 3 }}>
      {/* Search Input Box */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 3,
          backgroundColor: 'background.paper',
          border: '2px solid',
          borderColor: inputValue ? 'primary.main' : 'divider',
          transition: 'all 0.25s ease',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          '&:hover': {
            borderColor: 'primary.light',
          },
        }}
      >
        <IconButton sx={{ p: '10px', color: 'primary.main' }} aria-label="search" type="submit">
          <SearchIcon fontSize="medium" />
        </IconButton>

        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 500,
          }}
          placeholder="Search movies (e.g., Inception, Avengers)..."
          inputProps={{ 'aria-label': 'search movies' }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        {inputValue && (
          <IconButton sx={{ p: '8px' }} aria-label="clear" onClick={handleClear} size="small">
            <ClearIcon fontSize="small" />
          </IconButton>
        )}

        <IconButton
          type="submit"
          sx={{
            bgcolor: 'primary.main',
            color: '#fff',
            borderRadius: 2.5,
            px: 2.5,
            py: 1,
            ml: 0.5,
            display: { xs: 'none', sm: 'inline-flex' },
            fontSize: '0.9rem',
            fontWeight: 600,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Search
        </IconButton>
      </Paper>

      {/* Quick History / Last Searched persistence indicator */}
      <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
        {lastSearchQuery && (
          <Chip
            size="small"
            icon={<RestoreIcon sx={{ '&&': { fontSize: '0.95rem' } }} />}
            label={`Last search: "${lastSearchQuery}"`}
            onClick={() => handleSelectRecent(lastSearchQuery)}
            color="primary"
            variant={activeQuery === lastSearchQuery ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600, cursor: 'pointer' }}
          />
        )}

        {recentSearches && recentSearches.length > 0 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1, color: 'text.secondary' }}>
              <HistoryIcon sx={{ fontSize: '0.95rem' }} />
              <Typography variant="caption" fontWeight={600}>
                Recent:
              </Typography>
            </Box>

            {recentSearches.slice(0, 4).map((query) => (
              <Chip
                key={query}
                size="small"
                label={query}
                onClick={() => handleSelectRecent(query)}
                onDelete={() => removeRecentSearch(query)}
                variant="outlined"
                sx={{
                  cursor: 'pointer',
                  borderColor: 'divider',
                  bgcolor: 'background.subtle',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
}
