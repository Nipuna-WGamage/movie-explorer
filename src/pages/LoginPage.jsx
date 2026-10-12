import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Paper sx={{ p: 5, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            You are already logged in!
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Go to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  };

  const handleDemoFill = () => {
    setUsername('CinephileExplorer');
    setPassword('movie123');
  };

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 3,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              mb: 1.5,
              boxShadow: '0 4px 16px rgba(229, 9, 20, 0.4)',
            }}
          >
            <MovieCreationIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight={800}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to manage your favorites & explore films
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            label="Username"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            margin="normal"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box
            sx={{
              my: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'background.subtle',
              border: '1px dashed',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Need credentials?
            </Typography>
            <Button size="small" variant="text" onClick={handleDemoFill} sx={{ py: 0.5, fontSize: '0.75rem' }}>
              Auto-fill Demo
            </Button>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 1, py: 1.4, borderRadius: 2.5, fontWeight: 700 }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
