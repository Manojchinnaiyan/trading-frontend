import { CURRENCY } from "./constants";

/**
 * Comprehensive formatting utilities for the trading platform
 */

// Currency Formatters
export const formatCurrency = (
  amount: number,
  options?: Partial<Intl.NumberFormatOptions>
): string => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: "currency",
    currency: CURRENCY.CODE,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
};

export const formatCurrencyCompact = (amount: number): string => {
  if (Math.abs(amount) >= 10000000) {
    // 1 Crore
    return formatCurrency(amount / 10000000) + " Cr";
  } else if (Math.abs(amount) >= 100000) {
    // 1 Lakh
    return formatCurrency(amount / 100000) + " L";
  } else if (Math.abs(amount) >= 1000) {
    // 1 Thousand
    return formatCurrency(amount / 1000) + " K";
  }
  return formatCurrency(amount);
};

// Percentage Formatters
export const formatPercentage = (
  value: number,
  decimals: number = 2,
  showSign: boolean = true
): string => {
  const formatted = value.toFixed(decimals);
  return showSign && value >= 0 ? `+${formatted}%` : `${formatted}%`;
};

export const formatPercentageWithColor = (
  value: number
): {
  formatted: string;
  colorClass: string;
} => {
  return {
    formatted: formatPercentage(value),
    colorClass: value >= 0 ? "text-success-600" : "text-danger-600",
  };
};

// Number Formatters
export const formatNumber = (
  value: number,
  options?: Partial<Intl.NumberFormatOptions>
): string => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
};

export const formatInteger = (value: number): string => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatQuantity = (quantity: number): string => {
  return formatInteger(quantity);
};

// Date and Time Formatters
export const formatDate = (
  date: string | Date,
  options?: Partial<Intl.DateTimeFormatOptions>
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(CURRENCY.LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(dateObj);
};

export const formatDateTime = (
  date: string | Date,
  options?: Partial<Intl.DateTimeFormatOptions>
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(CURRENCY.LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(dateObj);
};

export const formatTime = (
  date: string | Date,
  options?: Partial<Intl.DateTimeFormatOptions>
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(CURRENCY.LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(dateObj);
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return formatDate(dateObj);
  }
};

// P&L Formatters
export const formatPNL = (
  pnl: number
): {
  amount: string;
  percentage?: string;
  colorClass: string;
  bgColorClass: string;
  icon: string;
} => {
  const isPositive = pnl >= 0;
  return {
    amount: formatCurrency(Math.abs(pnl)),
    colorClass: isPositive ? "text-success-600" : "text-danger-600",
    bgColorClass: isPositive ? "bg-success-50" : "bg-danger-50",
    icon: isPositive ? "↗" : "↘",
  };
};

export const formatPNLWithPercentage = (
  pnl: number,
  percentage: number
): {
  amount: string;
  percentage: string;
  colorClass: string;
  bgColorClass: string;
  icon: string;
} => {
  const isPositive = pnl >= 0;
  return {
    amount: formatCurrency(Math.abs(pnl)),
    percentage: formatPercentage(Math.abs(percentage), 2, false),
    colorClass: isPositive ? "text-success-600" : "text-danger-600",
    bgColorClass: isPositive ? "bg-success-50" : "bg-danger-50",
    icon: isPositive ? "↗" : "↘",
  };
};

// Stock Symbol Formatters
export const formatSymbol = (symbol: string): string => {
  return symbol.toUpperCase();
};

export const formatStockName = (
  name: string,
  maxLength: number = 20
): string => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + "...";
};

// Order Formatters
export const formatOrderType = (type: string): string => {
  return type.toUpperCase();
};

export const formatOrderStatus = (
  status: string
): {
  text: string;
  colorClass: string;
  bgColorClass: string;
} => {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return {
        text: "Completed",
        colorClass: "text-success-700",
        bgColorClass: "bg-success-50 border-success-200",
      };
    case "PENDING":
      return {
        text: "Pending",
        colorClass: "text-warning-700",
        bgColorClass: "bg-warning-50 border-warning-200",
      };
    case "CANCELLED":
      return {
        text: "Cancelled",
        colorClass: "text-gray-700",
        bgColorClass: "bg-gray-50 border-gray-200",
      };
    case "REJECTED":
      return {
        text: "Rejected",
        colorClass: "text-danger-700",
        bgColorClass: "bg-danger-50 border-danger-200",
      };
    default:
      return {
        text: status,
        colorClass: "text-gray-700",
        bgColorClass: "bg-gray-50 border-gray-200",
      };
  }
};

// Market Value Formatters
export const formatMarketValue = (price: number, quantity: number): string => {
  return formatCurrency(price * quantity);
};

export const formatAveragePrice = (
  totalCost: number,
  quantity: number
): string => {
  if (quantity === 0) return formatCurrency(0);
  return formatCurrency(totalCost / quantity);
};

// Portfolio Formatters
export const formatPortfolioSummary = (
  totalValue: number,
  totalInvested: number
): {
  value: string;
  invested: string;
  pnl: string;
  pnlPercentage: string;
  colorClass: string;
} => {
  const pnl = totalValue - totalInvested;
  const pnlPercentage = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;
  const isPositive = pnl >= 0;

  return {
    value: formatCurrency(totalValue),
    invested: formatCurrency(totalInvested),
    pnl: formatCurrency(Math.abs(pnl)),
    pnlPercentage: formatPercentage(Math.abs(pnlPercentage), 2, false),
    colorClass: isPositive ? "text-success-600" : "text-danger-600",
  };
};

// Validation Formatters
export const sanitizeNumberInput = (value: string): string => {
  // Remove any non-numeric characters except decimal point
  return value.replace(/[^0-9.]/g, "");
};

export const formatNumberInput = (
  value: string,
  decimals: number = 2
): string => {
  const sanitized = sanitizeNumberInput(value);
  const parts = sanitized.split(".");

  if (parts.length > 2) {
    // If multiple decimal points, keep only the first one
    return parts[0] + "." + parts.slice(1).join("");
  }

  if (parts.length === 2 && parts[1].length > decimals) {
    // Limit decimal places
    return parts[0] + "." + parts[1].substring(0, decimals);
  }

  return sanitized;
};
