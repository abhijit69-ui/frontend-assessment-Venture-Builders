import { withAuth } from 'next-auth/middleware';

/**
 * Protect all routes under /dashboard, /users, /products.
 * withAuth is configured explicitly so the middleware knows to redirect
 * to our custom /login page instead of NextAuth's default /api/auth/signin.
 */
export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/users/:path*', '/products/:path*'],
};
