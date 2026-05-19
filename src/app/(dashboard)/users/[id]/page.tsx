import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/usersApi';
import UserDetailCard from '@/components/users/UserDetailCard';
import type { Metadata } from 'next';

// ── Dynamic metadata ──────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const user = await getUserById(Number(id));
    return { title: `${user.firstName} ${user.lastName}` };
  } catch {
    return { title: 'User Not Found' };
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

/**
 * Server component — fetches user data at request time.
 * Passes the resolved user object to the client detail card.
 * Calls notFound() so Next.js renders the 404 page on bad IDs.
 */
export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const userId = Number(id);

  if (isNaN(userId)) notFound();

  try {
    const user = await getUserById(userId);
    return <UserDetailCard user={user} />;
  } catch {
    notFound();
  }
}
