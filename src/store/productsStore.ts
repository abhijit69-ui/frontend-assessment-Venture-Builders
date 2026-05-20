import { create } from 'zustand';
import { Product, ProductsResponse } from '@/types';
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
} from '@/lib/productsApi';
export const PRODUCTS_LIMIT = 12;
const LIMIT = PRODUCTS_LIMIT; // 12 fits cleanly in a 3 or 4 col grid

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  data: ProductsResponse;
  timestamp: number;
}

interface ProductsState {
  products: Product[];
  total: number;
  page: number;
  search: string;
  category: string; // '' means "All Categories"
  categories: string[];
  loading: boolean;
  error: string | null;

  /**
   * Cache keyed by "limit=12&skip=0&search=...&category=..."
   * Same strategy as users store — skip API call if fresh data exists.
   */
  cache: Record<string, CacheEntry>;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  reset: () => void;

  initFromUrl: (page: number, search: string, category: string) => void;
}

const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  page: 0,
  search: '',
  category: '',
  categories: [],
  loading: false,
  error: null,
  cache: {},

  setPage: (page) => set({ page }),

  // Reset page when search changes
  setSearch: (search) => set({ search, page: 0 }),

  // Reset page and search when category changes
  setCategory: (category) => set({ category, page: 0 }),

  /**
   * Atomically restore page + search + category from URL params.
   * Bypasses the cascading page resets in setSearch() / setCategory().
   */
  initFromUrl: (page, search, category) => set({ page, search, category }),

  fetchProducts: async () => {
    const { page, search, category, cache } = get();
    const skip = page * LIMIT;
    const cacheKey = `limit=${LIMIT}&skip=${skip}&search=${search}&category=${category}`;

    // ── Cache hit ─────────────────────────────────────────────────────────
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      set({
        products: cached.data.products,
        total: cached.data.total,
        loading: false,
        error: null,
      });
      return;
    }

    // ── Cache miss: fetch from API ────────────────────────────────────────
    set({ loading: true, error: null });

    try {
      let data: ProductsResponse;

      if (search && category) {
        /**
         * DummyJSON has no combined search+category endpoint.
         * Strategy: fetch all products in the category (max 999),
         * then filter client-side by the search term.
         * Category counts are small enough that this is fine.
         */
        const categoryData = await getProductsByCategory(category, 999, 0);
        const filtered = categoryData.products.filter((p) =>
          p.title.toLowerCase().includes(search.toLowerCase()),
        );
        data = {
          products: filtered.slice(skip, skip + LIMIT),
          total: filtered.length,
          skip: 0,
          limit: 999,
        };
      } else if (search) {
        data = await searchProducts(search, LIMIT, skip);
      } else if (category) {
        data = await getProductsByCategory(category, LIMIT, skip);
      } else {
        data = await getProducts(LIMIT, skip);
      }

      set((state) => ({
        products: data.products,
        total: data.total,
        loading: false,
        cache: { ...state.cache, [cacheKey]: { data, timestamp: Date.now() } },
      }));
    } catch {
      set({
        error: 'Failed to load products. Please try again.',
        loading: false,
      });
    }
  },

  fetchCategories: async () => {
    // Categories are static — only fetch once, skip if already loaded
    if (get().categories.length > 0) return;

    try {
      const categories = await getCategories();
      set({ categories });
    } catch {
      // Non-fatal — filter just won't populate
      console.error('Failed to load categories');
    }
  },

  reset: () =>
    set({
      products: [],
      total: 0,
      page: 0,
      search: '',
      category: '',
      error: null,
      cache: {},
    }),
}));

export default useProductsStore;
