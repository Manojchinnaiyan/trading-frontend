import React, { useState, useRef, useEffect } from "react";
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import type { OrderType } from "../../types/trading";

interface FloatingActionButtonProps {
  currentPage: string;
  onOrderSelect?: (type: OrderType) => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  currentPage,
  onOrderSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - 80,
    y: window.innerHeight - 150,
  });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fabRef = useRef<HTMLDivElement>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newX = Math.min(position.x, window.innerWidth - 80);
      const newY = Math.min(position.y, window.innerHeight - 150);
      setPosition({ x: newX, y: newY });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = Math.max(
      16,
      Math.min(e.clientX - dragStart.x, window.innerWidth - 80)
    );
    const newY = Math.max(
      16,
      Math.min(e.clientY - dragStart.y, window.innerHeight - 150)
    );

    setPosition({ x: newX, y: newY });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const newX = Math.max(
      16,
      Math.min(touch.clientX - dragStart.x, window.innerWidth - 80)
    );
    const newY = Math.max(
      16,
      Math.min(touch.clientY - dragStart.y, window.innerHeight - 150)
    );

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, dragStart]);

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Buy clicked");
    if (onOrderSelect) {
      onOrderSelect("BUY");
    }
    setIsExpanded(false);
  };

  const handleSellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Sell clicked");
    if (onOrderSelect) {
      onOrderSelect("SELL");
    }
    setIsExpanded(false);
  };

  const handleMainButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      ref={fabRef}
      className="fixed z-50 select-none"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      {/* Expanded Options */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
          {/* Buy Button */}
          <button
            onClick={handleBuyClick}
            className="flex items-center justify-center w-12 h-12 bg-success-500 text-white rounded-full shadow-lg hover:bg-success-600 transition-all transform hover:scale-105 active:scale-95"
            title="Buy"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* Sell Button */}
          <button
            onClick={handleSellClick}
            className="flex items-center justify-center w-12 h-12 bg-danger-500 text-white rounded-full shadow-lg hover:bg-danger-600 transition-all transform hover:scale-105 active:scale-95"
            title="Sell"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main FAB */}
      <button
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleMainButtonClick}
        className={`flex items-center justify-center w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          isDragging ? "scale-110" : ""
        }`}
        title={isExpanded ? "Close" : "Quick Actions"}
      >
        {isExpanded ? (
          <X className="w-6 h-6 transition-transform duration-200" />
        ) : (
          <Plus className="w-6 h-6 transition-transform duration-200" />
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;
