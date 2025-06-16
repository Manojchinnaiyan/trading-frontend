import React, { useState, useEffect } from "react";
import type { Broker } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import BrokerSelection from "../components/auth/BrokerSelection";
import LoginForm from "../components/auth/LoginForm";

const AuthPage: React.FC = () => {
  // Initialize from sessionStorage to survive re-mounts
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(() => {
    try {
      const saved = sessionStorage.getItem("selectedBroker");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { isAuthenticated, loading, error } = useAuth();

  console.log("AuthPage render:", {
    selectedBroker: selectedBroker?.name,
    isAuthenticated,
    loading,
    error,
  });

  // Clear stored broker on successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.removeItem("selectedBroker");
    }
  }, [isAuthenticated]);

  const handleBackToBrokers = () => {
    console.log("Going back to brokers");
    setSelectedBroker(null);
    sessionStorage.removeItem("selectedBroker");
  };

  const handleBrokerSelect = (broker: Broker) => {
    console.log("Broker selected:", broker.name);
    setSelectedBroker(broker);
    sessionStorage.setItem("selectedBroker", JSON.stringify(broker));
  };

  // If user is authenticated, this component shouldn't render at all
  // This should be handled by your router/app component
  if (isAuthenticated) {
    console.log("User is authenticated, AuthPage should not be visible");
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {selectedBroker ? (
          <LoginForm
            selectedBroker={selectedBroker}
            onBack={handleBackToBrokers}
          />
        ) : (
          <BrokerSelection onBrokerSelect={handleBrokerSelect} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
