export interface Holding {
  symbol: string;
  name?: string;
  quantity: number;
  average_price: number;
  current_price: number;
  pnl: number;
  pnl_percent: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  average_price: number;
  current_price: number;
  unrealized_pnl: number;
  unrealized_pnl_percent: number;
  position_type: "LONG" | "SHORT";
}

export interface Order {
  id: string;
  symbol: string;
  order_type: "BUY" | "SELL";
  quantity: number;
  price: number;
  status: "COMPLETED" | "PENDING" | "CANCELLED" | "REJECTED";
  order_time: string;
  executed_time?: string;
}

export interface PNLCard {
  total_pnl: number;
  total_pnl_percent: number;
  day_pnl: number;
  day_pnl_percent: number;
  realized_pnl: number;
  unrealized_pnl: number;
}

export interface HoldingsResponse {
  holdings: Holding[];
  pnl_card: PNLCard;
}

export interface OrderbookResponse {
  orders: Order[];
  pnl_card: PNLCard;
}

export interface PositionsResponse {
  positions: Position[];
  pnl_card: PNLCard;
}

export interface OrderRequest {
  symbol: string;
  order_type: "BUY" | "SELL";
  quantity: number;
  price: number;
  order_category: "MARKET" | "LIMIT";
}

export interface Stock {
  symbol: string;
  name?: string;
  current_price?: number;
  ltp?: number;
  quantity?: number;
  average_price?: number;
  pnl?: number;
  pnl_percent?: number;
  unrealized_pnl?: number;
  unrealized_pnl_percent?: number;
}

export type OrderType = "BUY" | "SELL";
export type OrderCategory = "MARKET" | "LIMIT";
export type OrderStatus = "COMPLETED" | "PENDING" | "CANCELLED" | "REJECTED";

export interface OrderPadData {
  symbol: string;
  quantity: number;
  price: number;
  orderType: OrderCategory;
  type: OrderType;
}
