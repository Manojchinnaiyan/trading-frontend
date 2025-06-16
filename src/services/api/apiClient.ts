import type { ApiError, RequestConfig } from "../../types/api";
import { API_CONFIG, LOCAL_STORAGE_KEYS } from "../../constants/endpoints";

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private authContext: any = null;

  constructor(
    baseURL: string = API_CONFIG.BASE_URL,
    timeout: number = API_CONFIG.TIMEOUT
  ) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // Method to set auth context for logout functionality
  setAuthContext(authContext: any) {
    console.log("Setting auth context:", authContext);
    this.authContext = authContext;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    let data: any;

    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      const error: ApiError = {
        message: data?.message || data?.error || `HTTP ${response.status}`,
        status: response.status,
        data,
      };

      console.log("API Error:", {
        status: response.status,
        message: error.message,
        url: response.url,
        data: data,
      });

      // Handle token expiration/invalid token
      if (response.status === 401) {
        this.handleUnauthorized(error.message);
      }

      throw error;
    }

    return data;
  }

  private handleUnauthorized(errorMessage: string) {
    console.log("Handling unauthorized error:", errorMessage);
    console.log("Auth context available:", !!this.authContext);
    console.log("Logout function available:", !!this.authContext?.logout);

    // Check if the error is about invalid/expired token
    const tokenErrorKeywords = [
      "token is expired",
      "invalid token",
      "invalid claims",
      "expired",
      "unauthorized",
      "token expired",
      "session expired",
      "authentication",
      "jwt",
    ];

    const isTokenError = tokenErrorKeywords.some((keyword) =>
      errorMessage.toLowerCase().includes(keyword.toLowerCase())
    );

    console.log(
      "Is token error:",
      isTokenError,
      "Error message:",
      errorMessage
    );

    // Always try to logout on 401, regardless of error message
    if (this.authContext?.logout) {
      console.log("Calling logout function...");

      try {
        // Clear tokens immediately
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_EMAIL);
        console.log("Tokens cleared from localStorage");

        // Call logout function
        this.authContext.logout();
        console.log("Logout function called successfully");

        // Show notification
        this.showLoginRequiredNotification();
      } catch (logoutError) {
        console.error("Error during logout:", logoutError);

        // Force redirect to login as fallback
        this.forceRedirectToLogin();
      }
    } else {
      console.warn(
        "Auth context or logout function not available, forcing redirect"
      );

      // Clear tokens even if logout function is not available
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_EMAIL);

      // Force redirect as fallback
      this.forceRedirectToLogin();
    }
  }

  private showLoginRequiredNotification() {
    try {
      // Show notification
      const event = new CustomEvent("showNotification", {
        detail: {
          message: "Session expired. Please sign in again.",
          type: "warning",
        },
      });
      window.dispatchEvent(event);
      console.log("Login required notification dispatched");
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  }

  private forceRedirectToLogin() {
    console.log("Force redirecting to login...");

    try {
      // Try to use router if available
      if (window.location.pathname !== "/auth") {
        window.location.href = "/auth";
      }
    } catch (error) {
      console.error("Error during force redirect:", error);
      // Last resort - reload the page
      window.location.reload();
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const {
      method = "GET",
      headers = {},
      body,
      timeout = this.timeout,
    } = config;

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.getAuthHeaders(),
      ...headers,
    };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      ...(body && {
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Request timeout");
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection.");
      }

      throw error;
    }
  }

  async get<T>(
    endpoint: string,
    config?: Omit<RequestConfig, "method" | "body">
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method">
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: "POST", body });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method">
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: "PUT", body });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method">
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: "PATCH", body });
  }

  async delete<T>(
    endpoint: string,
    config?: Omit<RequestConfig, "method" | "body">
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...config, method: "DELETE" });
  }

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }

  // Debug method to check auth context
  debugAuthContext() {
    console.log("Auth context debug:", {
      hasContext: !!this.authContext,
      hasLogout: !!this.authContext?.logout,
      context: this.authContext,
    });
  }
}

export const apiClient = new ApiClient();
