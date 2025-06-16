import React, { useState } from "react";
import { RefreshCw, Filter } from "lucide-react";
import { tradingApi } from "../services/api/tradingApi";
import { useApi } from "../hooks/useApi";
import type { Order, OrderStatus, OrderType } from "../types/trading";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import PNLCard from "../components/trading/PNLCard";
import OrderItem from "../components/trading/OrderItem";
import StockActionModal from "../components/trading/StockActionModal";
import OrderPad from "../components/trading/OrderPad";
import Header from "../components/layout/Header";
import FloatingActionButton from "../components/layout/FloatingActionButton";

const OrderbookPage: React.FC = () => {
  const { data, loading, error, refetch } = useApi(tradingApi.getOrderbook);
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | "ALL">(
    "ALL"
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [orderPadType, setOrderPadType] = useState<OrderType | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleOrderSelect = (order: Order) => {
    console.log("Order selected:", order);
    setSelectedOrder(order);
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
    setSelectedOrder(null);
    setOrderPadType(null);
  };

  const handleOrderPadClose = () => {
    setSelectedOrder(null);
    setOrderPadType(null);
  };

  const handleActionModalClose = () => {
    setShowActionModal(false);
    setSelectedOrder(null);
  };

  const handleFABOrderSelect = (type: OrderType) => {
    console.log("FAB order type selected:", type);
    // For orderbook page, we could open a general order pad or show a stock selector
    alert(
      `${type} order selected. This would typically open a stock selector or general order pad.`
    );
  };

  const filterOptions: Array<{
    value: OrderStatus | "ALL";
    label: string;
    count?: number;
  }> = [
    { value: "ALL", label: "All Orders" },
    { value: "COMPLETED", label: "Completed" },
    { value: "PENDING", label: "Pending" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "REJECTED", label: "Rejected" },
  ];

  const filteredOrders =
    data?.orders?.filter(
      (order) => selectedFilter === "ALL" || order.status === selectedFilter
    ) || [];

  // Add counts to filter options
  const filtersWithCounts = filterOptions.map((option) => ({
    ...option,
    count:
      option.value === "ALL"
        ? data?.orders?.length || 0
        : data?.orders?.filter((order) => order.status === option.value)
            .length || 0,
  }));

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
        <Header title="Order Book" />
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Order Book" />
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  const totalOrders = data?.orders?.length || 0;
  const totalValue =
    data?.orders?.reduce(
      (sum, order) => sum + order.quantity * order.price,
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        title="Order Book"
        subtitle={`${totalOrders} orders • ${formatCurrency(totalValue)}`}
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
          <PNLCard pnlData={data.pnl_card} title="Realized/Unrealized P&L" />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="flex items-center p-3 border-b border-gray-200">
            <Filter className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Filter Orders
            </span>
          </div>
          <div className="flex overflow-x-auto scrollbar-hide">
            {filtersWithCounts.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedFilter === filter.value
                    ? "text-primary-600 border-primary-600 bg-primary-50"
                    : "text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                <span>{filter.label}</span>
                {filter.count !== undefined && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      selectedFilter === filter.value
                        ? "bg-primary-100 text-primary-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white mx-4 rounded-lg shadow-sm overflow-hidden">
        {filteredOrders.length > 0 ? (
          <>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                {selectedFilter === "ALL"
                  ? "All Orders"
                  : `${selectedFilter} Orders`}
                <span className="text-gray-500 ml-2">
                  ({filteredOrders.length})
                </span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Tap on any order to modify or place similar order
              </p>
            </div>
            {filteredOrders.map((order, index) => (
              <OrderItem
                key={order.id}
                order={order}
                onOrderSelect={handleOrderSelect}
                className={
                  index === filteredOrders.length - 1 ? "border-b-0" : ""
                }
              />
            ))}
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedFilter === "ALL"
                ? "No Orders Yet"
                : `No ${selectedFilter} Orders`}
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedFilter === "ALL"
                ? "Start trading to see your orders here"
                : `You don't have any ${selectedFilter.toLowerCase()} orders`}
            </p>
            {selectedFilter !== "ALL" && (
              <button
                onClick={() => setSelectedFilter("ALL")}
                className="text-primary-600 text-sm hover:text-primary-700 underline"
              >
                View all orders
              </button>
            )}
          </div>
        )}
      </div>

      {/* Order Statistics */}
      {data?.orders && data.orders.length > 0 && (
        <div className="px-4 mt-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Order Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Orders:</span>
                <span className="ml-2 font-medium">{data.orders.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Completed:</span>
                <span className="ml-2 font-medium text-success-600">
                  {data.orders.filter((o) => o.status === "COMPLETED").length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Pending:</span>
                <span className="ml-2 font-medium text-warning-600">
                  {data.orders.filter((o) => o.status === "PENDING").length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Cancelled:</span>
                <span className="ml-2 font-medium text-gray-600">
                  {data.orders.filter((o) => o.status === "CANCELLED").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        currentPage="orderbook"
        onOrderSelect={handleFABOrderSelect}
      />

      {/* Stock Action Modal */}
      {selectedOrder && showActionModal && (
        <StockActionModal
          stock={selectedOrder}
          onClose={handleActionModalClose}
          onActionSelect={handleActionSelect}
        />
      )}

      {/* Order Pad Modal */}
      {selectedOrder && orderPadType && !showActionModal && (
        <OrderPad
          stock={selectedOrder}
          type={orderPadType}
          onClose={handleOrderPadClose}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
};

export default OrderbookPage;
