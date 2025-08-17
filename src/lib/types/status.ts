// lib/types/status.ts
// Order and Payment Status types and utilities for Mhargick Fashion Store

// Define the enums manually to match your Prisma schema exactly
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

// Alternative: Try to import from Prisma client, fallback to manual definitions
// Uncomment this block and comment out the above enums once Prisma client is generated
/*
try {
  export { OrderStatus, PaymentStatus } from '@prisma/client';
} catch (error) {
  // Fallback to manual enum definitions above
  console.warn('Prisma client not available, using manual enum definitions');
}
*/

// Order Status configurations
export const ORDER_STATUS_CONFIG = {
  [OrderStatus.PENDING]: {
    label: 'Pending',
    description: 'Order has been placed and is awaiting confirmation',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
    canCancel: true,
    canEdit: true,
  },
  [OrderStatus.CONFIRMED]: {
    label: 'Confirmed',
    description: 'Order has been confirmed and payment received',
    color: 'bg-blue-100 text-blue-800',
    icon: '✅',
    canCancel: true,
    canEdit: false,
  },
  [OrderStatus.PROCESSING]: {
    label: 'Processing',
    description: 'Order is being prepared for shipment',
    color: 'bg-purple-100 text-purple-800',
    icon: '📦',
    canCancel: false,
    canEdit: false,
  },
  [OrderStatus.SHIPPED]: {
    label: 'Shipped',
    description: 'Order has been shipped and is on the way',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '🚚',
    canCancel: false,
    canEdit: false,
  },
  [OrderStatus.DELIVERED]: {
    label: 'Delivered',
    description: 'Order has been successfully delivered',
    color: 'bg-green-100 text-green-800',
    icon: '🎉',
    canCancel: false,
    canEdit: false,
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelled',
    description: 'Order has been cancelled',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
    canCancel: false,
    canEdit: false,
  },
  [OrderStatus.RETURNED]: {
    label: 'Returned',
    description: 'Order has been returned by the customer',
    color: 'bg-gray-100 text-gray-800',
    icon: '↩️',
    canCancel: false,
    canEdit: false,
  },
} as const;

// Payment Status configurations
export const PAYMENT_STATUS_CONFIG = {
  [PaymentStatus.PENDING]: {
    label: 'Pending',
    description: 'Payment is pending or in progress',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
    isPaid: false,
  },
  [PaymentStatus.PAID]: {
    label: 'Paid',
    description: 'Payment has been successfully processed',
    color: 'bg-green-100 text-green-800',
    icon: '💰',
    isPaid: true,
  },
  [PaymentStatus.FAILED]: {
    label: 'Failed',
    description: 'Payment failed or was declined',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
    isPaid: false,
  },
  [PaymentStatus.REFUNDED]: {
    label: 'Refunded',
    description: 'Payment has been refunded to the customer',
    color: 'bg-blue-100 text-blue-800',
    icon: '🔄',
    isPaid: false,
  },
} as const;

// Status transition helpers
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.RETURNED],
  [OrderStatus.DELIVERED]: [OrderStatus.RETURNED],
  [OrderStatus.CANCELLED]: [], // Terminal state
  [OrderStatus.RETURNED]: [], // Terminal state
};

// Utility functions
export const getOrderStatusConfig = (status: OrderStatus) => {
  return ORDER_STATUS_CONFIG[status];
};

export const getPaymentStatusConfig = (status: PaymentStatus) => {
  return PAYMENT_STATUS_CONFIG[status];
};

export const canTransitionOrderStatus = (
  from: OrderStatus,
  to: OrderStatus
): boolean => {
  return ORDER_STATUS_TRANSITIONS[from].includes(to);
};

export const getNextOrderStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  return ORDER_STATUS_TRANSITIONS[currentStatus];
};

export const isOrderCancellable = (status: OrderStatus): boolean => {
  return ORDER_STATUS_CONFIG[status].canCancel;
};

export const isOrderEditable = (status: OrderStatus): boolean => {
  return ORDER_STATUS_CONFIG[status].canEdit;
};

export const isPaymentCompleted = (status: PaymentStatus): boolean => {
  return PAYMENT_STATUS_CONFIG[status].isPaid;
};

// Status filter helpers for admin dashboard
export const ORDER_STATUS_FILTERS = [
  { value: 'all', label: 'All Orders', count: 0 },
  { value: OrderStatus.PENDING, label: 'Pending', count: 0 },
  { value: OrderStatus.CONFIRMED, label: 'Confirmed', count: 0 },
  { value: OrderStatus.PROCESSING, label: 'Processing', count: 0 },
  { value: OrderStatus.SHIPPED, label: 'Shipped', count: 0 },
  { value: OrderStatus.DELIVERED, label: 'Delivered', count: 0 },
  { value: OrderStatus.CANCELLED, label: 'Cancelled', count: 0 },
  { value: OrderStatus.RETURNED, label: 'Returned', count: 0 },
];

export const PAYMENT_STATUS_FILTERS = [
  { value: 'all', label: 'All Payments', count: 0 },
  { value: PaymentStatus.PENDING, label: 'Pending', count: 0 },
  { value: PaymentStatus.PAID, label: 'Paid', count: 0 },
  { value: PaymentStatus.FAILED, label: 'Failed', count: 0 },
  { value: PaymentStatus.REFUNDED, label: 'Refunded', count: 0 },
];

// Customer-facing status messages
export const getCustomerStatusMessage = (
  orderStatus: OrderStatus,
  paymentStatus: PaymentStatus
): string => {
  if (paymentStatus === PaymentStatus.FAILED) {
    return 'Payment failed. Please try again or contact support.';
  }
  
  if (paymentStatus === PaymentStatus.PENDING) {
    return 'Waiting for payment confirmation...';
  }

  switch (orderStatus) {
    case OrderStatus.PENDING:
      return 'Your order is being reviewed and will be confirmed shortly.';
    case OrderStatus.CONFIRMED:
      return 'Your order has been confirmed and is being prepared.';
    case OrderStatus.PROCESSING:
      return 'Your order is being packed and will ship soon.';
    case OrderStatus.SHIPPED:
      return 'Your order is on its way! Check your tracking number for updates.';
    case OrderStatus.DELIVERED:
      return 'Your order has been delivered. Enjoy your purchase!';
    case OrderStatus.CANCELLED:
      return 'Your order has been cancelled. Any payment will be refunded.';
    case OrderStatus.RETURNED:
      return 'Your order has been returned and refund is being processed.';
    default:
      return 'Order status unknown. Please contact support.';
  }
};

// Type guards
export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return Object.values(OrderStatus).includes(status as OrderStatus);
};

export const isValidPaymentStatus = (status: string): status is PaymentStatus => {
  return Object.values(PaymentStatus).includes(status as PaymentStatus);
};