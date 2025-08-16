'use client';

import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import SkeletonLoader, { ProductGridSkeleton } from '@/components/SkeletonLoader';

// Type for the product (adjust based on your actual product structure)
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
    isError 
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (isError) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="text-center py-12"
      >
        <div className="max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error instanceof Error ? error.message : 'Failed to load products'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* Hero Section */}
      <motion.section 
        variants={itemVariants}
        className="text-center py-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white mb-12 rounded-lg"
      >
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Mhargick Fashion
        </h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Discover authentic African fashion with modern style. 
          From traditional Agbadas to contemporary designs.
        </p>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Featured Products
          </h2>
          <motion.a
            href="/products"
            className="text-indigo-500 hover:text-indigo-600 font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            View All →
          </motion.a>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : products && products.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products
              .filter(product => product.isFeatured)
              .slice(0, 6)
              .map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
          </motion.div>
        ) : (
          <motion.div 
            variants={itemVariants}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Products Available
            </h3>
            <p className="text-gray-500">
              We're working on adding amazing products. Check back soon!
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* All Products Section */}
      {!isLoading && products && products.length > 0 && (
        <motion.section variants={itemVariants} className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            All Products
          </h2>
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
        className="mt-16 bg-gray-50 rounded-lg p-8 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Stay Updated
        </h3>
        <p className="text-gray-600 mb-6">
          Get notified about new arrivals and exclusive offers
        </p>
        <div className="flex max-w-md mx-auto gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Subscribe
          </motion.button>
        </div>
      </motion.section>
    </motion.div>
  );
}