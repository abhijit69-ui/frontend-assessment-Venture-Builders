'use client';

import {
  Box,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { memo } from 'react';

interface PaginationControlsProps {
  total: number;
  page: number; // 0-based page index
  limit: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination bar — converts between 0-based store pages and
 * 1-based MUI Pagination display.
 *
 * Memoised with React.memo — re-renders only when total/page/limit change,
 * not on every parent keystroke or state update.
 */
const PaginationControls = memo(
  ({ total, page, limit, onPageChange }: PaginationControlsProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const totalPages = Math.ceil(total / limit);
    const from = total === 0 ? 0 : page * limit + 1;
    const to = Math.min((page + 1) * limit, total);

    if (totalPages <= 1) return null;

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          mt: 3,
          px: 1,
        }}
      >
        <Typography variant='body2' color='text.secondary'>
          Showing{' '}
          <strong>
            {from}–{to}
          </strong>{' '}
          of <strong>{total}</strong> results
        </Typography>

        <Pagination
          count={totalPages}
          page={page + 1} // MUI is 1-based
          onChange={(_, value) => onPageChange(value - 1)} // convert back to 0-based
          color='primary'
          shape='rounded'
          size={isMobile ? 'small' : 'medium'}
          siblingCount={isMobile ? 0 : 1}
        />
      </Box>
    );
  },
);

PaginationControls.displayName = 'PaginationControls';

export default PaginationControls;
