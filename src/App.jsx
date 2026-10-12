import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeModeProvider } from './context/ThemeModeContext';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import TrendingPage from './pages/TrendingPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';

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
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/trending" element={<TrendingPage />} />
                  <Route path="/movie/:id" element={<MovieDetailsPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
              <Footer />
              <LoginModal />
            </Box>
          </BrowserRouter>
        </MovieProvider>
      </AuthProvider>
    </ThemeModeProvider>
  );
}

export default App;
