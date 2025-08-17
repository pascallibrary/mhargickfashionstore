// components/status/StatusComponents.tsx
// Reusable status components to prevent errors and ensure consistency

import React from 'react';
import { 
  OrderStatus, 
  PaymentStatus, 
  getOrderStatusConfig, 
  getPaymentStatusConfig,
  getNextOrderStatuses,
  getCustomerStatusMessage,
  isOrderCancellable
} from '@/lib/types/status';

// Base Status Badge Component
interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus;
  type: 'order' | 'payment';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type, 
  size = 'md', 
  showIcon = true 
}) => {
  const config = type === 'order' 
    ? getOrderStatusConfig(status as OrderStatus)
    : getPaymentStatusConfig(status as PaymentStatus);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${sizeClasses[size]}`}>
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
};

// Order Status Badge (type-safe wrapper)
interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, ...props }) => {
  return <StatusBadge status={status} type="order" {...props} />;
};

// Payment Status Badge (type-safe wrapper)
interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, ...props }) => {
  return <StatusBadge status={status} type="payment" {...props} />;
};

// Status Update Dropdown for Admin
interface StatusUpdateDropdownProps {
  currentStatus: OrderStatus;
  onStatusChange: (newStatus: OrderStatus) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}

export const StatusUpdateDropdown: React.FC<StatusUpdateDropdownProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
  loading = false
}) => {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const nextStatuses = getNextOrderStatuses(currentStatus);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (isUpdating || disabled) return;
    
    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
      // You might want to show a toast notification here
    } finally {
      setIsUpdating(false);
    }
  };

  if (nextStatuses.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No status changes available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Update Order Status
      </label>
      <select
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
        disabled={disabled || loading || isUpdating}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value={currentStatus}>
          {getOrderStatusConfig(currentStatus).label} (Current)
        </option>
        {nextStatuses.map((status) => (
          <option key={status} value={status}>
            Change to {getOrderStatusConfig(status).label}
          </option>
        ))}
      </select>
      {(isUpdating || loading) && (
        <div className="text-sm text-blue-600">Updating status...</div>
      )}
    </div>
  );
};

// Status Timeline Component
interface StatusTimelineProps {
  currentStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  timestamps?: Partial<Record<OrderStatus, Date>>;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  paymentStatus,
  timestamps = {}
}) => {
  const statuses: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED
  ];

  const getCurrentStatusIndex = () => {
    return statuses.indexOf(currentStatus);
  };

  const isStatusCompleted = (status: OrderStatus) => {
    const statusIndex = statuses.indexOf(status);
    const currentIndex = getCurrentStatusIndex();
    return statusIndex <= currentIndex && currentStatus !== OrderStatus.CANCELLED;
  };

  const isStatusCurrent = (status: OrderStatus) => {
    return status === currentStatus;
  };

  if (currentStatus === OrderStatus.CANCELLED) {
    return (
      <div className="flex items-center space-x-2 p-4 bg-red-50 rounded-lg">
        <span className="text-red-600">❌</span>
        <span className="text-red-800 font-medium">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Order Progress</h3>
        <PaymentStatusBadge status={paymentStatus} size="sm" />
      </div>
      
      <div className="space-y-3">
        {statuses.map((status, index) => {
          const config = getOrderStatusConfig(status);
          const isCompleted = isStatusCompleted(status);
          const isCurrent = isStatusCurrent(status);
          const timestamp = timestamps[status];

          return (
            <div key={status} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted 
                  ? 'bg-green-100 text-green-600' 
                  : isCurrent 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {isCompleted ? '✓' : isCurrent ? config.icon : index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {config.label}
                </div>
                <div className={`text-xs ${
                  isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {config.description}
                </div>
                {timestamp && (
                  <div className="text-xs text-gray-500 mt-1">
                    {timestamp.toLocaleDateString()} at {timestamp.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Customer Status Message Component
interface CustomerStatusMessageProps {
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export const CustomerStatusMessage: React.FC<CustomerStatusMessageProps> = ({
  orderStatus,
  paymentStatus,
  trackingNumber,
  estimatedDelivery
}) => {
  const message = getCustomerStatusMessage(orderStatus, paymentStatus);
  const orderConfig = getOrderStatusConfig(orderStatus);

  const getMessageColor = () => {
    if (paymentStatus === PaymentStatus.FAILED || orderStatus === OrderStatus.CANCELLED) {
      return 'bg-red-50 border-red-200 text-red-800';
    }
    if (orderStatus === OrderStatus.DELIVERED) {
      return 'bg-green-50 border-green-200 text-green-800';
    }
    if (paymentStatus === PaymentStatus.PENDING) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
    return 'bg-blue-50 border-blue-200 text-blue-800';
  };

  return (
    <div className={`p-4 rounded-lg border ${getMessageColor()}`}>
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{orderConfig.icon}</span>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <OrderStatusBadge status={orderStatus} size="sm" showIcon={false} />
            <PaymentStatusBadge status={paymentStatus} size="sm" showIcon={false} />
          </div>
          <p className="text-sm font-medium mb-1">{message}</p>
          
          {trackingNumber && orderStatus === OrderStatus.SHIPPED && (
            <p className="text-xs">
              Tracking Number: <span className="font-mono">{trackingNumber}</span>
            </p>
          )}
          
          {estimatedDelivery && orderStatus === OrderStatus.SHIPPED && (
            <p className="text-xs">
              Estimated Delivery: {estimatedDelivery.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Order Actions Component
interface OrderActionsProps {
  orderStatus: OrderStatus;
  onCancel?: () => Promise<void>;
  onReorder?: () => void;
  onTrackOrder?: () => void;
  onReturnRequest?: () => void;
}

export const OrderActions: React.FC<OrderActionsProps> = ({
  orderStatus,
  onCancel,
  onReorder,
  onTrackOrder,
  onReturnRequest
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const canCancel = isOrderCancellable(orderStatus);

  const handleCancel = async () => {
    if (!onCancel || isLoading) return;
    
    setIsLoading(true);
    try {
      await onCancel();
    } catch (error) {
      console.error('Failed to cancel order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {canCancel && onCancel && (
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Cancelling...' : 'Cancel Order'}
        </button>
      )}
      
      {orderStatus === OrderStatus.SHIPPED && onTrackOrder && (
        <button
          onClick={onTrackOrder}
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
        >
          Track Order
        </button>
      )}
      
      {orderStatus === OrderStatus.DELIVERED && onReturnRequest && (
        <button
          onClick={onReturnRequest}
          className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200"
        >
          Request Return
        </button>
      )}
      
      {(orderStatus === OrderStatus.DELIVERED || orderStatus === OrderStatus.CANCELLED) && onReorder && (
        <button
          onClick={onReorder}
          className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
        >
          Reorder
        </button>
      )}
    </div>
  );
};

// Quick Status Filter Component for Admin
interface StatusFilterProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  statusCounts: Record<string, number>;
}

export const OrderStatusFilter: React.FC<StatusFilterProps> = ({
  currentFilter,
  onFilterChange,
  statusCounts
}) => {
  const filters = [
    { value: 'all', label: 'All Orders' },
    { value: OrderStatus.PENDING, label: 'Pending' },
    { value: OrderStatus.CONFIRMED, label: 'Confirmed' },
    { value: OrderStatus.PROCESSING, label: 'Processing' },
    { value: OrderStatus.SHIPPED, label: 'Shipped' },
    { value: OrderStatus.DELIVERED, label: 'Delivered' },
    { value: OrderStatus.CANCELLED, label: 'Cancelled' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const count = statusCounts[filter.value] || 0;
        const isActive = currentFilter === filter.value;
        
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
            {count > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                isActive ? 'bg-blue-500' : 'bg-gray-300'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};