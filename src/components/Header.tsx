// Navbar with cool, spaced buttons for Mhargick Fashion Store
'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function Header() {
  const { data: session } = useSession();

  // Button animation variants
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 0 15px rgba(236, 72, 153, 0.5)' },
    tap: { scale: 0.95 },
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-white py-4 sticky top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl md:text-3xl font-bold tracking-tight no-underline">
          Mhargick Fashion
        </Link>
        <nav className="flex items-center space-x-4 md:space-x-6">
          <Link href="/">
            <motion.span
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-4 py-2 rounded-full bg-gray-800 hover:bg-pink-500 text-white transition-colors duration-300 text-sm md:text-base font-medium no-underline"
            >
              Home
            </motion.span>
          </Link>
          <Link href="/cart">
            <motion.span
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-4 py-2 rounded-full bg-gray-800 hover:bg-pink-500 text-white transition-colors duration-300 text-sm md:text-base font-medium no-underline"
            >
              Cart
            </motion.span>
          </Link>
          {session ? (
            <>
              <Link href="/orders">
                <motion.span
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-4 py-2 rounded-full bg-gray-800 hover:bg-pink-500 text-white transition-colors duration-300 text-sm md:text-base font-medium no-underline"
                >
                  Orders
                </motion.span>
              </Link>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => signOut()}
                className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-300 text-sm md:text-base font-medium"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <Link href="/auth/signin">
              <motion.span
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-4 py-2 rounded-full bg-green-400 hover:bg-green-500 text-gray-900 transition-colors duration-300 text-sm md:text-base font-medium no-underline"
              >
                Login
              </motion.span>
            </Link>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
