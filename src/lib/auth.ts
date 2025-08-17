// lib/auth.ts
import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Define the user type explicitly
interface AuthUser extends User {
  id: string;
  email: string;
  name?: string | null;
  isAdmin: boolean;
}

// Extend NextAuth types
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    isAdmin: boolean;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      isAdmin: boolean;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<AuthUser | null> {
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

          // Explicitly type the return object
          return {
            id: user.id,
            name: user.name,
            email: user.email as string, // Type assertion
            isAdmin: Boolean(user.isAdmin),
          } as AuthUser;
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { 
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async signIn({ user }) {
      console.log('User signed in:', user.email);
    },
    async signOut() {
      console.log('User signed out');
    },
  },
  debug: process.env.NODE_ENV === 'development',
};