// Navbar with cart icon and login
'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function Header() {
  const { data: session } = useSession();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-indigo-600 text-white py-4"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Mhargick Fashion
        </Link>
        <nav className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/cart">Cart</Link>
          {session ? (
            <>
              <Link href="/orders">Orders</Link>
              <button onClick={() => signOut()}>Logout</button>
            </>
          ) : (
            <Link href="/auth/signin">Login</Link>
          )}
        </nav>
      </div>
    </motion.header>
  );
}