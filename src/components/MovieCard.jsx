import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import { useMovie } from '../context/MovieContext';
import { POSTER_SIZES } from '../api/tmdb';

export default function MovieCard({ movie, onOpenTrailer }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, getGenreName } = useMovie();

  if (!movie) return null;

  const {
    id,
    title,
    name,
    poster_path,
    release_date,
    first_air_date,
    vote_average,
    genre_ids,
  } = movie;

  const displayTitle = title || name || 'Untitled';
  const releaseYear = (release_date || first_air_date || '').slice(0, 4) || 'N/A';
  const rating = typeof vote_average === 'number' ? vote_average.toFixed(1) : 'NR';
  const favorited = isFavorite(id);

  const posterUrl = poster_path ? `${POSTER_SIZES.md}${poster_path}` : null;

  const handleCardClick = () => {
    navigate(`/movie/${id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const getRatingColor = (score) => {
    const num = parseFloat(score);
    if (isNaN(num)) return 'default';
    if (num >= 7.5) return '#10b981'; // Emerald
    if (num >= 6.0) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.5)',
          '& .movie-poster': {
            transform: 'scale(1.06)',
          },
          '& .card-overlay': {
            opacity: 1,
          },
        },
      }}
    >
      {/* Poster Container */}
      <Box sx={{ position: 'relative', paddingTop: '150%', overflow: 'hidden', bgcolor: 'background.subtle' }}>
        {posterUrl ? (
          <CardMedia
            component="img"
            image={posterUrl}
            alt={displayTitle}
            className="movie-poster"
            loading="lazy"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              textAlign: 'center',
              bgcolor: 'background.subtle',
              color: 'text.secondary',
            }}
          >
            <MovieFilterIcon sx={{ fontSize: 50, mb: 1, opacity: 0.5 }} />
            <Typography variant="body2" fontWeight={600}>
              {displayTitle}
            </Typography>
            <Typography variant="caption">No Poster Available</Typography>
          </Box>
        )}

        {/* Top Badges: Rating & Favorite */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          {/* Rating Badge */}
          <Chip
            size="small"
            icon={<StarIcon sx={{ '&&': { color: '#fbbf24', fontSize: '0.9rem' } }} />}
            label={rating}
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.85)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.75rem',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${getRatingColor(rating)}`,
              px: 0.5,
            }}
          />

          {/* Favorite Heart Button */}
          <Tooltip title={favorited ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton
              onClick={handleFavoriteClick}
              size="small"
              sx={{
                bgcolor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                color: favorited ? '#ef4444' : 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  transform: 'scale(1.15)',
                },
              }}
            >
              {favorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Hover Gradient Overlay */}
        <Box
          className="card-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.4) 50%, transparent 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 2,
            zIndex: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.85)',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.75rem',
              lineHeight: 1.4,
              mb: 1,
            }}
          >
            {movie.overview || 'Click for full details and trailers.'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 600 }}>
            View Full Details →
          </Typography>
        </Box>
      </Box>

      {/* Card Details */}
      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography
            variant="subtitle1"
            component="h3"
            fontWeight={700}
            lineHeight={1.25}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 0.5,
            }}
            title={displayTitle}
          >
            {displayTitle}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {releaseYear}
            </Typography>

            {genre_ids && genre_ids.length > 0 && (
              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: '55%' }}>
                {getGenreName(genre_ids[0]) || ''}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
