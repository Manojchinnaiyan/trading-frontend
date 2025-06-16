import { LOCAL_STORAGE_KEYS } from "../constants/endpoints";

export interface TokenPayload {
  exp: number;
  iat: number;
  user_id: number;
  email: string;
  [key: string]: any;
}

/**
 * Decode JWT token payload
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Get time until token expires (in seconds)
 */
export const getTokenTimeToExpiry = (token: string): number => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - currentTime);
};

/**
 * Check if token will expire soon (within next 5 minutes)
 */
export const isTokenExpiringSoon = (
  token: string,
  minutesThreshold: number = 5
): boolean => {
  const timeToExpiry = getTokenTimeToExpiry(token);
  return timeToExpiry > 0 && timeToExpiry < minutesThreshold * 60;
};

/**
 * Get current access token from localStorage
 */
export const getCurrentToken = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Validate current stored token
 */
export const validateStoredToken = (): {
  isValid: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
  timeToExpiry: number;
} => {
  const token = getCurrentToken();

  if (!token) {
    return {
      isValid: false,
      isExpired: true,
      isExpiringSoon: false,
      timeToExpiry: 0,
    };
  }

  const expired = isTokenExpired(token);
  const expiringSoon = !expired && isTokenExpiringSoon(token);
  const timeToExpiry = getTokenTimeToExpiry(token);

  return {
    isValid: !expired,
    isExpired: expired,
    isExpiringSoon: expiringSoon,
    timeToExpiry,
  };
};

/**
 * Clear all authentication tokens
 */
export const clearAuthTokens = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_EMAIL);
};

/**
 * Show token expiration warning notification
 */
export const showTokenExpirationWarning = (minutesLeft: number): void => {
  const message = `Your session will expire in ${minutesLeft} minute${
    minutesLeft !== 1 ? "s" : ""
  }. Please save your work.`;

  const event = new CustomEvent("showNotification", {
    detail: {
      message,
      type: "warning",
      duration: 10000, // Show for 10 seconds
    },
  });

  window.dispatchEvent(event);
};

/**
 * Setup automatic token expiration checking
 */
export const setupTokenExpirationChecker = (
  onTokenExpired: () => void,
  onTokenExpiringSoon: (minutesLeft: number) => void,
  checkInterval: number = 60000 // Check every minute
): (() => void) => {
  let warningShown = false;

  const intervalId = setInterval(() => {
    const tokenStatus = validateStoredToken();

    if (tokenStatus.isExpired) {
      clearInterval(intervalId);
      onTokenExpired();
      return;
    }

    if (tokenStatus.isExpiringSoon && !warningShown) {
      const minutesLeft = Math.ceil(tokenStatus.timeToExpiry / 60);
      onTokenExpiringSoon(minutesLeft);
      showTokenExpirationWarning(minutesLeft);
      warningShown = true;
    }

    // Reset warning flag if token is no longer expiring soon
    if (!tokenStatus.isExpiringSoon) {
      warningShown = false;
    }
  }, checkInterval);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
};
