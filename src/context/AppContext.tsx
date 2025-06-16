import React, { createContext, useContext, useReducer, ReactNode } from "react";

// App State Interface
interface AppState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  notifications: Notification[];
  isOnline: boolean;
  lastRefresh: Date | null;
}

// Notification Interface
interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// App Context Type
interface AppContextType extends AppState {
  toggleTheme: () => void;
  toggleSidebar: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  setOnlineStatus: (status: boolean) => void;
  updateLastRefresh: () => void;
}

// Actions
enum AppActionType {
  TOGGLE_THEME = "TOGGLE_THEME",
  TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR",
  ADD_NOTIFICATION = "ADD_NOTIFICATION",
  MARK_NOTIFICATION_READ = "MARK_NOTIFICATION_READ",
  CLEAR_NOTIFICATIONS = "CLEAR_NOTIFICATIONS",
  SET_ONLINE_STATUS = "SET_ONLINE_STATUS",
  UPDATE_LAST_REFRESH = "UPDATE_LAST_REFRESH",
}

interface AppAction {
  type: AppActionType;
  payload?: any;
}

// Initial State
const initialState: AppState = {
  theme: (localStorage.getItem("theme") as "light" | "dark") || "light",
  sidebarOpen: false,
  notifications: [],
  isOnline: navigator.onLine,
  lastRefresh: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionType.TOGGLE_THEME:
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return { ...state, theme: newTheme };

    case AppActionType.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case AppActionType.ADD_NOTIFICATION:
      const notification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substring(2),
        timestamp: new Date(),
        read: false,
      };
      return {
        ...state,
        notifications: [notification, ...state.notifications].slice(0, 10), // Keep only last 10
      };

    case AppActionType.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((notif) =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };

    case AppActionType.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };

    case AppActionType.SET_ONLINE_STATUS:
      return { ...state, isOnline: action.payload };

    case AppActionType.UPDATE_LAST_REFRESH:
      return { ...state, lastRefresh: new Date() };

    default:
      return state;
  }
}

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Props
interface AppProviderProps {
  children: ReactNode;
}

// Provider Component
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const toggleTheme = () => {
    dispatch({ type: AppActionType.TOGGLE_THEME });
  };

  const toggleSidebar = () => {
    dispatch({ type: AppActionType.TOGGLE_SIDEBAR });
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => {
    dispatch({ type: AppActionType.ADD_NOTIFICATION, payload: notification });
  };

  const markNotificationAsRead = (id: string) => {
    dispatch({ type: AppActionType.MARK_NOTIFICATION_READ, payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: AppActionType.CLEAR_NOTIFICATIONS });
  };

  const setOnlineStatus = (status: boolean) => {
    dispatch({ type: AppActionType.SET_ONLINE_STATUS, payload: status });
  };

  const updateLastRefresh = () => {
    dispatch({ type: AppActionType.UPDATE_LAST_REFRESH });
  };

  // Listen for online/offline events
  React.useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const value: AppContextType = {
    ...state,
    toggleTheme,
    toggleSidebar,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    setOnlineStatus,
    updateLastRefresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
