import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Error state shown when an API call fails.
 * Optional retry callback re-triggers the fetch action.
 */
const ErrorState = ({
  message = 'Something went wrong.',
  onRetry,
}: ErrorStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: 200,
      }}
    >
      <ErrorOutlineOutlinedIcon color='error' sx={{ fontSize: 48 }} />
      <Typography variant='body1' color='text.secondary'>
        {message}
      </Typography>
      {onRetry && (
        <Button variant='outlined' color='primary' onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
