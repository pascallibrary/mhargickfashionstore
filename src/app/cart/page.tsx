'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import CartItemComp from '@/components/CartItem';
import PaystackPop from '@paystack/inline-js';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Types (aligned with Prisma schema)
interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string; // Changed from 'image' to match schema
  };
}

interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
  message: string;
}

export default function Cart() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [total, setTotal] = useState(0);

  const { data: cartItems, isLoading, error } = useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await fetch('/api/cart');
      if (!res.ok) {
        throw new Error('Failed to fetch cart items');
      }
      const data = await res.json();
      return data;
    },
    enabled: !!session,
  });

  // Calculate total whenever cartItems change
  useEffect(() => {
    if (cartItems) {
      const calcTotal = cartItems.reduce((acc: number, item: CartItem) => 
        acc + item.product.price * item.quantity, 0
      );
      setTotal(calcTotal);
    }
  }, [cartItems]);

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cart/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to remove item');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      alert('Failed to remove item from cart');
      console.error('Remove error:', error);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) {
        throw new Error('Failed to update quantity');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      alert('Failed to update quantity');
      console.error('Update quantity error:', error);
    },
  });

  const handleCheckout = () => {
    if (!session?.user?.email) {
      alert('Please login to checkout');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (total <= 0) {
      alert('Invalid cart total');
      return;
    }

    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      alert('Payment system not configured');
      return;
    }

    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: session.user.email,
      amount: total * 100, // Convert to kobo
      currency: 'NGN',
      onSuccess: async (transaction: PaystackResponse) => {
        try {
          // Create order on success
          const orderRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              transactionRef: transaction.reference, 
              total,
              items: cartItems 
            }),
          });

          if (!orderRes.ok) {
            throw new Error('Failed to create order');
          }

          // Clear cart
          const clearRes = await fetch('/api/cart', { method: 'DELETE' });
          if (!clearRes.ok) {
            console.warn('Failed to clear cart');
          }

          queryClient.invalidateQueries({ queryKey: ['cart'] });
          alert('Payment successful! Order created.');
        } catch (error) {
          console.error('Post-payment error:', error);
          alert('Payment successful but there was an issue creating your order. Please contact support.');
        }
      },
      onCancel: () => {
        alert('Payment was cancelled');
      },
    });
  };

  // Loading states
  if (status === 'loading') return <p className="text-center text-gray-600">Loading...</p>;
  if (!session) return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-4">Please login to view your cart.</p>
      <Link href="/auth/signin" className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600">
        Login
      </Link>
    </div>
  );
  if (isLoading) return <p className="text-center text-gray-600">Loading cart...</p>;
  if (error) return <p className="text-center text-red-500">Error loading cart. Please try again.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      {!cartItems || cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link 
            href="/products" 
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item: CartItem) => (
              <CartItemComp
                key={item.id}
                item={item}
                onRemove={(id) => removeMutation.mutate(id)}
                onUpdateQuantity={(id, qty) => updateQuantityMutation.mutate({ id, quantity: qty })}
                isUpdating={updateQuantityMutation.isPending}
                isRemoving={removeMutation.isPending}
              />
            ))}
          </div>
          
          <div className="mt-8 خانه-t pt-6">
            <div className="text-right">
              <p className="text-2xl font-bold mb-4">
                Total: ₦{total.toLocaleString()}
              </p>
              <button 
                onClick={handleCheckout} 
                disabled={total <= 0}
                className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Checkout with Paystack
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}