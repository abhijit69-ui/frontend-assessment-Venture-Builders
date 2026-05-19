// Extends the default NextAuth Session and JWT types
// to include our custom fields (accessToken, username, etc.)

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username: string;
      firstName: string;
      lastName: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    username: string;
    firstName: string;
    lastName: string;
    id: string;
  }
}
