export interface User {
  id?: number;
  email: string;
  name?: string;
}

export interface Broker {
  id: number;
  name: string;
  logo: string;
  color: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user?: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  refreshToken: () => Promise<AuthResponse>;
  clearError: () => void;
}

export enum AuthActionType {
  LOGIN_START = "LOGIN_START",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  LOGOUT = "LOGOUT",
  REFRESH_SUCCESS = "REFRESH_SUCCESS",
  SET_LOADING = "SET_LOADING",
  CLEAR_ERROR = "CLEAR_ERROR",
}

export interface AuthAction {
  type: AuthActionType;
  payload?: any;
}
