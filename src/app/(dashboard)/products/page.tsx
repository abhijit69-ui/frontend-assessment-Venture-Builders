'use client';

import { useEffect, useCallback, useMemo } from 'react';
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
import useProductsStore from '@/store/productsStore';
import ProductsGrid from '@/components/products/ProductsGrid';
import SearchBar from '@/components/common/SearchBar';
import PaginationControls from '@/components/common/PaginationControls';
import ErrorState from '@/components/common/ErrorState';

const LIMIT = 12;

export default function ProductsPage() {
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
  } = useProductsStore();

  // Fetch categories once on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Refetch whenever page, search, or category changes
  useEffect(() => {
    fetchProducts();
  }, [page, search, category, fetchProducts]);

  const handleSearchChange = useCallback(
    (value: string) => setSearch(value),
    [setSearch],
  );

  const handleCategoryChange = useCallback(
    (e: SelectChangeEvent) => setCategory(e.target.value),
    [setCategory],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setPage],
  );

  /**
   * Build formatted category label from slug.
   * e.g. "mens-shirts" → "Mens Shirts"
   */
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
        {/* Search */}
        <Grid size={{ xs: 12, sm: 7, md: 6 }}>
          <SearchBar
            placeholder='Search products...'
            value={search}
            onChange={handleSearchChange}
          />
        </Grid>

        {/* Category filter */}
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

      {/* ── Active filter pill ───────────────────────────────────────────── */}
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
            limit={LIMIT}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
}
