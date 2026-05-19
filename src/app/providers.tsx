'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import theme from '@/theme/muiTheme';

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

/**
 * Client-side wrapper for all global providers.
 * SessionProvider: makes useSession() available app-wide.
 * ThemeProvider: applies our MUI theme to every component.
 * CssBaseline: normalises browser default styles (MUI equivalent of CSS reset).
 */
export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
