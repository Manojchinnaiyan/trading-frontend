export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },

  // Trading
  TRADING: {
    HOLDINGS: "/holdings",
    ORDERBOOK: "/orderbook",
    POSITIONS: "/positions",
    PLACE_ORDER: "/orders",
  },

  // Health
  HEALTH: "/health",
} as const;

export const API_CONFIG = {
  BASE_URL: "http://localhost:8080/api/v1",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_EMAIL: "user_email",
  SELECTED_BROKER: "selected_broker",
} as const;
