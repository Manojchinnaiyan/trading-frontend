import { CURRENCY, UI_CONSTANTS } from "./constants";

// Currency Formatting
export const formatCurrency = (
  amount: number,
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: "currency",
    currency: CURRENCY.CODE,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
};

// Percentage Formatting
export const formatPercentage = (
  value: number,
  decimals: number = 2,
  showSign: boolean = true
): string => {
  const formatted = value.toFixed(decimals);
  return showSign && value >= 0 ? `+${formatted}%` : `${formatted}%`;
};

// Number Formatting
export const formatNumber = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, options).format(value);
};

// Date Formatting
export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
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
  options?: Intl.DateTimeFormatOptions
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
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(CURRENCY.LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(dateObj);
};

// String Utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Validation Utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isValidNumber = (value: any): boolean => {
  return !isNaN(value) && isFinite(value);
};

// Array Utilities
export const groupBy = <T>(
  array: T[],
  keyGetter: (item: T) => string | number
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const key = keyGetter(item).toString();
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(
  array: T[],
  keyGetter: (item: T) => any,
  direction: "asc" | "desc" = "asc"
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = keyGetter(a);
    const bVal = keyGetter(b);

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

export const uniqueBy = <T>(array: T[], keyGetter: (item: T) => any): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const key = keyGetter(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Debounce Function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = UI_CONSTANTS.DEBOUNCE_DELAY
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Throttle Function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(null, args);
    }
  };
};

// Local Storage Utilities
export const setLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting localStorage:", error);
  }
};

export const getLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error("Error getting localStorage:", error);
    return defaultValue || null;
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing localStorage:", error);
  }
};

// Color Utilities
export const getPNLColor = (value: number): string => {
  return value >= 0 ? "text-success-600" : "text-danger-600";
};

export const getPNLBackgroundColor = (value: number): string => {
  return value >= 0 ? "bg-success-50" : "bg-danger-50";
};

// Device Detection
export const isMobile = (): boolean => {
  return window.innerWidth < UI_CONSTANTS.MOBILE_BREAKPOINT;
};

export const isTablet = (): boolean => {
  return (
    window.innerWidth >= UI_CONSTANTS.MOBILE_BREAKPOINT &&
    window.innerWidth < UI_CONSTANTS.TABLET_BREAKPOINT
  );
};

export const isDesktop = (): boolean => {
  return window.innerWidth >= UI_CONSTANTS.TABLET_BREAKPOINT;
};

// Sleep/Delay Utility
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Copy to Clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

// URL Utilities
export const getQueryParams = (): URLSearchParams => {
  return new URLSearchParams(window.location.search);
};

export const setQueryParams = (params: Record<string, string>): void => {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  window.history.replaceState({}, "", url.toString());
};
