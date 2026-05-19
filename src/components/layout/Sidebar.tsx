'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export const SIDEBAR_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Users', href: '/users', icon: <PeopleIcon /> },
  { label: 'Products', href: '/products', icon: <InventoryIcon /> },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

/**
 * Responsive sidebar:
 * - Desktop: permanent drawer (always visible)
 * - Mobile: temporary drawer (slides in from left)
 *
 * Active route is highlighted using the current pathname.
 */
const Sidebar = memo(({ mobileOpen, onMobileClose }: SidebarProps) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
    >
      {/* ── Brand / Logo ──────────────────────────────────────────────── */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <AdminPanelSettingsIcon color='primary' sx={{ fontSize: 30 }} />
        <Typography
          variant='h6'
          color='primary'
          sx={{ fontWeight: 700 }}
          component='span'
        >
          AdminPanel
        </Typography>
      </Box>

      <Divider />

      {/* ── Nav Links ─────────────────────────────────────────────────── */}
      <List sx={{ px: 1.5, py: 1.5, flexGrow: 1 }}>
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href);

          return (
            <ListItem key={href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NextLink}
                href={href}
                onClick={onMobileClose}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': { backgroundColor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                    color: isActive ? 'white' : 'text.secondary',
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.9rem',
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant='caption' color='text.disabled'>
          v1.0.0 · Powered by DummyJSON
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component='nav'
      sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* Mobile: temporary drawer */}
      {!isDesktop && (
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop: permanent drawer */}
      {isDesktop && (
        <Drawer
          variant='permanent'
          open
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;
