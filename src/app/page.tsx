import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

/**
 * Root route — immediately redirects based on auth state.
 * Authenticated  → /dashboard
 * Unauthenticated → /login
 */
export default async function HomePage() {
  const session = await getServerSession(authOptions);
  redirect(session ? '/dashboard' : '/login');
}
