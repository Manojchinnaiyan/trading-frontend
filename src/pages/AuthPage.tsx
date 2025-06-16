import React, { useState } from "react";
import type { Broker } from "../types/auth";
import BrokerSelection from "../components/auth/BrokerSelection";
import LoginForm from "../components/auth/LoginForm";

const AuthPage: React.FC = () => {
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);

  const handleBackToBrokers = () => {
    setSelectedBroker(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {selectedBroker ? (
          <LoginForm
            selectedBroker={selectedBroker}
            onBack={handleBackToBrokers}
          />
        ) : (
          <BrokerSelection onBrokerSelect={setSelectedBroker} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
