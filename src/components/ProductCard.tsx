'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  imageUrl: string;
  stock: number;
  slug: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = Number(product.price);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)' }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 p-4 rounded-xl shadow-lg overflow-hidden"
    >
     
      <h2 className="text-xl font-semibold text-white mb-2">{product.name}</h2>
      <div className="flex items-center gap-2 mb-3">
        {salePrice ? (
          <>
            <p className="text-lg font-bold text-pink-500">₦{salePrice.toLocaleString()}</p>
            <p className="text-sm text-gray-400 line-through">₦{price.toLocaleString()}</p>
          </>
        ) : (
          <p className="text-lg font-bold text-white">₦{price.toLocaleString()}</p>
        )}
      </div>
      <Link
        href={`/products/${product.id}`}
        className="btn-primary block text-center"
      >
        View Details
      </Link>
    </motion.div>
  );
}