// Product detail page
'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function ProductDetail() {
  const params = useParams();
  const { id } = params;
  const { data: session } = useSession();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const handleAddToCart = async () => {
    if (!session) return alert('Please login');
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, quantity: 1 }),
    });
    // Invalidate query or show toast
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row gap-8">
      <img src={product.imageUrl} alt={product.name} className="w-full md:w-1/2 h-96 object-cover rounded" />
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl mt-2">₦{product.price.toLocaleString()}</p>
        <p className="mt-4">{product.description}</p>
        <button onClick={handleAddToCart} className="mt-6 bg-indigo-500 text-white px-6 py-3 rounded">
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}