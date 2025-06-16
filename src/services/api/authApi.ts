import { apiClient } from "./apiClient";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  RefreshTokenRequest,
} from "../../types/auth";
import { HttpStatus } from "../../types/api";
import { API_ENDPOINTS } from "../../constants/endpoints";

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return response;
    } catch (error: any) {
      // Handle specific error status codes as per requirements
      if (error.status === HttpStatus.BAD_REQUEST) {
        throw new Error("Invalid email or password");
      } else if (error.status === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new Error("Server error. Please try again later.");
      }
      throw new Error(error.message || "Login failed");
    }
  },

  async signup(credentials: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.SIGNUP,
        credentials
      );
      return response;
    } catch (error: any) {
      if (error.status === HttpStatus.BAD_REQUEST) {
        throw new Error("User already exists or invalid data");
      } else if (error.status === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new Error("Server error. Please try again later.");
      }
      throw new Error(error.message || "Signup failed");
    }
  },

  async refreshToken(
    refreshTokenData: RefreshTokenRequest
  ): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        refreshTokenData
      );
      return response;
    } catch (error: any) {
      throw new Error("Session expired. Please login again.");
    }
  },

  async logout(): Promise<void> {
    try {
      // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      console.log("Logout request");
    } catch (error) {
      // Even if logout fails on server, we should clear local storage
      console.warn("Logout request failed, but continuing with local cleanup");
    }
  },
};
