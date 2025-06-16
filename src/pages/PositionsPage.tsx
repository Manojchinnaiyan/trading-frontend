import React, { useState } from "react";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { tradingApi } from "../services/api/tradingApi";
import { useApi } from "../hooks/useApi";
import type { Position, OrderType } from "../types/trading";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import PNLCard from "../components/trading/PNLCard";
import StockItem from "../components/trading/StockItem";
import StockActionModal from "../components/trading/StockActionModal";
import OrderPad from "../components/trading/OrderPad";
import Header from "../components/layout/Header";
import FloatingActionButton from "../components/layout/FloatingActionButton";

const PositionsPage: React.FC = () => {
  const { data, loading, error, refetch } = useApi(tradingApi.getPositions);
  const [selectedStock, setSelectedStock] = useState<Position | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [orderPadType, setOrderPadType] = useState<OrderType | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<"ALL" | "LONG" | "SHORT">("ALL");

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleStockSelect = (stock: Position) => {
    console.log("Position selected:", stock);
    setSelectedStock(stock);
    setShowActionModal(true);
  };

  const handleActionSelect = (action: OrderType) => {
    setOrderPadType(action);
    setShowActionModal(false);
  };

  const handleOrderSubmit = (orderData: any) => {
    console.log("Order submitted:", orderData);
    alert(
      `Order placed: ${orderData.type} ${orderData.quantity} shares of ${orderData.symbol} at ₹${orderData.price}`
    );
    setSelectedStock(null);
    setOrderPadType(null);
  };

  const handleOrderPadClose = () => {
    setSelectedStock(null);
    setOrderPadType(null);
  };

  const handleActionModalClose = () => {
    setShowActionModal(false);
    setSelectedStock(null);
  };

  const handleFABOrderSelect = (type: OrderType) => {
    console.log("FAB order type selected:", type);
    setOrderPadType(type);

    // Select first position if none selected
    if (!selectedStock && data?.positions && data.positions.length > 0) {
      setSelectedStock(data.positions[0]);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Positions" />
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Positions" />
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  const filteredPositions =
    data?.positions?.filter((position) => {
      if (filterType === "ALL") return true;
      return position.position_type === filterType;
    }) || [];

  const totalPositions = data?.positions?.length || 0;
  const longPositions =
    data?.positions?.filter((p) => p.position_type === "LONG").length || 0;
  const shortPositions =
    data?.positions?.filter((p) => p.position_type === "SHORT").length || 0;

  const totalValue =
    data?.positions?.reduce(
      (sum, position) => sum + position.current_price * position.quantity,
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        title="Positions"
        subtitle={`${totalPositions} positions • ${formatCurrency(totalValue)}`}
        rightElement={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        }
      />

      {/* P&L Card */}
      {data?.pnl_card && (
        <div className="px-4 pt-4">
          <PNLCard pnlData={data.pnl_card} title="Positions P&L" />
        </div>
      )}

      {/* Position Type Filter */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setFilterType("ALL")}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                filterType === "ALL"
                  ? "text-primary-600 border-primary-600 bg-primary-50"
                  : "text-gray-600 border-transparent hover:text-gray-800"
              }`}
            >
              All Positions
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                {totalPositions}
              </span>
            </button>

            <button
              onClick={() => setFilterType("LONG")}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                filterType === "LONG"
                  ? "text-success-600 border-success-600 bg-success-50"
                  : "text-gray-600 border-transparent hover:text-gray-800"
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Long
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-success-100 text-success-700">
                {longPositions}
              </span>
            </button>

            <button
              onClick={() => setFilterType("SHORT")}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                filterType === "SHORT"
                  ? "text-danger-600 border-danger-600 bg-danger-50"
                  : "text-gray-600 border-transparent hover:text-gray-800"
              }`}
            >
              <TrendingDown className="w-4 h-4 inline mr-1" />
              Short
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-danger-100 text-danger-700">
                {shortPositions}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Positions List */}
      <div className="bg-white mx-4 rounded-lg shadow-sm overflow-hidden">
        {filteredPositions.length > 0 ? (
          <>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                {filterType === "ALL"
                  ? "All Positions"
                  : `${filterType} Positions`}
                <span className="text-gray-500 ml-2">
                  ({filteredPositions.length})
                </span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Tap on any position to buy or sell
              </p>
            </div>
            {filteredPositions.map((position, index) => (
              <StockItem
                key={position.symbol}
                stock={position}
                type="position"
                onSelect={handleStockSelect}
                className={
                  index === filteredPositions.length - 1 ? "border-b-0" : ""
                }
              />
            ))}
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">📈</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterType === "ALL"
                ? "No Positions"
                : `No ${filterType} Positions`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filterType === "ALL"
                ? "Start trading to see your positions here"
                : `You don't have any ${filterType.toLowerCase()} positions`}
            </p>
            {filterType !== "ALL" && (
              <button
                onClick={() => setFilterType("ALL")}
                className="text-primary-600 text-sm hover:text-primary-700 underline"
              >
                View all positions
              </button>
            )}
          </div>
        )}
      </div>

      {/* Position Summary */}
      {data?.positions && data.positions.length > 0 && (
        <div className="px-4 mt-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Position Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Long Positions:</span>
                  <span className="font-medium text-success-600">
                    {longPositions}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Short Positions:</span>
                  <span className="font-medium text-danger-600">
                    {shortPositions}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-medium">
                    {formatCurrency(totalValue)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Day P&L:</span>
                  <span
                    className={`font-medium ${
                      (data?.pnl_card?.day_pnl || 0) >= 0
                        ? "text-success-600"
                        : "text-danger-600"
                    }`}
                  >
                    {formatCurrency(data?.pnl_card?.day_pnl || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        currentPage="positions"
        onOrderSelect={handleFABOrderSelect}
      />

      {/* Stock Action Modal */}
      {selectedStock && showActionModal && (
        <StockActionModal
          stock={selectedStock}
          onClose={handleActionModalClose}
          onActionSelect={handleActionSelect}
        />
      )}

      {/* Order Pad Modal */}
      {selectedStock && orderPadType && !showActionModal && (
        <OrderPad
          stock={selectedStock}
          type={orderPadType}
          onClose={handleOrderPadClose}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
};

export default PositionsPage;
