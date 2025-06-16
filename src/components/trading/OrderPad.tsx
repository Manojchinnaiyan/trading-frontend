import React, { useState, useEffect } from "react";
import { X, Minus, Plus } from "lucide-react";
import type {
  Stock,
  OrderType,
  OrderCategory,
  OrderPadData,
} from "../../types/trading";
import Button from "../common/Button";
import Input from "../common/Input";

interface OrderPadProps {
  stock: Stock;
  type: OrderType;
  onClose: () => void;
  onSubmit: (orderData: OrderPadData) => void;
  className?: string;
}

const OrderPad: React.FC<OrderPadProps> = ({
  stock,
  type,
  onClose,
  onSubmit,
  className = "",
}) => {
  const [orderData, setOrderData] = useState({
    quantity: 1,
    price: stock.current_price || stock.ltp || 0,
    orderType: "MARKET" as OrderCategory,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Update price when stock changes
    setOrderData((prev) => ({
      ...prev,
      price: stock.current_price || stock.ltp || 0,
    }));
  }, [stock]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (orderData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (orderData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData: OrderPadData = {
      symbol: stock.symbol,
      quantity: orderData.quantity,
      price: orderData.price,
      orderType: orderData.orderType,
      type,
    };

    onSubmit(submitData);
  };

  const handleQuantityChange = (delta: number) => {
    setOrderData((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  const handlePriceChange = (value: number) => {
    setOrderData((prev) => ({
      ...prev,
      price: Math.max(0.01, value),
    }));
  };

  const totalValue = orderData.quantity * orderData.price;
  const isMarketOrder = orderData.orderType === "MARKET";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end mb-16">
      <div
        className={`w-full bg-white rounded-t-xl animate-slide-up ${
          type === "BUY"
            ? "border-t-4 border-success-500"
            : "border-t-4 border-danger-500"
        } ${className}`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3
                className={`text-xl font-bold ${
                  type === "BUY" ? "text-success-600" : "text-danger-600"
                }`}
              >
                {type} {stock.symbol}
              </h3>
              <p className="text-sm text-gray-600">
                LTP: {formatCurrency(stock.current_price || stock.ltp || 0)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Type
              </label>
              <div className="flex space-x-2">
                {(["MARKET", "LIMIT"] as OrderCategory[]).map((orderType) => (
                  <button
                    key={orderType}
                    type="button"
                    onClick={() =>
                      setOrderData((prev) => ({ ...prev, orderType }))
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      orderData.orderType === orderType
                        ? "bg-primary-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {orderType}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={orderData.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>

                <Input
                  type="number"
                  min="1"
                  value={orderData.quantity}
                  onChange={(e) =>
                    setOrderData((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value) || 1,
                    }))
                  }
                  error={errors.quantity}
                  className="text-center"
                  fullWidth={false}
                />

                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price {isMarketOrder && "(Market Order)"}
              </label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={orderData.price}
                onChange={(e) =>
                  handlePriceChange(parseFloat(e.target.value) || 0)
                }
                error={errors.price}
                disabled={isMarketOrder}
                placeholder="Enter price"
              />
              {isMarketOrder && (
                <p className="text-xs text-gray-500 mt-1">
                  Market orders execute at the current market price
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-gray-900">Order Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">
                    {orderData.quantity} shares
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">
                    {isMarketOrder
                      ? "Market Price"
                      : formatCurrency(orderData.price)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-gray-900 font-medium">
                    Total Value:
                  </span>
                  <span className="font-bold text-lg">
                    {formatCurrency(totalValue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant={type === "BUY" ? "success" : "danger"}
              size="lg"
              fullWidth
              className="font-semibold"
            >
              {type} {orderData.quantity} shares for{" "}
              {formatCurrency(totalValue)}
            </Button>
          </form>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center mt-4">
            By placing this order, you agree to the terms and conditions of
            trading.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderPad;
