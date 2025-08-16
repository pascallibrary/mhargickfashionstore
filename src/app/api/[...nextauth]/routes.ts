import NextAuth from "next-auth";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { adapter } from "next/dist/server/web/adapter";
import { prisma } from '@/lib/prisma'

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        // Add GoogleProvider or CredentialsProvider as needed
    ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
