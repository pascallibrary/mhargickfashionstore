'use client';

import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'product' | 'cart' | 'list';
}

function SkeletonLoader({ variant = 'product' }: SkeletonLoaderProps) {
  const shimmer = {
    initial: { opacity: 0.3 },
    animate: { opacity: 1 },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut' as const,
    },
  };

  if (variant === 'product') {
    return (
      <motion.div
        className="bg-gray-800 p-4 rounded-xl shadow-lg animate-pulse"
        {...shimmer}
      >
        <div className="w-full h-56 bg-gray-700 rounded-md mb-4"></div>
        <div className="h-6 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-24 mb-3"></div>
        <div className="h-10 bg-gray-700 rounded"></div>
      </motion.div>
    );
  }

  if (variant === 'cart') {
    return (
      <motion.div
        className="flex items-center border-b border-gray-700 py-4 gap-4 animate-pulse"
        {...shimmer}
      >
        <div className="w-20 h-20 bg-gray-700 rounded-md flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-24 bg-gray-700 rounded"></div>
          <div className="h-8 w-16 bg-gray-700 rounded"></div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'list') {
    return (
      <motion.div
        className="border-b border-gray-700 py-4 animate-pulse"
        {...shimmer}
      >
        <div className="space-y-3">
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        </div>
      </motion.div>
    );
  }

  return null;
}

export default SkeletonLoader;

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <SkeletonLoader key={index} variant="product" />
      ))}
    </div>
  );
}

export function CartSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <SkeletonLoader key={index} variant="cart" />
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, index) => (
        <SkeletonLoader key={index} variant="list" />
      ))}
    </div>
  );
}