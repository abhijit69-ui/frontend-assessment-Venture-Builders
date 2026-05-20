import { create } from 'zustand';
import { User, UsersResponse } from '@/types';
import { getUsers, searchUsers } from '@/lib/usersApi';

export const USERS_LIMIT = 12;
const LIMIT = USERS_LIMIT;

/**
 * Cache TTL: 5 minutes.
 * Results stay fresh for 5 mins — avoids re-fetching the same page
 * when the user navigates away and comes back.
 */
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  data: UsersResponse;
  timestamp: number;
}

interface UsersState {
  users: User[];
  total: number;
  page: number;
  search: string;
  loading: boolean;
  error: string | null;

  /**
   * In-memory cache keyed by request params string.
   * e.g. "limit=10&skip=0&search=john"
   *
   * Why cache?
   * DummyJSON rate-limits aggressive polling. Caching avoids redundant
   * network calls and makes pagination feel instant for already-visited pages.
   */
  cache: Record<string, CacheEntry>;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  fetchUsers: () => Promise<void>;
  reset: () => void;

  initFromUrl: (page: number, search: string) => void;
}

const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  page: 0,
  search: '',
  loading: false,
  error: null,
  cache: {},

  setPage: (page) => set({ page }),

  // Reset page to 0 whenever search changes
  setSearch: (search) => set({ search, page: 0 }),

  /**
   * Atomically restore page + search from URL params.
   * Unlike setSearch(), this does NOT reset page — it sets both together.
   * Called on component mount to sync URL → Zustand without cascading resets.
   */
  initFromUrl: (page, search) => set({ page, search }),

  fetchUsers: async () => {
    const { page, search, cache } = get();
    const skip = page * LIMIT;
    const cacheKey = `limit=${LIMIT}&skip=${skip}&search=${search}`;

    // ── Cache hit: return immediately if data is still fresh ──────────────
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      set({
        users: cached.data.users,
        total: cached.data.total,
        loading: false,
        error: null,
      });
      return;
    }

    // ── Cache miss: fetch from API ────────────────────────────────────────
    set({ loading: true, error: null });

    try {
      const data: UsersResponse = search
        ? await searchUsers(search, LIMIT, skip)
        : await getUsers(LIMIT, skip);

      set((state) => ({
        users: data.users,
        total: data.total,
        loading: false,
        // Store result in cache with current timestamp
        cache: {
          ...state.cache,
          [cacheKey]: { data, timestamp: Date.now() },
        },
      }));
    } catch {
      set({ error: 'Failed to load users. Please try again.', loading: false });
    }
  },

  reset: () =>
    set({ users: [], total: 0, page: 0, search: '', error: null, cache: {} }),
}));

export default useUsersStore;
