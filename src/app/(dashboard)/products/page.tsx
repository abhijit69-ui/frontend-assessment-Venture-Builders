'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import useProductsStore, { PRODUCTS_LIMIT } from '@/store/productsStore';
import ProductsGrid from '@/components/products/ProductsGrid';
import SearchBar from '@/components/common/SearchBar';
import PaginationControls from '@/components/common/PaginationControls';
import ErrorState from '@/components/common/ErrorState';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    products,
    total,
    page,
    search,
    category,
    categories,
    loading,
    error,
    setPage,
    setSearch,
    setCategory,
    fetchProducts,
    fetchCategories,
    initFromUrl,
  } = useProductsStore();

  // Read all URL params at render time
  const urlPage = Number(searchParams.get('page') ?? '0');
  const urlSearch = searchParams.get('search') ?? '';
  const urlCategory = searchParams.get('category') ?? '';

  /**
   * Single source-of-truth effect — URL drives everything.
   *
   * Same pattern as the users page but with an extra `category` param.
   * Three params (page, search, category) mean more possible cache keys,
   * making the two-effect race condition even more likely to cause cache
   * misses — e.g. switching category then paginating would frequently
   * bypass the cache and fire redundant API calls.
   *
   * initFromUrl() sets all three Zustand values atomically (no cascading
   * page resets that setSearch() or setCategory() would trigger individually),
   * then fetchProducts() reads the already-updated state to build the correct
   * cache key and either returns cached data instantly or fetches from the API.
   */

  useEffect(() => {
    initFromUrl(urlPage, urlSearch, urlCategory);
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPage, urlSearch, urlCategory]);

  // Fetch categories once (they're static)
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * Single URL builder — keeps all three params in sync.
   * page=0 is the default so we omit it to keep URLs clean (/products vs /products?page=0).
   */
  const buildUrl = useCallback(
    (newPage: number, newSearch: string, newCategory: string) => {
      const params = new URLSearchParams();
      if (newPage > 0) params.set('page', String(newPage));
      if (newSearch) params.set('search', newSearch);
      if (newCategory) params.set('category', newCategory);
      const qs = params.toString();
      return `/products${qs ? `?${qs}` : ''}`;
    },
    [],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      router.replace(buildUrl(newPage, search, category), { scroll: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setPage, search, category, router, buildUrl],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value); // store resets page → 0
      router.replace(buildUrl(0, value, category), { scroll: false });
    },
    [setSearch, category, router, buildUrl],
  );

  const handleCategoryChange = useCallback(
    (e: SelectChangeEvent) => {
      const val = e.target.value;
      setCategory(val); // store resets page → 0
      router.replace(buildUrl(0, search, val), { scroll: false });
    },
    [setCategory, search, router, buildUrl],
  );

  const formatCategory = useMemo(
    () => (slug: string) =>
      slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
    [],
  );

  return (
    <Box>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            backgroundColor: '#ede9fe',
            borderRadius: 2,
            p: 1,
            display: 'flex',
            color: '#7c3aed',
          }}
        >
          <InventoryIcon />
        </Box>
        <Box>
          <Typography variant='h5'>Products</Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {total > 0 ? `${total} total products` : 'Loading...'}
          </Typography>
        </Box>
      </Box>

      {/* ── Filters Row ─────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 7, md: 6 }}>
          <SearchBar
            placeholder='Search products...'
            value={search}
            onChange={handleSearchChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 5, md: 3 }}>
          <FormControl fullWidth size='small'>
            <InputLabel id='category-label'>Category</InputLabel>
            <Select
              labelId='category-label'
              value={category}
              label='Category'
              onChange={handleCategoryChange}
              sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}
            >
              <MenuItem value=''>
                <em>All Categories</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {formatCategory(cat)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* ── Active filter summary ────────────────────────────────────────── */}
      {(search || category) && !loading && (
        <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2 }}>
          {total} result{total !== 1 ? 's' : ''} for{' '}
          {search && <strong>&quot;{search}&quot;</strong>}
          {search && category && ' in '}
          {category && <strong>{formatCategory(category)}</strong>}
        </Typography>
      )}

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {error && !loading && (
        <ErrorState message={error} onRetry={fetchProducts} />
      )}

      {/* ── Grid + Pagination ───────────────────────────────────────────── */}
      {!error && (
        <>
          <ProductsGrid products={products} loading={loading} />
          <PaginationControls
            total={total}
            page={page}
            limit={PRODUCTS_LIMIT}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
}
