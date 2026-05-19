'use client';

import { memo } from 'react';
import {
  Box,
  Grid,
  Skeleton,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

// ── Skeleton card ──────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <Card sx={{ height: '100%' }}>
    <Skeleton variant='rectangular' height={200} />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Skeleton variant='rounded' width={80} height={22} />
      <Skeleton variant='text' height={20} />
      <Skeleton variant='text' width='60%' height={20} />
      <Skeleton variant='text' width='40%' height={20} />
      <Skeleton variant='text' width='50%' height={28} />
    </CardContent>
  </Card>
);

// ── Props ──────────────────────────────────────────────────────────────────────

interface ProductsGridProps {
  products: Product[];
  loading: boolean;
}

/**
 * Responsive product grid — 1 col (xs) → 2 col (sm) → 3 col (md) → 4 col (xl).
 * Shows skeleton cards while loading and a centred empty state when no results.
 *
 * Memoised — parent pagination/filter state changes don't cause re-renders
 * unless the products array itself changes.
 */
const ProductsGrid = memo(({ products, loading }: ProductsGridProps) => {
  // Show 12 skeleton cards matching our default LIMIT
  if (loading) {
    return (
      <Grid container spacing={2.5}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
            <SkeletonCard />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (products.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
          gap: 1,
        }}
      >
        <Typography variant='h6' sx={{ color: 'text.secondary' }}>
          No products found
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.disabled' }}>
          Try adjusting your search or category filter.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2.5}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
});

ProductsGrid.displayName = 'ProductsGrid';
export default ProductsGrid;
