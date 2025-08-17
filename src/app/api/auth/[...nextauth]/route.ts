// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Extend NextAuth types - Make isAdmin required to avoid undefined issues
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    isAdmin: boolean; // Make this required, not optional
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      isAdmin: boolean; // Make this required, not optional
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean; // Make this required, not optional
  }
}

export const authOptions: NextAuthOptions = {
  // Note: Remove PrismaAdapter when using credentials provider with JWT strategy
  // The adapter is mainly for database sessions and OAuth providers
  // adapter: PrismaAdapter(prisma),
  
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          // Validate input
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { 
              email: credentials.email.toLowerCase() 
            }
          });

          // Check if user exists and has password
          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          // Return user object - ensure isAdmin is always boolean
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: Boolean(user.isAdmin), // Ensure it's always boolean
          };
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
      // Initial sign in - add user properties to token
      if (user) {
        token.id = user.id;
        token.isAdmin = Boolean(user.isAdmin); // Ensure boolean type
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.id;
        session.user.isAdmin = Boolean(token.isAdmin); // Ensure boolean type
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };