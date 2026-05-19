import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Admin Dashboard',
  },
  description:
    'Admin dashboard built with Next.js 15, MUI v9, Zustand, and NextAuth',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch session server-side and pass to SessionProvider
  // to avoid a client-side flash on first load
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
