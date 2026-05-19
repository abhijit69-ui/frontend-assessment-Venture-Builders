import { notFound } from 'next/navigation';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Rating,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import InventoryIcon from '@mui/icons-material/Inventory';
import { getProductById } from '@/lib/productsApi';
import ImageCarousel from '@/components/products/ImageCarousel';
import type { Metadata } from 'next';
import type { Review } from '@/types';

// ── Dynamic metadata ──────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await getProductById(Number(id));
    return { title: product.title };
  } catch {
    return { title: 'Product Not Found' };
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

const SpecRow = ({ label, value }: { label: string; value: string }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      py: 1,
      borderBottom: '1px solid',
      borderColor: 'divider',
      '&:last-child': { borderBottom: 0 },
    }}
  >
    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
      {label}
    </Typography>
    <Typography
      variant='body2'
      sx={{ fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}
    >
      {value}
    </Typography>
  </Box>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <Card variant='outlined' sx={{ mb: 1.5 }}>
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 0.75,
        }}
      >
        <Typography variant='body2' sx={{ fontWeight: 600 }}>
          {review.reviewerName}
        </Typography>
        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
          {new Date(review.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Typography>
      </Box>
      <Rating value={review.rating} size='small' readOnly sx={{ mb: 0.75 }} />
      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
        {review.comment}
      </Typography>
    </CardContent>
  </Card>
);

// ── Page ──────────────────────────────────────────────────────────────────────

/**
 * Server component — all data fetched at request time.
 * Heavy detail layout: carousel, pricing, specs, reviews.
 */
export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) notFound();

  let product;
  try {
    product = await getProductById(productId);
  } catch {
    notFound();
  }

  const discountedPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  const stockColor =
    product.stock > 20 ? '#059669' : product.stock > 0 ? '#d97706' : '#dc2626';

  const stockLabel =
    product.stock > 20
      ? 'In Stock'
      : product.stock > 0
        ? `Only ${product.stock} left`
        : 'Out of Stock';

  return (
    <Box>
      {/* Back link */}
      <Button
        component={NextLink}
        href='/products'
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: 'text.secondary', fontWeight: 500 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={3}>
        {/* ── Left: Image carousel ──────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <ImageCarousel images={product.images} title={product.title} />
        </Grid>

        {/* ── Right: Info ───────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Category + Brand chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={product.category}
                size='small'
                sx={{
                  backgroundColor: '#ede9fe',
                  color: '#6d28d9',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              />
              {product.brand && (
                <Chip
                  label={product.brand}
                  size='small'
                  variant='outlined'
                  sx={{ fontWeight: 500 }}
                />
              )}
            </Box>

            {/* Title */}
            <Typography variant='h4' sx={{ fontWeight: 700, lineHeight: 1.25 }}>
              {product.title}
            </Typography>

            {/* Rating row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                {product.rating.toFixed(1)}
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                ({product.reviews.length} review
                {product.reviews.length !== 1 ? 's' : ''})
              </Typography>
            </Box>

            {/* Price block */}
            <Box
              sx={{
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant='h4'
                sx={{ fontWeight: 800, color: 'primary.main' }}
              >
                ${discountedPrice}
              </Typography>
              {product.discountPercentage >= 1 && (
                <>
                  <Typography
                    variant='h6'
                    sx={{
                      color: 'text.disabled',
                      textDecoration: 'line-through',
                      fontWeight: 400,
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Chip
                    label={`${Math.round(product.discountPercentage)}% OFF`}
                    size='small'
                    sx={{
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      fontWeight: 700,
                    }}
                  />
                </>
              )}
            </Box>

            {/* Stock */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InventoryIcon sx={{ fontSize: 18, color: stockColor }} />
              <Typography
                variant='body2'
                sx={{ fontWeight: 600, color: stockColor }}
              >
                {stockLabel}
              </Typography>
              {product.minimumOrderQuantity > 1 && (
                <Typography
                  variant='caption'
                  sx={{ color: 'text.secondary', ml: 1 }}
                >
                  · Min. order: {product.minimumOrderQuantity}
                </Typography>
              )}
            </Box>

            {/* Description */}
            <Typography
              variant='body1'
              sx={{ color: 'text.secondary', lineHeight: 1.75 }}
            >
              {product.description}
            </Typography>

            {/* Tags */}
            {product.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {product.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size='small'
                    variant='outlined'
                    sx={{ fontSize: '0.72rem', color: 'text.secondary' }}
                  />
                ))}
              </Box>
            )}

            {/* Shipping / Warranty / Return info row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 1.5,
                mt: 0.5,
              }}
            >
              {[
                {
                  icon: <LocalShippingIcon fontSize='small' />,
                  label: 'Shipping',
                  value: product.shippingInformation,
                },
                {
                  icon: <VerifiedIcon fontSize='small' />,
                  label: 'Warranty',
                  value: product.warrantyInformation,
                },
                {
                  icon: <AssignmentReturnIcon fontSize='small' />,
                  label: 'Returns',
                  value: product.returnPolicy,
                },
              ].map(({ icon, label, value }) => (
                <Box
                  key={label}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <Box sx={{ color: 'primary.main', mt: 0.1, flexShrink: 0 }}>
                    {icon}
                  </Box>
                  <Box>
                    <Typography
                      variant='caption'
                      sx={{ color: 'text.secondary', display: 'block' }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ fontWeight: 500, fontSize: '0.78rem' }}
                    >
                      {value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* ── Specs card ────────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant='overline'
                sx={{
                  fontWeight: 700,
                  color: 'text.disabled',
                  letterSpacing: 1,
                }}
              >
                Specifications
              </Typography>
              <Box sx={{ mt: 1.5 }}>
                <SpecRow label='Weight' value={`${product.weight} g`} />
                <SpecRow
                  label='Dimensions'
                  value={`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`}
                />
                <SpecRow label='SKU' value={product.meta?.barcode ?? '—'} />
                <SpecRow label='Status' value={product.availabilityStatus} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Reviews ───────────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2.5,
                }}
              >
                <Typography
                  variant='overline'
                  sx={{
                    fontWeight: 700,
                    color: 'text.disabled',
                    letterSpacing: 1,
                  }}
                >
                  Customer Reviews
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Rating
                    value={product.rating}
                    precision={0.5}
                    size='small'
                    readOnly
                  />
                  <Typography variant='body2' sx={{ fontWeight: 700 }}>
                    {product.rating.toFixed(1)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {product.reviews.length === 0 ? (
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  No reviews yet.
                </Typography>
              ) : (
                product.reviews.map((review, i) => (
                  <ReviewCard key={i} review={review} />
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
