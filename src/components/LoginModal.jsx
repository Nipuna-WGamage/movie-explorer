import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { useAuth } from '../context/AuthContext';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      login(username, password);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleDemoFill = () => {
    setUsername('CinephileExplorer');
    setPassword('movie123');
    setError('');
  };

  return (
    <Dialog
      open={isLoginModalOpen}
      onClose={closeLoginModal}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(229, 9, 20, 0.4)',
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Sign In
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Access your personalized movie library
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={closeLoginModal} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 3, pt: 1, pb: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ mb: 2 }}
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
            margin="dense"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box
            sx={{
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
              Demo account available
            </Typography>
            <Button size="small" variant="text" onClick={handleDemoFill} sx={{ py: 0.5, px: 1, fontSize: '0.75rem' }}>
              Auto-fill Demo
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button onClick={closeLoginModal} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Sign In
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
