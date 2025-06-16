import React from "react";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { Order } from "../../types/trading";

interface OrderItemProps {
  order: Order;
  onOrderSelect?: (order: Order) => void;
  className?: string;
}

const OrderItem: React.FC<OrderItemProps> = ({
  order,
  onOrderSelect,
  className = "",
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return {
          color: "text-success-700 bg-success-50 border-success-200",
          icon: CheckCircle,
          text: "Completed",
        };
      case "PENDING":
        return {
          color: "text-warning-700 bg-warning-50 border-warning-200",
          icon: Clock,
          text: "Pending",
        };
      case "CANCELLED":
        return {
          color: "text-gray-700 bg-gray-50 border-gray-200",
          icon: XCircle,
          text: "Cancelled",
        };
      case "REJECTED":
        return {
          color: "text-danger-700 bg-danger-50 border-danger-200",
          icon: AlertCircle,
          text: "Rejected",
        };
      default:
        return {
          color: "text-gray-700 bg-gray-50 border-gray-200",
          icon: Clock,
          text: status,
        };
    }
  };

  const getOrderTypeColor = (type: string): string => {
    return type.toUpperCase() === "BUY"
      ? "text-success-700 bg-success-100"
      : "text-danger-700 bg-danger-100";
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const totalValue = order.quantity * order.price;

  const handleClick = () => {
    if (onOrderSelect) {
      onOrderSelect(order);
    }
  };

  return (
    <div
      className={`bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        onOrderSelect ? "cursor-pointer" : ""
      } ${className}`}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          {/* Left Side - Order Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-gray-900 text-lg">
                {order.symbol}
              </h4>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getOrderTypeColor(
                  order.order_type
                )}`}
              >
                {order.order_type}
              </span>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Quantity: {order.quantity}</span>
                <span>Price: {formatCurrency(order.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total: {formatCurrency(totalValue)}</span>
                <span className="text-xs text-gray-500">ID: {order.id}</span>
              </div>
            </div>
          </div>

          {/* Right Side - Status */}
          <div className="text-right ml-4">
            <div
              className={`inline-flex items-center px-2 py-1 rounded border text-xs font-medium ${statusConfig.color}`}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.text}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Placed: {formatDateTime(order.order_time)}
            </span>
            {order.executed_time && (
              <span className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-1 text-success-500" />
                Executed: {formatDateTime(order.executed_time)}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar for Pending Orders */}
        {order.status.toUpperCase() === "PENDING" && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Processing...</span>
              <span>Please wait</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-warning-500 h-1 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        )}

        {/* Additional Info for Completed Orders */}
        {order.status.toUpperCase() === "COMPLETED" && order.executed_time && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Execution Time: {formatDateTime(order.executed_time)}</span>
              <span className="text-success-600 font-medium">✓ Successful</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
