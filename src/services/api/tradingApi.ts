import { apiClient } from "./apiClient";
import type {
  HoldingsResponse,
  OrderbookResponse,
  PositionsResponse,
  OrderRequest,
} from "../../types/trading";
import { API_ENDPOINTS } from "../../constants/endpoints";

export const tradingApi = {
  async getHoldings(): Promise<HoldingsResponse> {
    try {
      const response = await apiClient.get<HoldingsResponse>(
        API_ENDPOINTS.TRADING.HOLDINGS
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch holdings");
    }
  },

  async getOrderbook(): Promise<OrderbookResponse> {
    try {
      const response = await apiClient.get<OrderbookResponse>(
        API_ENDPOINTS.TRADING.ORDERBOOK
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch orderbook");
    }
  },

  async getPositions(): Promise<PositionsResponse> {
    try {
      const response = await apiClient.get<PositionsResponse>(
        API_ENDPOINTS.TRADING.POSITIONS
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch positions");
    }
  },

  async placeOrder(orderData: OrderRequest): Promise<any> {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.TRADING.PLACE_ORDER,
        orderData
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to place order");
    }
  },
};
