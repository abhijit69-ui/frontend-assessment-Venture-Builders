'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useAuthStore from '@/store/authStore';

/**
 * AuthSync — invisible component that bridges NextAuth session → Zustand.
 *
 * Runs once on mount (and whenever session changes).
 * Writes the accessToken and user info into Zustand so all stores
 * and API calls can read it without calling useSession() everywhere.
 *
 * Why needed? NextAuth owns the session; Zustand owns the runtime token
 * for attaching to API headers. This component keeps them in sync.
 */
const AuthSync = () => {
  const { data: session, status } = useSession();
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      setAuth({
        token: session.accessToken,
        userId: session.user.id,
        username: session.user.username,
        fullName: `${session.user.firstName} ${session.user.lastName}`,
        avatar: session.user.image ?? undefined,
      });
    }

    if (status === 'unauthenticated') {
      clearAuth();
    }
  }, [session, status, setAuth, clearAuth]);

  return null; // renders nothing — side-effects only
};

export default AuthSync;
