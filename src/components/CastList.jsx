import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { PROFILE_SIZES } from '../api/tmdb';

export default function CastList({ cast = [] }) {
  if (!cast || cast.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Cast information not available.
      </Typography>
    );
  }

  const topCast = cast.slice(0, 16);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        pb: 2,
        pt: 1,
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(150, 150, 150, 0.3)',
          borderRadius: 3,
        },
      }}
    >
      {topCast.map((person) => {
        const photoUrl = person.profile_path ? `${PROFILE_SIZES.sm}${person.profile_path}` : null;
        return (
          <Box
            key={`${person.id}-${person.cast_id || person.credit_id}`}
            sx={{
              minWidth: 120,
              maxWidth: 120,
              p: 1.5,
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <Avatar
              src={photoUrl}
              alt={person.name}
              sx={{
                width: 72,
                height: 72,
                mb: 1.2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                border: '2px solid',
                borderColor: 'divider',
              }}
            >
              {person.name?.[0]}
            </Avatar>
            <Typography
              variant="body2"
              fontWeight={700}
              lineHeight={1.25}
              sx={{
                width: '100%',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: '0.82rem',
                mb: 0.5,
              }}
              title={person.name}
            >
              {person.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                width: '100%',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: '0.72rem',
                lineHeight: 1.2,
              }}
              title={person.character}
            >
              {person.character || 'Actor'}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
