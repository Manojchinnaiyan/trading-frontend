import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthPage from "../pages/AuthPage";
import HoldingsPage from "../pages/HoldingsPage";
import OrderbookPage from "../pages/OrderbookPage";
import PositionsPage from "../pages/PositionsPage";
import BottomNavigation from "./layout/BottomNavigation";
import LoadingSpinner from "./common/LoadingSpinner";

type TabType = "holdings" | "orderbook" | "positions";

const AppRouter: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("holdings");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case "holdings":
        return <HoldingsPage />;
      case "orderbook":
        return <OrderbookPage />;
      case "positions":
        return <PositionsPage />;
      default:
        return <HoldingsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Main Content */}
      <main className="relative pb-20">{renderActivePage()}</main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default AppRouter;
