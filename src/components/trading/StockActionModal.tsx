import React from "react";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import type { Stock, OrderType } from "../../types/trading";

interface StockActionModalProps {
  stock: Stock;
  onClose: () => void;
  onActionSelect: (action: OrderType) => void;
}

const StockActionModal: React.FC<StockActionModalProps> = ({
  stock,
  onClose,
  onActionSelect,
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const currentPrice = stock.current_price || stock.ltp || 0;

  const handleBuyClick = () => {
    onActionSelect("BUY");
  };

  const handleSellClick = () => {
    onActionSelect("SELL");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-xl animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {stock.symbol}
              </h3>
              <p className="text-gray-600">
                Current Price: {formatCurrency(currentPrice)}
              </p>
              {stock.quantity && (
                <p className="text-sm text-gray-500">
                  Holdings: {stock.quantity} shares
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 text-center">
              What would you like to do?
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {/* Buy Button */}
              <button
                onClick={handleBuyClick}
                className="flex flex-col items-center justify-center p-6 bg-success-50 hover:bg-success-100 border-2 border-success-200 hover:border-success-300 rounded-lg transition-all transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h5 className="text-lg font-semibold text-success-700 mb-1">
                  BUY
                </h5>
                <p className="text-sm text-success-600 text-center">
                  Purchase {stock.symbol} shares
                </p>
              </button>

              {/* Sell Button */}
              <button
                onClick={handleSellClick}
                className="flex flex-col items-center justify-center p-6 bg-danger-50 hover:bg-danger-100 border-2 border-danger-200 hover:border-danger-300 rounded-lg transition-all transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-danger-500 rounded-full flex items-center justify-center mb-3">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <h5 className="text-lg font-semibold text-danger-700 mb-1">
                  SELL
                </h5>
                <p className="text-sm text-danger-600 text-center">
                  {stock.quantity
                    ? `Sell your ${stock.symbol} shares`
                    : `Short ${stock.symbol} shares`}
                </p>
              </button>
            </div>

            {/* Stock Info */}
            {stock.quantity && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-900 mb-2">
                  Your Holdings
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <span className="ml-2 font-medium">{stock.quantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Price:</span>
                    <span className="ml-2 font-medium">
                      {formatCurrency(stock.average_price || 0)}
                    </span>
                  </div>
                  {stock.pnl !== undefined && (
                    <>
                      <div>
                        <span className="text-gray-600">P&L:</span>
                        <span
                          className={`ml-2 font-medium ${
                            stock.pnl >= 0
                              ? "text-success-600"
                              : "text-danger-600"
                          }`}
                        >
                          {formatCurrency(stock.pnl)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">P&L %:</span>
                        <span
                          className={`ml-2 font-medium ${
                            (stock.pnl_percent || 0) >= 0
                              ? "text-success-600"
                              : "text-danger-600"
                          }`}
                        >
                          {stock.pnl_percent?.toFixed(2)}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockActionModal;
