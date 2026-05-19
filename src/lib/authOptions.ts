import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthUser } from '@/types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'emilys' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const res = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
              expiresInMins: 60,
            }),
          });

          if (!res.ok) return null;

          const user: AuthUser = await res.json();

          // Return a shape that NextAuth understands,
          // with our extra fields attached
          return {
            id: String(user.id),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            image: user.image,
            // Custom fields stored in JWT via callbacks below
            accessToken: user.accessToken,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // jwt: runs on every token creation/update
    // Persist custom fields from authorize() into the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = (user as AuthUser & { id: string }).accessToken;
        token.username = (user as AuthUser & { id: string }).username;
        token.firstName = (user as AuthUser & { id: string }).firstName;
        token.lastName = (user as AuthUser & { id: string }).lastName;
      }
      return token;
    },

    // session: exposes selected JWT fields to the client via useSession()
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      return session;
    },
  },

  pages: {
    signIn: '/login', // Redirect to our custom login page
  },

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour, matches DummyJSON token expiry
  },

  secret: process.env.NEXTAUTH_SECRET,
};
