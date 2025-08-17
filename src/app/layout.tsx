'use client';

import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { QueryProvider } from '@/components/QueryProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <QueryProvider>
            <Header />
            <main className="container mx-auto px-4">{children}</main>
            <Footer />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}