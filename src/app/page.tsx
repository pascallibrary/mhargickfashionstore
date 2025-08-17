'use client';

import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import SkeletonLoader, { ProductGridSkeleton } from '@/components/SkeletonLoader';
import Link from 'next/link';

// Type for the product (aligned with Prisma schema)
interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  imageUrl: string;
  stock: number;
  isFeatured?: boolean;
  slug: string;
}

export default function Home() {
  const {
    data: products,
    isLoading,
    error,
    isError,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };
  

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-900 text-white"
    >
    

      {/* Featured Products Section */}
      <motion.section variants={itemVariants} className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Hot Picks
          </h2>
          <Link
            href="/products"
            className="text-green-400 hover:text-green-500 font-semibold text-lg transition-colors duration-300 no-underline"
          >
            See All
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : products && products.length > 0 ? (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products
              .filter((product) => product.isFeatured)
              .slice(0, 6)
              .map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No Drops Yet
            </h3>
            <p className="text-gray-400">
              New styles coming soon. Stay tuned!
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* All Products Section */}
      {!isLoading && products && products.length > 0 && (
        <motion.section variants={itemVariants} className="container mx-auto px-4 py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Full Collection
          </h2>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Newsletter Section */}
      <motion.section
        variants={itemVariants}
        className="container mx-auto px-4 py-12 bg-gray-800 rounded-2xl text-center"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Join the Crew
        </h3>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Get first dibs on new drops and exclusive deals.
        </p>
        <div className="flex max-w-sm mx-auto gap-3">
          <input
            type="email"
            placeholder="Your email"
            className="w-2/3 px-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            aria-label="Email for newsletter"
          />
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(233, 236, 72, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-400 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-green-500 transition-colors duration-300"
          >
            Join
          </motion.button>
        </div>
      </motion.section>
    </motion.div>
  );
}