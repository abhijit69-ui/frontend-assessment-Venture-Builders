'use client';

import { useEffect, useState, useCallback } from 'react';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '@/lib/api';

// ── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
}

// ── Skeletons ────────────────────────────────────────────────────────────────

/**
 * Skeleton placeholder that mirrors the StatCard layout.
 */
const StatCardSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Skeleton
          variant='rounded'
          width={45}
          height={45}
          sx={{ borderRadius: 2 }}
        />
        <Skeleton variant='text' width={60} height={28} />
      </Box>
      <Skeleton variant='text' width={90} height={48} sx={{ mb: 0.5 }} />
      <Skeleton variant='text' width={110} height={24} />
    </CardContent>
  </Card>
);

/**
 * Skeleton placeholder that mirrors the QuickActionCard layout.
 */
const QuickActionSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <CardContent
      sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      <Skeleton variant='text' width='45%' height={32} />
      <Skeleton variant='text' width='100%' height={20} />
      <Skeleton variant='text' width='92%' height={20} />
      <Box sx={{ mt: 0.5 }}>
        <Skeleton
          variant='rounded'
          width={115}
          height={32}
          sx={{ borderRadius: 1 }}
        />
      </Box>
    </CardContent>
  </Card>
);

// ── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number | null;
  icon: React.ReactNode;
  color: string;
  href: string;
}

const StatCard = ({ label, value, icon, color, href }: StatCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: `${color}18`,
            borderRadius: 2,
            p: 1.2,
            display: 'flex',
            color,
          }}
        >
          {icon}
        </Box>
        <Button
          component={NextLink}
          href={href}
          size='small'
          endIcon={<ArrowForwardIcon fontSize='small' />}
          sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
        >
          View all
        </Button>
      </Box>

      {value === null ? (
        <Skeleton variant='text' width={80} height={48} />
      ) : (
        <Typography variant='h4' sx={{ fontWeight: 700, mb: 0.5 }}>
          {value.toLocaleString()}
        </Typography>
      )}

      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
    </CardContent>
  </Card>
);

// ── Quick-action card ─────────────────────────────────────────────────────────

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  color: string;
}

const QuickActionCard = ({
  title,
  description,
  href,
  buttonLabel,
  color,
}: QuickActionProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent
      sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      <Typography variant='h6'>{title}</Typography>
      <Typography variant='body2' sx={{ color: 'text.secondary', flexGrow: 1 }}>
        {description}
      </Typography>
      <Button
        component={NextLink}
        href={href}
        variant='contained'
        size='small'
        sx={{
          alignSelf: 'flex-start',
          backgroundColor: color,
          '&:hover': { backgroundColor: color, filter: 'brightness(0.9)' },
        }}
      >
        {buttonLabel}
      </Button>
    </CardContent>
  </Card>
);

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const firstName = session?.user?.firstName ?? session?.user?.name ?? 'Admin';

  /**
   * Fetch lightweight stats on mount — only total counts, no full lists.
   * limit=1 keeps the payload tiny; we only care about `total`.
   */
  const fetchStats = useCallback(async () => {
    try {
      const [usersRes, productsRes, categoriesRes] = await Promise.all([
        api.get('/users?limit=1&skip=0'),
        api.get('/products?limit=1&skip=0'),
        api.get('/products/categories'),
      ]);

      setStats({
        totalUsers: usersRes.data.total,
        totalProducts: productsRes.data.total,
        totalCategories: categoriesRes.data.length,
      });
    } catch {
      // Graceful degradation — cards show 0 if fetch fails
      setStats({ totalUsers: 0, totalProducts: 0, totalCategories: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <Box>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{ mb: 0.5 }}>
          Welcome back, {firstName}!
        </Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary' }}>
          Here&apos;s an overview of your admin panel.
        </Typography>
      </Box>

      {/* ── Stats Row ───────────────────────────────────────────────────── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              label='Total Users'
              value={stats?.totalUsers ?? 0}
              icon={<PeopleAltIcon />}
              color='#2563eb'
              href='/users'
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              label='Total Products'
              value={stats?.totalProducts ?? 0}
              icon={<InventoryIcon />}
              color='#7c3aed'
              href='/products'
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              label='Product Categories'
              value={stats?.totalCategories ?? 0}
              icon={<TrendingUpIcon />}
              color='#059669'
              href='/products'
            />
          )}
        </Grid>
      </Grid>

      {/* ── Quick Actions ────────────────────────────────────────────────── */}
      <Typography variant='h6' sx={{ mb: 2 }}>
        Quick Actions
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          {loading ? (
            <QuickActionSkeleton />
          ) : (
            <QuickActionCard
              title='Manage Users'
              description='Browse, search, and view detailed profiles of all registered users. Paginate through the full list or search by name.'
              href='/users'
              buttonLabel='Go to Users'
              color='#2563eb'
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          {loading ? (
            <QuickActionSkeleton />
          ) : (
            <QuickActionCard
              title='Browse Products'
              description='Explore the full product catalogue. Filter by category, search by title, and view product specs, ratings, and reviews.'
              href='/products'
              buttonLabel='Go to Products'
              color='#7c3aed'
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
