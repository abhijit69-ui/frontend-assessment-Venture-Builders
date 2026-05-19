'use client';

import { memo } from 'react';
import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import type { User } from '@/types';

// ── Skeleton card shown while loading ─────────────────────────────────────────

const SkeletonCard = () => (
  <Card variant='outlined' sx={{ borderRadius: 2, height: '100%' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Skeleton variant='circular' width={48} height={48} />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant='text' width='60%' height={20} />
          <Skeleton variant='text' width='40%' height={16} />
        </Box>
      </Box>
      {[80, 60, 70, 50].map((w, i) => (
        <Skeleton
          key={i}
          variant='text'
          width={`${w}%`}
          height={16}
          sx={{ mb: 0.5 }}
        />
      ))}
    </CardContent>
  </Card>
);

// ── Props ─────────────────────────────────────────────────────────────────────

interface UsersTableProps {
  users: User[];
  loading: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Responsive MUI card grid displaying user records.
 *
 * Memoised — only re-renders when the `users` array reference or
 * `loading` flag changes, not on parent search/pagination state updates.
 */
const UsersTable = memo(({ users, loading }: UsersTableProps) => {
  return (
    <Box>
      {/* Loading skeletons */}
      {loading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Box>
      )}

      {/* Empty state */}
      {!loading && users.length === 0 && (
        <Paper
          sx={{
            borderRadius: 2,
            p: 6,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            No users found.
          </Typography>
        </Paper>
      )}

      {/* Data cards */}
      {!loading && users.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {users.map((user) => (
            <Card
              key={user.id}
              variant='outlined'
              sx={{
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                {/* Header: Avatar + Name + View */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant='body1'
                      sx={{ fontWeight: 600, lineHeight: 1.3 }}
                    >
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography
                      variant='caption'
                      sx={{ color: 'text.secondary', display: 'block' }}
                    >
                      @{user.username}
                    </Typography>
                  </Box>
                  <Tooltip title='View profile'>
                    <IconButton
                      component={NextLink}
                      href={`/users/${user.id}`}
                      size='small'
                      sx={{ color: 'primary.main', mt: -0.5 }}
                    >
                      <OpenInNewIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Details */}
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}
                >
                  <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    {user.email}
                  </Typography>

                  <Chip
                    size='small'
                    icon={
                      user.gender === 'male' ? (
                        <MaleIcon sx={{ fontSize: '0.95rem !important' }} />
                      ) : (
                        <FemaleIcon sx={{ fontSize: '0.95rem !important' }} />
                      )
                    }
                    label={
                      user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                    }
                    sx={{
                      width: 'fit-content',
                      backgroundColor:
                        user.gender === 'male' ? '#dbeafe' : '#fce7f3',
                      color: user.gender === 'male' ? '#1d4ed8' : '#be185d',
                      fontWeight: 500,
                      '& .MuiChip-icon': {
                        color: user.gender === 'male' ? '#1d4ed8' : '#be185d',
                      },
                    }}
                  />

                  <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    {user.phone}
                  </Typography>

                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {user.company.name}
                    </Typography>
                    <Typography
                      variant='caption'
                      sx={{ color: 'text.secondary', display: 'block' }}
                    >
                      {user.company.department}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
});

UsersTable.displayName = 'UsersTable';
export default UsersTable;
