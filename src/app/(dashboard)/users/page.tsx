'use client';

import { useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import useUsersStore from '@/store/usersStore';
import UsersTable from '@/components/users/UsersTable';
import SearchBar from '@/components/common/SearchBar';
import PaginationControls from '@/components/common/PaginationControls';
import ErrorState from '@/components/common/ErrorState';

const LIMIT = 12;

export default function UsersPage() {
  const {
    users,
    total,
    page,
    search,
    loading,
    error,
    setPage,
    setSearch,
    fetchUsers,
  } = useUsersStore();

  // Fetch whenever page or search changes
  useEffect(() => {
    fetchUsers();
  }, [page, search, fetchUsers]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
    },
    [setSearch],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      // Scroll to top of table on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setPage],
  );

  return (
    <Box>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            backgroundColor: '#dbeafe',
            borderRadius: 2,
            p: 1,
            display: 'flex',
            color: '#2563eb',
          }}
        >
          <PeopleAltIcon />
        </Box>
        <Box>
          <Typography variant='h5'>Users</Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {total > 0 ? `${total} total users` : 'Loading...'}
          </Typography>
        </Box>
      </Box>

      {/* ── Search Bar ──────────────────────────────────────────────────── */}
      <Box sx={{ mb: 2.5, maxWidth: 420 }}>
        <SearchBar
          placeholder='Search by name, email...'
          value={search}
          onChange={handleSearchChange}
        />
      </Box>

      {/* ── Error State ─────────────────────────────────────────────────── */}
      {error && !loading && <ErrorState message={error} onRetry={fetchUsers} />}

      {/* ── Table ───────────────────────────────────────────────────────── */}
      {!error && (
        <>
          <UsersTable users={users} loading={loading} />

          <PaginationControls
            total={total}
            page={page}
            limit={LIMIT}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
}
