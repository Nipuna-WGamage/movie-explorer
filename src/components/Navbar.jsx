import { useState } from 'react';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Badge,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExploreIcon from '@mui/icons-material/Explore';
import { useThemeMode } from '../context/ThemeModeContext';
import { useAuth } from '../context/AuthContext';
import { useMovie } from '../context/MovieContext';

export default function Navbar() {
  const { toggleThemeMode, isDark } = useThemeMode();
  const { user, isAuthenticated, logout, openLoginModal } = useAuth();
  const { favorites } = useMovie();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const navItems = [
    { label: 'Explore', path: '/', icon: <ExploreIcon fontSize="small" /> },
    { label: 'Trending', path: '/trending', icon: <WhatshotIcon fontSize="small" /> },
    {
      label: 'Favorites',
      path: '/favorites',
      icon: (
        <Badge badgeContent={favorites.length} color="primary" max={99}>
          <FavoriteIcon fontSize="small" />
        </Badge>
      ),
    },
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: 1100 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 } }}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 58, sm: 64, md: 70 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Left: Mobile Menu & Brand Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, sm: 1.5 } }}>
            {/* Mobile Hamburger Drawer Trigger */}
            <IconButton
              color="inherit"
              aria-label="open navigation drawer"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{
                p: { xs: 0.8, sm: 1 },
                display: { md: 'none' },
                color: 'text.primary',
              }}
            >
              <MenuIcon sx={{ fontSize: { xs: 24, sm: 26 } }} />
            </IconButton>

            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    fontSize: { xs: '1.05rem', sm: '1.25rem' },
                    background: 'linear-gradient(45deg, #e50914, #ff6b6b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.1,
                  }}
                >
                  Movie Explorer
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.65rem',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Powered by TMDB
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Center: Desktop Nav Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={RouterLink}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: 'text.primary',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  '&.active': {
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                    color: 'primary.main',
                  },
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right: Theme Toggle & Sign In */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, sm: 1.5 } }}>
            {/* Theme Switcher Button */}
            <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton
                onClick={toggleThemeMode}
                color="inherit"
                sx={{
                  p: { xs: 0.8, sm: 1 },
                  borderRadius: 2,
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                {isDark ? (
                  <Brightness7Icon sx={{ color: '#fbbf24', fontSize: { xs: 20, sm: 24 } }} />
                ) : (
                  <Brightness4Icon sx={{ color: '#475569', fontSize: { xs: 20, sm: 24 } }} />
                )}
              </IconButton>
            </Tooltip>

            {/* Auth Section */}
            {isAuthenticated ? (
              <>
                <Tooltip title={`Signed in as ${user.username}`}>
                  <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5 }}>
                    <Avatar
                      src={user.avatarUrl}
                      alt={user.username}
                      sx={{
                        width: { xs: 32, sm: 36 },
                        height: { xs: 32, sm: 36 },
                        border: '2px solid',
                        borderColor: 'primary.main',
                      }}
                    >
                      {user.username?.[0]}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 3,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {user.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleProfileMenuClose();
                      navigate('/favorites');
                    }}
                  >
                    <ListItemIcon>
                      <FavoriteIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={`Favorites (${favorites.length})`} />
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Sign Out" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AccountCircleIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                onClick={openLoginModal}
                size="medium"
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 700,
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.6, sm: 0.8 },
                  whiteSpace: 'nowrap',
                  minWidth: 'auto',
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              bgcolor: 'background.paper',
              p: 2.5,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={800}>
              Movie Explorer
            </Typography>
          </Box>
          <IconButton onClick={() => setMobileDrawerOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => setMobileDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  '&.active': {
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                    color: 'primary.main',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          {!isAuthenticated ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<AccountCircleIcon />}
              onClick={() => {
                setMobileDrawerOpen(false);
                openLoginModal();
              }}
              sx={{ borderRadius: 2.5, fontWeight: 700, py: 1 }}
            >
              Sign In
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={user.avatarUrl} sx={{ width: 32, height: 32 }}>
                  {user.username?.[0]}
                </Avatar>
                <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 120 }}>
                  {user.username}
                </Typography>
              </Box>
              <Button size="small" color="error" onClick={logout}>
                Sign Out
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
