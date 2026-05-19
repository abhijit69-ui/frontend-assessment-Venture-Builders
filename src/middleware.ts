export { default } from 'next-auth/middleware';

/**
 * Protect all routes under /dashboard, /users, /products.
 * Unauthenticated users are redirected to /login (configured in authOptions.pages).
 * The /login route and NextAuth API routes are intentionally excluded.
 */
export const config = {
  matcher: ['/dashboard/:path*', '/users/:path*', '/products/:path*'],
};
