import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

export default function TrailerModal({ open, onClose, videoKey, title }) {
  if (!videoKey) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#000',
            overflow: 'hidden',
            borderRadius: 3,
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          },
        },
        backdrop: {
          sx: { backdropFilter: 'blur(10px)', bgcolor: 'rgba(0,0,0,0.85)' },
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'rgba(20, 20, 20, 0.95)',
          color: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
          <PlayCircleFilledWhiteIcon sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {title ? `${title} — Official Trailer` : 'Movie Trailer'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: '#000', position: 'relative', pt: '56.25%' /* 16:9 Aspect Ratio */ }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
          title={title || 'Movie Trailer'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
