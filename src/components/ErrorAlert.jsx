import { Alert, AlertTitle, Button, Box } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

export default function ErrorAlert({ message, onRetry, sx = {} }) {
  if (!message) return null;

  return (
    <Box sx={{ my: 3, ...sx }}>
      <Alert
        severity="error"
        variant="filled"
        sx={{
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)',
          alignItems: 'center',
        }}
        action={
          onRetry ? (
            <Button
              color="inherit"
              size="small"
              startIcon={<ReplayIcon />}
              onClick={onRetry}
              sx={{ fontWeight: 700 }}
            >
              Retry
            </Button>
          ) : null
        }
      >
        <AlertTitle sx={{ fontWeight: 700 }}>Something went wrong</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}
