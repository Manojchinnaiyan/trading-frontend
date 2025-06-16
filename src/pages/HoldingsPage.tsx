import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { tradingApi } from "../services/api/tradingApi";
import { useApi } from "../hooks/useApi";
import type { Holding, OrderType } from "../types/trading";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import PNLCard from "../components/trading/PNLCard";
import StockItem from "../components/trading/StockItem";
import StockActionModal from "../components/trading/StockActionModal";
import OrderPad from "../components/trading/OrderPad";
import Header from "../components/layout/Header";
import FloatingActionButton from "../components/layout/FloatingActionButton";

const HoldingsPage: React.FC = () => {
  const { data, loading, error, refetch } = useApi(tradingApi.getHoldings);
  const [selectedStock, setSelectedStock] = useState<Holding | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [orderPadType, setOrderPadType] = useState<OrderType | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleStockSelect = (stock: Holding) => {
    console.log("Stock selected:", stock);
    setSelectedStock(stock);
    setShowActionModal(true);
  };

  const handleActionSelect = (action: OrderType) => {
    setOrderPadType(action);
    setShowActionModal(false);
  };

  const handleOrderSubmit = (orderData: any) => {
    console.log("Order submitted:", orderData);
    // Here you would typically call the API to place the order
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

    // Select first stock if none selected
    if (!selectedStock && data?.holdings && data.holdings.length > 0) {
      setSelectedStock(data.holdings[0]);
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
        <Header title="Holdings" />
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Holdings" />
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  const totalHoldings = data?.holdings?.length || 0;
  const totalValue =
    data?.holdings?.reduce(
      (sum, holding) => sum + holding.current_price * holding.quantity,
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        title="Holdings"
        subtitle={`${totalHoldings} stocks • ${formatCurrency(totalValue)}`}
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
          <PNLCard pnlData={data.pnl_card} title="Portfolio Performance" />
        </div>
      )}

      {/* Holdings List */}
      <div className="bg-white mx-4 rounded-lg shadow-sm overflow-hidden">
        {data?.holdings && data.holdings.length > 0 ? (
          <>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                Your Holdings
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Tap on any stock to trade
              </p>
            </div>
            {data.holdings.map((holding, index) => (
              <StockItem
                key={holding.symbol}
                stock={holding}
                type="holding"
                onSelect={handleStockSelect}
                className={
                  index === data.holdings.length - 1 ? "border-b-0" : ""
                }
              />
            ))}
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Holdings Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start investing to see your holdings here
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        currentPage="holdings"
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

export default HoldingsPage;
