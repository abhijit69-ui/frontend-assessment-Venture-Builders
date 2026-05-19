'use client';

import { memo } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { SIDEBAR_WIDTH } from './Sidebar';

interface TopbarProps {
  onMenuClick: () => void;
}

/**
 * Top app bar with:
 * - Hamburger menu (mobile only)
 * - Page context / brand name
 * - User avatar, name, and email — stacked correctly
 * - Logout button
 */
const Topbar = memo(({ onMenuClick }: TopbarProps) => {
  const { data: session } = useSession();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const displayName = session?.user?.firstName
    ? `${session.user.firstName} ${session.user.lastName}`
    : (session?.user?.name ?? 'Admin');

  const email = session?.user?.email ?? '';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <AppBar
      position='fixed'
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { md: `${SIDEBAR_WIDTH}px` },
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {/* Mobile hamburger */}
        {!isDesktop && (
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open menu'
            onClick={onMenuClick}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* App name */}
        <Typography
          variant='h6'
          component='div'
          sx={{ fontWeight: 700, flexGrow: 1 }}
        >
          AdminPanel
        </Typography>

        {/* ── Right side: user info + logout ─────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* User pill — avatar + stacked name/email */}
          {isDesktop && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                backgroundColor: 'grey.100',
                borderRadius: 2,
                px: 1.5,
                py: 0.75,
              }}
            >
              <Avatar
                src={session?.user?.image ?? undefined}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.8rem',
                  backgroundColor: 'primary.main',
                }}
              >
                {avatarLetter}
              </Avatar>

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 600, lineHeight: 1.25 }}
                >
                  {displayName}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ color: 'text.secondary', lineHeight: 1.25 }}
                >
                  {email}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Mobile: just avatar, no pill */}
          {!isDesktop && (
            <Avatar
              src={session?.user?.image ?? undefined}
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.8rem',
                backgroundColor: 'primary.main',
              }}
            >
              {avatarLetter}
            </Avatar>
          )}

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          <Tooltip title='Logout'>
            <IconButton
              color='inherit'
              onClick={handleLogout}
              aria-label='logout'
              size='small'
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  backgroundColor: 'error.lighter',
                },
              }}
            >
              <LogoutIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

Topbar.displayName = 'Topbar';
export default Topbar;
