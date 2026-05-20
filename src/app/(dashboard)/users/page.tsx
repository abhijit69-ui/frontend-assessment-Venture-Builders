'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import useUsersStore, { USERS_LIMIT } from '@/store/usersStore';
import UsersTable from '@/components/users/UsersTable';
import SearchBar from '@/components/common/SearchBar';
import PaginationControls from '@/components/common/PaginationControls';
import ErrorState from '@/components/common/ErrorState';

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    initFromUrl,
  } = useUsersStore();

  // Read URL params at render time so the mount effect can close over them
  const urlPage = Number(searchParams.get('page') ?? '0');
  const urlSearch = searchParams.get('search') ?? '';

  /**
   * Single source-of-truth effect — URL drives everything.
   *
   * Why one effect instead of two:
   * The old pattern had initFromUrl() in one effect (empty deps) and fetchUsers()
   * in another (deps: [page, search]). On mount both effects fired in sequence,
   * causing two fetches before either could populate the cache — so the cache
   * was always cold on the first visit to any page.
   *
   * Now: URL params are the deps. When the URL changes (pagination click, search),
   * initFromUrl() syncs Zustand synchronously, then fetchUsers() immediately calls
   * get() which already sees the updated state — so the correct cache key is built
   * every time. If the data for that key is <5 min old, fetchUsers() returns early
   * from cache with zero network requests.
   */

  useEffect(() => {
    initFromUrl(urlPage, urlSearch); // Zustand set() is sync — get() inside fetchUsers sees it immediately
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPage, urlSearch]); // re-runs only when the URL actually changes

  /**
   * Build a clean query string and replace the current history entry.
   * Using replace (not push) so pagination clicks don't pollute the history
   * stack — but the URL is always up-to-date when a detail page is pushed on top.
   */
  const buildUrl = useCallback((newPage: number, newSearch: string) => {
    const params = new URLSearchParams();
    if (newPage > 0) params.set('page', String(newPage));
    if (newSearch) params.set('search', newSearch);
    const qs = params.toString();
    return `/users${qs ? `?${qs}` : ''}`;
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      router.replace(buildUrl(newPage, search), { scroll: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setPage, search, router, buildUrl],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      // setSearch resets page → 0 inside the store
      setSearch(value);
      router.replace(buildUrl(0, value), { scroll: false });
    },
    [setSearch, router, buildUrl],
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

      {/* ── Search ──────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 2.5, maxWidth: 420 }}>
        <SearchBar
          placeholder='Search by name, email...'
          value={search}
          onChange={handleSearchChange}
        />
      </Box>

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {error && !loading && <ErrorState message={error} onRetry={fetchUsers} />}

      {/* ── Table + Pagination ──────────────────────────────────────────── */}
      {!error && (
        <>
          <UsersTable users={users} loading={loading} />
          <PaginationControls
            total={total}
            page={page}
            limit={USERS_LIMIT}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
}
