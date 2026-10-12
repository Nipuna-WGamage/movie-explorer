import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeModeProvider } from './context/ThemeModeContext';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const HomePage = lazy(() => import('./pages/HomePage'));
const TrendingPage = lazy(() => import('./pages/TrendingPage'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const LoginModal = lazy(() => import('./components/LoginModal'));

const routeFallback = (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '40vh',
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <MovieProvider>
          <BrowserRouter>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'background.default',
                color: 'text.primary',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
            >
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Suspense fallback={routeFallback}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/trending" element={<TrendingPage />} />
                    <Route path="/movie/:id" element={<MovieDetailsPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </Box>
              <Footer />
              <Suspense fallback={null}>
                <LoginModal />
              </Suspense>
            </Box>
          </BrowserRouter>
        </MovieProvider>
      </AuthProvider>
    </ThemeModeProvider>
  );
}

export default App;