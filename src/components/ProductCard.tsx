'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';


interface Product {
  id: string;
  name: string;
  price: number | any; 
  salePrice?: number | any | null;
  imageUrl: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Convert price to number safely
  const price = Number(product.price);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
      className="bg-white p-4 rounded-lg shadow-md"
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
      />
      <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
      
      <div className="flex items-center gap-2 mt-1">
        {salePrice ? (
          <>
            <p className="text-lg font-bold text-red-600">₦{salePrice.toLocaleString()}</p>
            <p className="text-sm text-gray-500 line-through">₦{price.toLocaleString()}</p>
          </>
        ) : (
          <p className="text-lg font-bold text-gray-800">₦{price.toLocaleString()}</p>
        )}
      </div>

      <Link
        href={`/products/${product.id}`}
        className="block mt-2 bg-indigo-500 text-white px-4 py-2 rounded text-center hover:bg-indigo-600 transition-colors"
      >
        View Details
      </Link>
    </motion.div>
  );
}