'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps {
  label: string;
  /**
   * Fallback route used when the user lands directly on the detail page
   * with no browser history (e.g. opened via a shared link).
   * In that case router.back() would leave the app, so we push the
   * fallback instead.
   */
  fallback: string;
}

/**
 * Smart back button — uses router.back() to return to the exact previous
 * page, preserving all Zustand pagination / filter state in memory.
 *
 * Why not a plain NextLink href="/products"?
 * A hardcoded href always navigates to page 1 of the list, discarding
 * whatever page the user was on. router.back() restores the full
 * browser history entry, so the list remounts at the same page/search/filter.
 *
 * Falls back to router.push(fallback) when there is no history entry
 * (direct URL navigation or new tab), so the button always works.
 */
const BackButton = ({ label, fallback }: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={handleBack}
      sx={{ mb: 3, color: 'text.secondary', fontWeight: 500 }}
    >
      {label}
    </Button>
  );
};

export default BackButton;
