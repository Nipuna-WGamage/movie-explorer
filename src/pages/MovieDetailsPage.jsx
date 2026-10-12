import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Rating,
  Skeleton,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarIcon from '@mui/icons-material/Star';
import LanguageIcon from '@mui/icons-material/Language';
import CastList from '../components/CastList';
import TrailerModal from '../components/TrailerModal';
import MovieGrid from '../components/MovieGrid';
import ErrorAlert from '../components/ErrorAlert';
import { useMovie } from '../context/MovieContext';
import {
  getMovieDetails,
  POSTER_SIZES,
  BACKDROP_SIZES,
} from '../api/tmdb';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovie();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    getMovieDetails(id)
      .then((data) => {
        if (isMounted) {
          setMovie(data);
          // Look for best official trailer in videos
          const videos = data.videos?.results || [];
          const trailer =
            videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official && v.iso_639_1 === 'en') ||
            videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
            videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
            videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
            videos.find((v) => v.site === 'YouTube');
          setTrailerKey(trailer ? trailer.key : null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load movie details.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="text" width={120} height={40} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Skeleton variant="rectangular" sx={{ width: { xs: '100%', md: 360 }, height: 500, borderRadius: 4 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" height={60} width="70%" />
            <Skeleton variant="text" height={30} width="40%" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={100} sx={{ mb: 3, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (error || !movie) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Back to browsing
        </Button>
        <ErrorAlert message={error || 'Movie not found.'} onRetry={() => window.location.reload()} />
      </Container>
    );
  }

  const {
    title,
    original_title,
    tagline,
    overview,
    poster_path,
    backdrop_path,
    release_date,
    runtime,
    vote_average,
    vote_count,
    genres = [],
    credits = {},
    recommendations = {},
  } = movie;

  const favorited = isFavorite(movie.id);
  const releaseYear = (release_date || '').slice(0, 4);
  const formattedRuntime = runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : 'N/A';
  const posterUrl = poster_path ? `${POSTER_SIZES.lg}${poster_path}` : null;
  const backdropUrl = backdrop_path ? `${BACKDROP_SIZES.original}${backdrop_path}` : null;

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      {/* Cinematic Hero Backdrop */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: 450, md: 540 },
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {/* Dark Vignette Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(11, 15, 25, 1) 0%, rgba(11, 15, 25, 0.75) 45%, rgba(11, 15, 25, 0.35) 100%)',
          }}
        />

        {/* Back Button */}
        <Container maxWidth="xl" sx={{ position: 'absolute', top: 20, left: 0, right: 0, zIndex: 10 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="contained"
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.95)' },
            }}
          >
            Back
          </Button>
        </Container>

        {/* Hero Title and quick meta */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, pb: 4, pt: 12 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.6rem' },
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.15,
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            }}
          >
            {title}
          </Typography>
          {tagline && (
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontStyle: 'italic',
                fontWeight: 400,
                mt: 1,
                fontSize: { xs: '1rem', md: '1.2rem' },
              }}
            >
              "{tagline}"
            </Typography>
          )}
        </Container>
      </Box>

      {/* Main Details Body */}
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 5 } }}>
          {/* Left Column: Poster & Quick Action Buttons */}
          <Box sx={{ width: { xs: '100%', sm: 300, md: 340 }, flexShrink: 0, mx: { xs: 'auto', md: 0 } }}>
            {posterUrl ? (
              <Box
                component="img"
                src={posterUrl}
                alt={title}
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: 480,
                  bgcolor: 'background.subtle',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                No Poster
              </Box>
            )}

            {/* Actions: Watch Trailer & Add to Favorites */}
            <Box sx={{ mt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {trailerKey ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => setTrailerOpen(true)}
                  sx={{
                    py: 1.4,
                    fontWeight: 700,
                    borderRadius: 3,
                    boxShadow: '0 8px 25px rgba(229, 9, 20, 0.4)',
                  }}
                >
                  Watch Official Trailer
                </Button>
              ) : (
                <Button variant="outlined" disabled size="large" sx={{ py: 1.4, borderRadius: 3 }}>
                  No Trailer Available
                </Button>
              )}

              <Button
                variant={favorited ? 'contained' : 'outlined'}
                color={favorited ? 'error' : 'inherit'}
                size="large"
                startIcon={favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={() => toggleFavorite(movie)}
                sx={{
                  py: 1.4,
                  borderRadius: 3,
                  fontWeight: 700,
                  bgcolor: favorited ? '#ef4444' : undefined,
                  '&:hover': {
                    bgcolor: favorited ? '#dc2626' : undefined,
                  },
                }}
              >
                {favorited ? 'Saved in Favorites' : 'Add to Favorites'}
              </Button>
            </Box>
          </Box>

          {/* Right Column: Detailed Movie Information */}
          <Box sx={{ flexGrow: 1 }}>
            {/* Meta Tags: Year, Runtime, Ratings, Language */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 3 }}>
              {releaseYear && (
                <Chip
                  icon={<CalendarMonthIcon fontSize="small" />}
                  label={releaseYear}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
              {runtime > 0 && (
                <Chip
                  icon={<AccessTimeIcon fontSize="small" />}
                  label={formattedRuntime}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
              {movie.original_language && (
                <Chip
                  icon={<LanguageIcon fontSize="small" />}
                  label={movie.original_language.toUpperCase()}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}

              {/* Rating Star Chip */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { xs: 0, sm: 'auto' } }}>
                <StarIcon sx={{ color: '#fbbf24', fontSize: 26 }} />
                <Typography variant="h6" fontWeight={800}>
                  {vote_average ? vote_average.toFixed(1) : 'NR'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({vote_count ? vote_count.toLocaleString() : 0} votes)
                </Typography>
              </Box>
            </Box>

            {/* Genres */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {genres.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  color="primary"
                  variant="filled"
                  sx={{
                    fontWeight: 700,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
              ))}
            </Box>

            {/* Overview / Storyline */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Overview
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  fontSize: '1.05rem',
                }}
              >
                {overview || 'No synopsis provided for this title.'}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Cast & Crew Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Top Billed Cast
              </Typography>
              <CastList cast={credits.cast || []} />
            </Box>

            {/* Director & Key Crew */}
            {credits.crew && credits.crew.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
                  Director & Key Crew:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {credits.crew
                    .filter((c) => ['Director', 'Screenplay', 'Writer', 'Producer'].includes(c.job))
                    .slice(0, 4)
                    .map((crewMember, idx) => (
                      <Chip
                        key={`${crewMember.id}-${idx}`}
                        label={`${crewMember.name} (${crewMember.job})`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                </Box>
              </Box>
            )}

            {/* Recommendations / Similar Movies */}
            {recommendations.results && recommendations.results.length > 0 && (
              <Box sx={{ mt: 5 }}>
                <Typography variant="h6" fontWeight={800} gutterBottom>
                  Recommended Movies
                </Typography>
                <MovieGrid movies={recommendations.results.slice(0, 5)} />
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* Trailer Dialog Modal */}
      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        videoKey={trailerKey}
        title={title}
      />
    </Box>
  );
}
