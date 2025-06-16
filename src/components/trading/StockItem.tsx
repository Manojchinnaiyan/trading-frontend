import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Holding, Position, Stock } from "../../types/trading";

interface StockItemProps {
  stock: Holding | Position | Stock;
  type?: "holding" | "position";
  onSelect?: (stock: Holding | Position | Stock) => void;
  className?: string;
}

const StockItem: React.FC<StockItemProps> = ({
  stock,
  type = "holding",
  onSelect,
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

  const formatPercentage = (percent: number): string => {
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;
  };

  const getPNLData = () => {
    if (type === "position" && "unrealized_pnl" in stock) {
      return {
        pnl: stock.unrealized_pnl,
        pnlPercent: stock.unrealized_pnl_percent,
      };
    } else if ("pnl" in stock) {
      return {
        pnl: stock.pnl,
        pnlPercent: stock.pnl_percent,
      };
    }
    return { pnl: 0, pnlPercent: 0 };
  };

  const { pnl, pnlPercent } = getPNLData();
  const currentPrice = stock.current_price || (stock as any).ltp || 0;
  const avgPrice = stock.average_price || (stock as any).avgPrice || 0;

  const getPNLColor = (value: number): string => {
    return value >= 0 ? "text-success-600" : "text-danger-600";
  };

  const getBgColor = (value: number): string => {
    return value >= 0 ? "bg-success-50" : "bg-danger-50";
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(stock);
    }
  };

  return (
    <div
      className={`bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        onSelect ? "cursor-pointer" : ""
      } ${className}`}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          {/* Left Side - Stock Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-gray-900 text-lg truncate">
                {stock.symbol}
              </h4>
              {type === "position" && "position_type" in stock && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    stock.position_type === "LONG"
                      ? "bg-success-100 text-success-800"
                      : "bg-danger-100 text-danger-800"
                  }`}
                >
                  {stock.position_type}
                </span>
              )}
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Qty: {stock.quantity}</span>
                <span>Avg: {formatCurrency(avgPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>LTP: {formatCurrency(currentPrice)}</span>
                <span className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - P&L */}
          <div className="text-right ml-4">
            <div
              className={`inline-flex items-center px-2 py-1 rounded ${getBgColor(
                pnl
              )}`}
            >
              {pnl >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1 text-success-600" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1 text-danger-600" />
              )}
              <div>
                <p className={`text-sm font-semibold ${getPNLColor(pnl)}`}>
                  {formatCurrency(pnl)}
                </p>
                <p className={`text-xs ${getPNLColor(pnlPercent)}`}>
                  {formatPercentage(pnlPercent)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info for Holdings */}
        {type === "holding" && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Market Value: {formatCurrency(currentPrice * stock.quantity)}
              </span>
              <span>Invested: {formatCurrency(avgPrice * stock.quantity)}</span>
            </div>
          </div>
        )}

        {/* Additional Info for Positions */}
        {type === "position" && "position_type" in stock && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Current Value: {formatCurrency(currentPrice * stock.quantity)}
              </span>
              <span>Day Change: {formatCurrency(pnl)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockItem;
