import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

/**
 * Default unauthenticated axios instance for public endpoints.
 * Used for login, public product/user lists.
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Creates an authenticated axios instance with a Bearer token.
 * Used for endpoints that require auth (e.g. /auth/me).
 */
export const createAuthApi = (token: string) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

export default api;
