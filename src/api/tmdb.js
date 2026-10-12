import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZES = {
  sm: `${IMAGE_BASE_URL}/w342`,
  md: `${IMAGE_BASE_URL}/w500`,
  lg: `${IMAGE_BASE_URL}/w780`,
  original: `${IMAGE_BASE_URL}/original`,
};
export const BACKDROP_SIZES = {
  sm: `${IMAGE_BASE_URL}/w780`,
  md: `${IMAGE_BASE_URL}/w1280`,
  original: `${IMAGE_BASE_URL}/original`,
};
export const PROFILE_SIZES = {
  sm: `${IMAGE_BASE_URL}/w185`,
  md: `${IMAGE_BASE_URL}/h632`,
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
  timeout: 10000,
});

/**
 * Fetch trending movies
 * @param {'day' | 'week'} timeWindow
 * @param {number} page
 */
export const getTrendingMovies = async (timeWindow = 'week', page = 1) => {
  try {
    const response = await apiClient.get(`/trending/movie/${timeWindow}`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch trending movies');
  }
};

/**
 * Search movies by keyword
 * @param {string} query
 * @param {number} page
 */
export const searchMovies = async (query, page = 1) => {
  if (!query || query.trim() === '') return { results: [], page: 1, total_pages: 0, total_results: 0 };
  try {
    const response = await apiClient.get('/search/movie', {
      params: {
        query: query.trim(),
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, `Failed to search movies for "${query}"`);
  }
};

/**
 * Get detailed movie info including cast, crew, videos, and recommendations
 * @param {number|string} id
 */
export const getMovieDetails = async (id) => {
  try {
    const response = await apiClient.get(`/movie/${id}`, {
      params: {
        append_to_response: 'credits,videos,recommendations,similar',
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch movie details');
  }
};

/**
 * Get official TMDB movie genre list
 */
export const getMovieGenres = async () => {
  try {
    const response = await apiClient.get('/genre/movie/list');
    return response.data.genres || [];
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch movie genres');
  }
};

/**
 * Discover movies with custom filters (genre, year, min rating, sorting)
 */
export const discoverMovies = async ({
  genreId,
  year,
  minRating,
  sortBy = 'popularity.desc',
  page = 1,
} = {}) => {
  try {
    const params = {
      page,
      sort_by: sortBy,
      include_adult: false,
    };
    if (genreId) params.with_genres = genreId;
    if (year) params.primary_release_year = year;
    if (minRating) {
      params['vote_average.gte'] = minRating;
      params['vote_count.gte'] = 50; // Filter out movies with too few votes
    }

    const response = await apiClient.get('/discover/movie', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to filter movies');
  }
};

/**
 * Standardized API error helper with user-friendly error messages
 */
function handleApiError(error, fallbackMessage) {
  if (error.response) {
    const status = error.response.status;
    const msg = error.response.data?.status_message || error.response.statusText;
    if (status === 401) {
      return new Error('Invalid TMDB API Key. Please verify authorization.');
    }
    if (status === 404) {
      return new Error('The requested movie could not be found.');
    }
    return new Error(`${fallbackMessage}: ${msg} (${status})`);
  } else if (error.request) {
    return new Error('Network error. Please check your internet connection.');
  }
  return new Error(error.message || fallbackMessage);
}
