'use client';

import { memo } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Typography,
} from '@mui/material';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

/**
 * Product grid card — shows thumbnail, title, category, price,
 * discount badge, and star rating.
 *
 * Memoised: only re-renders when the product object reference changes,
 * not on parent search/filter state updates.
 */
const ProductCard = memo(({ product }: ProductCardProps) => {
  const discountedPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={NextLink}
        href={`/products/${product.id}`}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        {/* ── Thumbnail ─────────────────────────────────────────────────── */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component='img'
            image={product.thumbnail}
            alt={product.title}
            sx={{
              height: 200,
              objectFit: 'contain',
              backgroundColor: '#f8fafc',
              p: 2,
            }}
          />

          {/* Discount badge */}
          {product.discountPercentage >= 5 && (
            <Chip
              label={`-${Math.round(product.discountPercentage)}%`}
              size='small'
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#dc2626',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            />
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant='caption'
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  backgroundColor: '#dc2626',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  letterSpacing: 0.5,
                }}
              >
                OUT OF STOCK
              </Typography>
            </Box>
          )}
        </Box>

        {/* ── Content ───────────────────────────────────────────────────── */}
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
            p: 2,
          }}
        >
          {/* Category */}
          <Chip
            label={product.category}
            size='small'
            sx={{
              alignSelf: 'flex-start',
              backgroundColor: '#ede9fe',
              color: '#6d28d9',
              fontWeight: 600,
              fontSize: '0.7rem',
              textTransform: 'capitalize',
            }}
          />

          {/* Title */}
          <Typography
            variant='body1'
            sx={{
              fontWeight: 600,
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.title}
          </Typography>

          {/* Brand */}
          {product.brand && (
            <Typography variant='caption' sx={{ color: 'text.secondary' }}>
              {product.brand}
            </Typography>
          )}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Rating
              value={product.rating}
              precision={0.5}
              size='small'
              readOnly
            />
            <Typography variant='caption' sx={{ color: 'text.secondary' }}>
              {product.rating.toFixed(1)}
            </Typography>
          </Box>

          {/* Price row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant='h6'
              sx={{ fontWeight: 700, color: 'primary.main' }}
            >
              ${discountedPrice}
            </Typography>
            {product.discountPercentage >= 1 && (
              <Typography
                variant='body2'
                sx={{
                  color: 'text.disabled',
                  textDecoration: 'line-through',
                  fontSize: '0.8rem',
                }}
              >
                ${product.price.toFixed(2)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
