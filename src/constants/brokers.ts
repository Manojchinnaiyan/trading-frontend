import type { Broker } from "../types/auth";

export const BROKERS: Broker[] = [
  {
    id: 1,
    name: "Zerodha",
    logo: "🟢",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Upstox",
    logo: "📈",
    color: "bg-orange-500",
  },
  {
    id: 3,
    name: "Angel One",
    logo: "👼",
    color: "bg-red-500",
  },
  {
    id: 4,
    name: "Groww",
    logo: "🌱",
    color: "bg-green-500",
  },
  {
    id: 5,
    name: "HDFC Securities",
    logo: "🏦",
    color: "bg-purple-500",
  },
  {
    id: 6,
    name: "ICICI Direct",
    logo: "🏢",
    color: "bg-indigo-500",
  },
];

export const DEFAULT_BROKER = BROKERS[0];
