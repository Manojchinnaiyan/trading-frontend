import React from "react";
import type { PNLCard as PNLCardType } from "../../types/trading";

interface PNLCardProps {
  pnlData: PNLCardType;
  title?: string;
  className?: string;
}

const PNLCard: React.FC<PNLCardProps> = ({
  pnlData,
  title = "Portfolio Summary",
  className = "",
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (percent: number): string => {
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;
  };

  const getPNLColor = (value: number): string => {
    return value >= 0 ? "text-success-600" : "text-danger-600";
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 mb-4 ${className}`}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Total P&L</p>
            <p
              className={`text-lg font-semibold ${getPNLColor(
                pnlData.total_pnl
              )}`}
            >
              {formatCurrency(pnlData.total_pnl)}
            </p>
            <p className={`text-sm ${getPNLColor(pnlData.total_pnl_percent)}`}>
              {formatPercentage(pnlData.total_pnl_percent)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Realized P&L</p>
            <p
              className={`text-base font-medium ${getPNLColor(
                pnlData.realized_pnl
              )}`}
            >
              {formatCurrency(pnlData.realized_pnl)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Day P&L</p>
            <p
              className={`text-lg font-semibold ${getPNLColor(
                pnlData.day_pnl
              )}`}
            >
              {formatCurrency(pnlData.day_pnl)}
            </p>
            <p className={`text-sm ${getPNLColor(pnlData.day_pnl_percent)}`}>
              {formatPercentage(pnlData.day_pnl_percent)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Unrealized P&L</p>
            <p
              className={`text-base font-medium ${getPNLColor(
                pnlData.unrealized_pnl
              )}`}
            >
              {formatCurrency(pnlData.unrealized_pnl)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PNLCard;
