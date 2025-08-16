// User orders history
'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export default function Orders() {
  const { data: session } = useSession();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => (await fetch('/api/orders')).json(),
    enabled: !!session,
  });

  if (!session) return <p>Please login.</p>;
  if (isLoading) return <p>Loading orders...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders?.map((order: any) => (
        <div key={order.id} className="border p-4 mb-4 rounded">
          <p>Order ID: {order.id}</p>
          <p>Total: ₦{order.total.toLocaleString()}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
}