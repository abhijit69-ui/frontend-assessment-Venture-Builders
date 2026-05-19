import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userId: string | null;
  username: string | null;
  fullName: string | null;
  avatar: string | null;

  // Sync from NextAuth session on client mount
  setAuth: (params: {
    token: string;
    userId: string;
    username: string;
    fullName: string;
    avatar?: string;
  }) => void;

  clearAuth: () => void;
}

/**
 * Auth store — Zustand with localStorage persistence.
 *
 * Why Zustand alongside NextAuth?
 * NextAuth manages the session cookie/JWT. Zustand stores the raw accessToken
 * so it can be attached to DummyJSON API calls (Authorization: Bearer <token>)
 * without having to call getSession() on every request.
 *
 * Persistence: we use the `persist` middleware so the token survives
 * page refreshes. On mount, the session is synced into this store
 * via the AuthSync component in the dashboard layout.
 */
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      username: null,
      fullName: null,
      avatar: null,

      setAuth: ({ token, userId, username, fullName, avatar }) =>
        set({ token, userId, username, fullName, avatar: avatar ?? null }),

      clearAuth: () =>
        set({
          token: null,
          userId: null,
          username: null,
          fullName: null,
          avatar: null,
        }),
    }),
    {
      name: 'auth-storage', // localStorage key
    },
  ),
);

export default useAuthStore;
