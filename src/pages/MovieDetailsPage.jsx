/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
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
import { useThemeMode } from '../context/ThemeModeContext';
import {
  getMovieDetails,
  POSTER_SIZES,
  BACKDROP_SIZES,
} from '../api/tmdb';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovie();
  const { isDark } = useThemeMode();

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
        <Skeleton variant="text" width={140} height={40} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Skeleton variant="rectangular" sx={{ width: { xs: '100%', md: 320 }, height: 480, borderRadius: 4 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" height={60} width="60%" />
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
      {/* Cinematic Hero Section */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          bgcolor: 'background.default',
        }}
      >
        {/* Dynamic Theme Ambient Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: isDark
              ? {
                  xs: 'linear-gradient(to bottom, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.98) 100%)',
                  md: 'linear-gradient(to right, rgba(11, 15, 25, 0.98) 0%, rgba(11, 15, 25, 0.92) 45%, rgba(11, 15, 25, 0.65) 100%), linear-gradient(to top, rgba(11, 15, 25, 1) 0%, rgba(11, 15, 25, 0.5) 50%, rgba(11, 15, 25, 0.8) 100%)',
                }
              : {
                  xs: 'linear-gradient(to bottom, rgba(248, 250, 252, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
                  md: 'linear-gradient(to right, rgba(248, 250, 252, 0.98) 0%, rgba(248, 250, 252, 0.92) 48%, rgba(248, 250, 252, 0.6) 100%), linear-gradient(to top, #f8fafc 0%, rgba(248, 250, 252, 0.4) 50%, rgba(248, 250, 252, 0.85) 100%)',
                },
          }}
        />

        {/* Hero Content Container */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pt: { xs: 3, md: 4 }, pb: { xs: 4, md: 6 } }}>
          {/* Frosted Glass Back Pill */}
          <Button
            startIcon={<ArrowBackIcon sx={{ fontSize: '1.1rem' }} />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 3,
              px: 2.2,
              py: 0.7,
              borderRadius: '50px',
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
              color: isDark ? '#ffffff' : '#0f172a',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 14px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.22)' : '#ffffff',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.18)',
                transform: 'translateX(-4px)',
                boxShadow: isDark ? '0 6px 20px rgba(0, 0, 0, 0.4)' : '0 6px 18px rgba(0, 0, 0, 0.12)',
              },
            }}
          >
            Back to Movies
          </Button>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: { xs: 4, md: 5 },
            }}
          >
            {/* Left Column: High-Res Poster & Action Buttons */}
            <Box
              sx={{
                width: { xs: 260, sm: 300, md: 320 },
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {posterUrl ? (
                <Box
                  component="img"
                  src={posterUrl}
                  alt={title}
                  sx={{
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.7)' : '0 20px 40px rgba(15, 23, 42, 0.18)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 450,
                    bgcolor: 'background.subtle',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  No Poster Available
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ mt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
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
                      boxShadow: '0 8px 25px rgba(229, 9, 20, 0.45)',
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
                    bgcolor: favorited
                      ? '#ef4444'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : '#ffffff',
                    borderColor: favorited
                      ? 'transparent'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 0, 0, 0.15)',
                    color: favorited ? '#fff' : isDark ? '#fff' : '#0f172a',
                    boxShadow: !favorited && !isDark ? '0 2px 10px rgba(0, 0, 0, 0.06)' : 'none',
                    '&:hover': {
                      bgcolor: favorited
                        ? '#dc2626'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {favorited ? 'Saved in Favorites' : 'Add to Favorites'}
                </Button>
              </Box>
            </Box>

            {/* Right Column: Title, Quick Meta, Overview & Details */}
            <Box sx={{ flexGrow: 1, width: '100%' }}>
              {/* Title & Tagline */}
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
                  fontWeight: 800,
                  color: isDark ? '#ffffff' : '#0f172a',
                  lineHeight: 1.15,
                  textShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.7)' : 'none',
                }}
              >
                {title}
              </Typography>

              {tagline && (
                <Typography
                  variant="h6"
                  sx={{
                    color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#475569',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    mt: 1,
                    mb: 2.5,
                    fontSize: { xs: '0.95rem', md: '1.15rem' },
                  }}
                >
                  "{tagline}"
                </Typography>
              )}

              {/* Meta & Rating Row */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 2.5,
                  mt: tagline ? 0 : 2,
                }}
              >
                {releaseYear && (
                  <Chip
                    icon={<CalendarMonthIcon sx={{ '&&': { color: isDark ? '#fff' : '#475569', fontSize: '1rem' } }} />}
                    label={releaseYear}
                    sx={{
                      fontWeight: 700,
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.85)',
                      color: isDark ? '#fff' : '#0f172a',
                      border: isDark ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  />
                )}

                {runtime > 0 && (
                  <Chip
                    icon={<AccessTimeIcon sx={{ '&&': { color: isDark ? '#fff' : '#475569', fontSize: '1rem' } }} />}
                    label={formattedRuntime}
                    sx={{
                      fontWeight: 700,
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.85)',
                      color: isDark ? '#fff' : '#0f172a',
                      border: isDark ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  />
                )}

                {movie.original_language && (
                  <Chip
                    icon={<LanguageIcon sx={{ '&&': { color: isDark ? '#fff' : '#475569', fontSize: '1rem' } }} />}
                    label={movie.original_language.toUpperCase()}
                    sx={{
                      fontWeight: 700,
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.85)',
                      color: isDark ? '#fff' : '#0f172a',
                      border: isDark ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  />
                )}

                {/* Star Rating Badge */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.8,
                    bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.12)',
                    border: isDark ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(245, 158, 11, 0.35)',
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.4,
                  }}
                >
                  <StarIcon sx={{ color: '#fbbf24', fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={800} sx={{ color: isDark ? '#fbbf24' : '#b45309' }}>
                    {vote_average ? vote_average.toFixed(1) : 'NR'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#64748b' }}>
                    / 10 ({vote_count ? vote_count.toLocaleString() : 0} votes)
                  </Typography>
                </Box>
              </Box>

              {/* Genre Pills */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: isDark ? 'rgba(229, 9, 20, 0.2)' : 'rgba(229, 9, 20, 0.08)',
                      color: isDark ? '#ff6b6b' : '#e50914',
                      border: isDark ? '1px solid rgba(229, 9, 20, 0.35)' : '1px solid rgba(229, 9, 20, 0.25)',
                    }}
                  />
                ))}
              </Box>

              {/* Overview / Storyline */}
              <Box sx={{ mb: 4, maxWidth: 900 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ color: isDark ? '#ffffff' : '#0f172a', mb: 1 }}>
                  Overview
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDark ? 'rgba(255, 255, 255, 0.85)' : '#334155',
                    lineHeight: 1.8,
                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                  }}
                >
                  {overview || 'No synopsis provided for this title.'}
                </Typography>
              </Box>

              {/* Director & Key Crew */}
              {credits.crew && credits.crew.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748b',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'block',
                      mb: 1,
                    }}
                  >
                    Director & Key Crew
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {credits.crew
                      .filter((c) => ['Director', 'Screenplay', 'Writer', 'Producer'].includes(c.job))
                      .slice(0, 5)
                      .map((crewMember, idx) => (
                        <Chip
                          key={`${crewMember.id}-${idx}`}
                          label={`${crewMember.name} • ${crewMember.job}`}
                          size="small"
                          sx={{
                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.85)',
                            color: isDark ? 'rgba(255, 255, 255, 0.9)' : '#334155',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
                            boxShadow: isDark ? 'none' : '0 2px 6px rgba(0, 0, 0, 0.03)',
                          }}
                        />
                      ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Lower Sections: Cast & Recommendations */}
      <Container maxWidth="xl" sx={{ mt: 5 }}>
        {/* Top Billed Cast Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Top Billed Cast
          </Typography>
          <CastList cast={credits.cast || []} />
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Recommended Movies Section */}
        {recommendations.results && recommendations.results.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              Recommended Movies
            </Typography>
            <MovieGrid movies={recommendations.results.slice(0, 10)} />
          </Box>
        )}
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
