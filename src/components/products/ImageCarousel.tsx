'use client';

import { useState, useCallback, memo } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface ImageCarouselProps {
  images: string[];
  title: string;
}

/**
 * Zero-dependency image carousel built with MUI primitives.
 *
 * Features:
 * - Prev / Next arrow navigation
 * - Clickable thumbnail strip
 * - Slide counter (e.g. "2 / 5")
 * - Graceful fallback to placeholder on broken image URLs
 *
 * Memoised — only re-renders when images array or title changes.
 */
const ImageCarousel = memo(({ images, title }: ImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = images.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? total - 1 : i - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((i) => (i === total - 1 ? 0 : i + 1));
  }, [total]);

  const handleThumbnailClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (!images || images.length === 0) return null;

  return (
    <Box>
      {/* ── Main image ────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: '#f8fafc',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          component='img'
          src={images[activeIndex]}
          alt={`${title} — image ${activeIndex + 1}`}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = '/placeholder-product.png';
          }}
          sx={{
            width: '100%',
            height: { xs: 260, sm: 360, md: 420 },
            objectFit: 'contain',
            p: 3,
            display: 'block',
            transition: 'opacity 0.2s ease',
          }}
        />

        {/* Prev arrow */}
        {total > 1 && (
          <IconButton
            onClick={handlePrev}
            aria-label='Previous image'
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.85)',
              boxShadow: 2,
              '&:hover': { backgroundColor: 'white' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        {/* Next arrow */}
        {total > 1 && (
          <IconButton
            onClick={handleNext}
            aria-label='Next image'
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.85)',
              boxShadow: 2,
              '&:hover': { backgroundColor: 'white' },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}

        {/* Slide counter */}
        {total > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              right: 14,
              backgroundColor: 'rgba(0,0,0,0.45)',
              borderRadius: 1,
              px: 1,
              py: 0.25,
            }}
          >
            <Typography
              variant='caption'
              sx={{ color: 'white', fontWeight: 600 }}
            >
              {activeIndex + 1} / {total}
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Thumbnail strip ───────────────────────────────────────────────── */}
      {total > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mt: 1.5,
            overflowX: 'auto',
            pb: 0.5,
            // Hide scrollbar visually
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#cbd5e1',
              borderRadius: 2,
            },
          }}
        >
          {images.map((src, index) => (
            <Box
              key={index}
              component='img'
              src={src}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                width: 68,
                height: 68,
                objectFit: 'contain',
                flexShrink: 0,
                borderRadius: 1.5,
                border: '2px solid',
                borderColor: activeIndex === index ? 'primary.main' : 'divider',
                backgroundColor: '#f8fafc',
                p: 0.5,
                cursor: 'pointer',
                opacity: activeIndex === index ? 1 : 0.55,
                transition: 'opacity 0.15s ease, border-color 0.15s ease',
                '&:hover': { opacity: 1 },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
});

ImageCarousel.displayName = 'ImageCarousel';
export default ImageCarousel;
