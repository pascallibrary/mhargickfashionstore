'use client';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

interface CartItemProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

export default function CartItem({ item, onRemove, onUpdateQuantity, isUpdating, isRemoving }: CartItemProps) {
  return (
    <div className="flex items-center border-b py-4">
      <img
        src={item.product.imageUrl}
        alt={item.product.name}
        className="w-24 h-24 object-cover rounded-md"
      />
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold">{item.product.name}</h3>
        <p className="text-gray-600">₦{item.product.price.toLocaleString()} x {item.quantity}</p>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={isUpdating}
          className="px-2 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-400"
        >
          +
        </button>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1 || isUpdating}
          className="px-2 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-400"
        >
          -
        </button>
        <button
          onClick={() => onRemove(item.id)}
          disabled={isRemoving}
          className="px-2 py-1 text-red-500 disabled:text-gray-400"
        >
          Remove
        </button>
      </div>
    </div>
  );
}