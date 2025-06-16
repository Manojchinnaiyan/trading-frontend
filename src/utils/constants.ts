// App Configuration
export const APP_CONFIG = {
  NAME: "Broker Platform",
  VERSION: "1.0.0",
  DESCRIPTION: "Multi-broker trading platform",
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
} as const;

// Trading Constants
export const TRADING_CONSTANTS = {
  MIN_ORDER_QUANTITY: 1,
  MAX_ORDER_QUANTITY: 10000,
  MIN_ORDER_PRICE: 0.01,
  MAX_ORDER_PRICE: 1000000,
  PRICE_PRECISION: 2,
  QUANTITY_PRECISION: 0,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  DISPLAY_WITH_TIME: "MMM dd, yyyy HH:mm",
  API: "yyyy-MM-dd",
  TIMESTAMP: "yyyy-MM-dd HH:mm:ss",
} as const;

// Currency
export const CURRENCY = {
  CODE: "INR",
  SYMBOL: "₹",
  LOCALE: "en-IN",
} as const;

// Status Colors
export const STATUS_COLORS = {
  SUCCESS: {
    bg: "bg-success-50",
    text: "text-success-700",
    border: "border-success-200",
  },
  DANGER: {
    bg: "bg-danger-50",
    text: "text-danger-700",
    border: "border-danger-200",
  },
  WARNING: {
    bg: "bg-warning-50",
    text: "text-warning-700",
    border: "border-warning-200",
  },
  INFO: {
    bg: "bg-primary-50",
    text: "text-primary-700",
    border: "border-primary-200",
  },
  NEUTRAL: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: "Network error. Please check your connection.",
  TIMEOUT: "Request timeout. Please try again.",
  UNAUTHORIZED: "Session expired. Please login again.",
  FORBIDDEN: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION: "Please check your input and try again.",
  UNKNOWN: "An unexpected error occurred.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Successfully logged in!",
  LOGOUT: "Successfully logged out!",
  ORDER_PLACED: "Order placed successfully!",
  ORDER_CANCELLED: "Order cancelled successfully!",
  DATA_REFRESHED: "Data refreshed successfully!",
} as const;

// Routes (if using React Router in future)
export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  HOLDINGS: "/holdings",
  ORDERBOOK: "/orderbook",
  POSITIONS: "/positions",
  PROFILE: "/profile",
} as const;
