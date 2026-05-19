import api from './api';
import { Product, ProductsResponse } from '@/types';

/**
 * Fetch a paginated list of all products.
 */
export const getProducts = async (
  limit = 12,
  skip = 0,
): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>(
    `/products?limit=${limit}&skip=${skip}`,
  );
  return data;
};

/**
 * Fetch a single product by ID.
 */
export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
};

/**
 * Search products by title/description keyword.
 */
export const searchProducts = async (
  q: string,
  limit = 12,
  skip = 0,
): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>(
    `/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`,
  );
  return data;
};

/**
 * Filter products by a specific category.
 * DummyJSON returns all products in the category — we still paginate client-side
 * by slicing via limit + skip params.
 */
export const getProductsByCategory = async (
  category: string,
  limit = 12,
  skip = 0,
): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`,
  );
  return data;
};

/**
 * Fetch all available category slugs for the filter dropdown.
 * DummyJSON returns an array of category objects: { slug, name, url }
 */
export const getCategories = async (): Promise<string[]> => {
  const { data } = await api.get<{ slug: string; name: string; url: string }[]>(
    '/products/categories',
  );
  // Return slugs — used as API param values
  return data.map((c) => c.slug);
};
