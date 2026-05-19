'use client';

import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar, { SIDEBAR_WIDTH } from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import AuthSync from '@/components/layout/AuthSync';

/**
 * Dashboard shell layout — wraps all protected routes.
 *
 * Structure:
 * ┌─────────────┬────────────────────────────┐
 * │             │  Topbar                    │
 * │   Sidebar   ├────────────────────────────┤
 * │  (240px)    │  Page content              │
 * │             │  (scrollable)              │
 * └─────────────┴────────────────────────────┘
 *
 * On mobile the sidebar collapses into a temporary drawer
 * controlled by mobileOpen state.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* Syncs NextAuth session → Zustand on every render */}
      <AuthSync />

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        {/* Offset for fixed AppBar height */}
        <Toolbar />

        {/* Page content */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
