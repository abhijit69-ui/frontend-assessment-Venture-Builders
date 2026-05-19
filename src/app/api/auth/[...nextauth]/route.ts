import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// Single handler for all NextAuth routes (GET + POST)
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
