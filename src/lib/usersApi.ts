import api from './api';
import { User, UsersResponse } from '@/types';

/**
 * Fetch a paginated list of all users.
 * Uses server-side pagination via limit + skip to avoid loading the full dataset.
 */
export const getUsers = async (
  limit = 10,
  skip = 0,
): Promise<UsersResponse> => {
  const { data } = await api.get<UsersResponse>(
    `/users?limit=${limit}&skip=${skip}`,
  );
  return data;
};

/**
 * Fetch a single user by ID.
 */
export const getUserById = async (id: number): Promise<User> => {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
};

/**
 * Search users by name — uses DummyJSON's /users/search endpoint.
 * Supports pagination too so large result sets are still chunked.
 */
export const searchUsers = async (
  q: string,
  limit = 12,
  skip = 0,
): Promise<UsersResponse> => {
  const { data } = await api.get<UsersResponse>(
    `/users/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`,
  );
  return data;
};
