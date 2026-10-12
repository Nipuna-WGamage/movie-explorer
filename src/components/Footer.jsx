import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MovieCreationIcon color="primary" fontSize="small" />
            <Typography variant="body2" fontWeight={700}>
              Movie Explorer
            </Typography>
            <Typography variant="caption" color="text.secondary">
              — Built for Loons Lab Challenge
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
