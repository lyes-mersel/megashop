import { PaginatedApiResponse, Pagination } from "@/lib/types/apiResponse.types";
import { SellFromAPI } from "@/lib/types/sell.types";

export type { PaginatedApiResponse, Pagination, SellFromAPI };

// Legacy interface for backward compatibility (can be removed later)
export interface Variant {
  color: string;
  size: string;
  quantity: number;
}

export interface Sale {
  id: number;
  productName: string;
  quantity: number;
  variants: Variant[];
  clientName: string;
  clientEmail: string;
  date: string;
  total: number;
  productImage: string;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
} 