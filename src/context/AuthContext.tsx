import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import {
  type AuthState,
  type AuthContextType,
  type AuthAction,
  type AuthResponse,
  AuthActionType,
} from "../types/auth";
import { authApi } from "../services/api/authApi";
import { apiClient } from "../services/api/apiClient";
import { LOCAL_STORAGE_KEYS } from "../constants/endpoints";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthActionType.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AuthActionType.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        loading: false,
        error: null,
      };

    case AuthActionType.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        loading: false,
        error: action.payload.error,
      };

    case AuthActionType.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    case AuthActionType.REFRESH_SUCCESS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null,
      };

    case AuthActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case AuthActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    initializeAuth();
  }, []);

  // Connect API client with auth context for automatic logout
  useEffect(() => {
    apiClient.setAuthContext({
      logout: handleAutoLogout,
    });
  }, []);

  const initializeAuth = async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(
        LOCAL_STORAGE_KEYS.REFRESH_TOKEN
      );
      const userEmail = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_EMAIL);

      if (accessToken && refreshToken && userEmail) {
        dispatch({
          type: AuthActionType.LOGIN_SUCCESS,
          payload: {
            accessToken,
            refreshToken,
            user: { email: userEmail },
          },
        });
      } else {
        dispatch({ type: AuthActionType.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      dispatch({ type: AuthActionType.SET_LOADING, payload: false });
    }
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    const notificationEvent = new CustomEvent("showNotification", {
      detail: { message, type },
    });
    window.dispatchEvent(notificationEvent);
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    dispatch({ type: AuthActionType.LOGIN_START });

    try {
      const response = await authApi.login({ email, password });

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
        response.access_token
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
        response.refresh_token
      );
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_EMAIL, email);

      dispatch({
        type: AuthActionType.LOGIN_SUCCESS,
        payload: {
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          user: { email },
        },
      });

      showNotification("Successfully logged in!", "success");
      return response;
    } catch (error: any) {
      dispatch({
        type: AuthActionType.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    dispatch({ type: AuthActionType.LOGIN_START });

    try {
      const response = await authApi.signup({ email, password });

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
        response.access_token
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
        response.refresh_token
      );
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_EMAIL, email);

      dispatch({
        type: AuthActionType.LOGIN_SUCCESS,
        payload: {
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          user: { email },
        },
      });

      showNotification("Account created successfully!", "success");
      return response;
    } catch (error: any) {
      dispatch({
        type: AuthActionType.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      throw error;
    }
  };

  // Manual logout (user clicked logout)
  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_EMAIL);
      dispatch({ type: AuthActionType.LOGOUT });
      showNotification("You have been logged out", "info");
    }
  };

  // Automatic logout (triggered by API client on token errors)
  const handleAutoLogout = (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_EMAIL);
    dispatch({ type: AuthActionType.LOGOUT });
    // Don't show notification here - API client handles it
  };

  const refreshToken = async (): Promise<AuthResponse> => {
    try {
      const refreshTokenValue = localStorage.getItem(
        LOCAL_STORAGE_KEYS.REFRESH_TOKEN
      );
      if (!refreshTokenValue) {
        throw new Error("No refresh token available");
      }

      const response = await authApi.refreshToken({
        refresh_token: refreshTokenValue,
      });

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
        response.access_token
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
        response.refresh_token
      );

      dispatch({
        type: AuthActionType.REFRESH_SUCCESS,
        payload: {
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        },
      });

      return response;
    } catch (error: any) {
      handleAutoLogout(); // Fixed: was calling logout() before
      throw error;
    }
  };

  const clearError = (): void => {
    dispatch({ type: AuthActionType.CLEAR_ERROR });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
