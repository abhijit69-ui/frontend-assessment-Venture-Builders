import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  fullHeight?: boolean;
}

/**
 * Centered loading spinner — reused on every list and detail page.
 * fullHeight=true fills the entire viewport (used on initial page load).
 */
const LoadingState = ({
  message = 'Loading...',
  fullHeight = false,
}: LoadingStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: fullHeight ? '60vh' : 200,
      }}
    >
      <CircularProgress size={40} thickness={4} />
      <Typography variant='body2' color='text.secondary'>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingState;
