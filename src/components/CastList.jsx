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

  const topCast = cast.slice(0, 15);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2.5,
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
              minWidth: 100,
              maxWidth: 100,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              src={photoUrl}
              alt={person.name}
              sx={{
                width: 76,
                height: 76,
                mb: 1,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                border: '2px solid',
                borderColor: 'divider',
              }}
            >
              {person.name?.[0]}
            </Avatar>
            <Typography variant="body2" fontWeight={600} lineHeight={1.2} noWrap title={person.name} sx={{ width: '100%' }}>
              {person.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              title={person.character}
              sx={{ width: '100%', fontSize: '0.7rem' }}
            >
              {person.character || 'Actor'}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
