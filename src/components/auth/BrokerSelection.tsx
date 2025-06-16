import React from "react";
import { ChevronRight } from "lucide-react";
import type { Broker } from "../../types/auth";
import { BROKERS } from "../../constants/brokers";

interface BrokerSelectionProps {
  onBrokerSelect: (broker: Broker) => void;
}

const BrokerSelection: React.FC<BrokerSelectionProps> = ({
  onBrokerSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Trading Platform
        </h1>
        <p className="text-gray-600">Select your broker to get started</p>
      </div>

      <div className="space-y-3">
        {BROKERS.map((broker) => (
          <button
            key={broker.id}
            onClick={() => onBrokerSelect(broker)}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 ${broker.color} rounded-lg flex items-center justify-center text-white text-xl shadow-md`}
              >
                {broker.logo}
              </div>
              <div className="text-left">
                <span className="font-medium text-gray-900 text-lg">
                  {broker.name}
                </span>
                <p className="text-sm text-gray-500">Tap to login</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrokerSelection;
