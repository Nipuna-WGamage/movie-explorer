import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Button, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
            bgcolor: '#0b0f19',
            overflow: 'hidden',
            borderRadius: 3,
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
        backdrop: {
          sx: { backdropFilter: 'blur(12px)', bgcolor: 'rgba(0, 0, 0, 0.85)' },
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          px: 2.5,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'rgba(15, 23, 42, 0.95)',
          color: '#fff',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, overflow: 'hidden' }}>
          <PlayCircleFilledWhiteIcon sx={{ color: 'primary.main', fontSize: 26 }} />
          <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ maxWidth: { xs: 200, sm: 450, md: 550 } }}>
            {title ? `${title} — Official Trailer` : 'Movie Trailer'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Watch directly on YouTube">
            <IconButton
              component="a"
              href={`https://www.youtube.com/watch?v=${videoKey}`}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ff0000' } }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: '#000', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            minHeight: { xs: 240, sm: 380, md: 480 },
            bgcolor: '#000',
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={title || 'Movie Trailer'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              width: '100%',
              height: '100%',
              border: 0,
              display: 'block',
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
