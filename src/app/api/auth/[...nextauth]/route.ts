// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Define auth options directly in this file (no export)
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
           
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase()
            }
          });
           
          if (!user || !user.password) {
            return null;
          }
           
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
           
          if (!isValidPassword) {
            return null;
          }
           
          // Ensure email is not null before returning
          if (!user.email) {
            return null;
          }
           
          return {
            id: user.id,
            name: user.name,
            email: user.email, // Now guaranteed to be string, not null
            isAdmin: Boolean(user.isAdmin),
          };
        } catch (_error) {
          // Prefixed with underscore to indicate intentionally unused
          console.error('Authorization error:', _error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = Boolean((user as any).isAdmin);
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isAdmin = Boolean((token as any).isAdmin);
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };