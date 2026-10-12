import React, { useRef } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, IconButton, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import { PROFILE_SIZES } from '../api/tmdb';

export default function CastList({ cast = [] }) {
  const scrollRef = useRef(null);

  if (!cast || cast.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Cast information not available.
      </Typography>
    );
  }

  const topCast = cast.slice(0, 18);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ position: 'relative', my: 2 }}>
      {/* Scroll Navigation Buttons */}
      <Tooltip title="Scroll left">
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            left: -16,
            top: '42%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            border: '1px solid',
            borderColor: 'divider',
            display: { xs: 'none', sm: 'inline-flex' },
            '&:hover': {
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) scale(1.1)',
            },
          }}
          size="small"
        >
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Scroll right">
        <IconButton
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            right: -16,
            top: '42%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            border: '1px solid',
            borderColor: 'divider',
            display: { xs: 'none', sm: 'inline-flex' },
            '&:hover': {
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) scale(1.1)',
            },
          }}
          size="small"
        >
          <ChevronRightIcon />
        </IconButton>
      </Tooltip>

      {/* Horizontal Cast Row */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 2.2,
          overflowX: 'auto',
          py: 1.5,
          px: 0.5,
          scrollBehavior: 'smooth',
          // Hide native scrollbar for ultra-clean look
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {topCast.map((person) => {
          const photoUrl = person.profile_path ? `${PROFILE_SIZES.sm}${person.profile_path}` : null;

          return (
            <Card
              key={`${person.id}-${person.cast_id || person.credit_id}`}
              sx={{
                minWidth: 145,
                maxWidth: 145,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2.5,
                overflow: 'hidden',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
                  borderColor: 'primary.light',
                  '& .cast-image': {
                    transform: 'scale(1.06)',
                  },
                },
              }}
            >
              {/* Actor Portrait Image */}
              <Box sx={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden', bgcolor: 'background.subtle' }}>
                {photoUrl ? (
                  <CardMedia
                    component="img"
                    image={photoUrl}
                    alt={person.name}
                    className="cast-image"
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'text.secondary',
                      bgcolor: 'background.subtle',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 50, opacity: 0.4 }} />
                  </Box>
                )}
              </Box>

              {/* Actor Info */}
              <CardContent
                sx={{
                  p: 1.5,
                  pb: 2,
                  minHeight: 88,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  '&:last-child': { pb: 2 },
                }}
              >
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
                    fontSize: '0.86rem',
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
                    fontSize: '0.74rem',
                    lineHeight: 1.25,
                  }}
                  title={person.character}
                >
                  {person.character || 'Actor'}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
