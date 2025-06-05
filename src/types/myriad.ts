/**
 * Types for Myriad Markets API
 */

export type Network = "mainnet" | "testnet";

export interface MyriadConfig {
  network: Network;
}

export interface MarketCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MarketTag {
  id: string;
  name: string;
}

export interface MarketOutcome {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface MarketVolume {
  total: number;
  daily: number;
  weekly: number;
}

export interface MarketLiquidity {
  total: number;
}

export interface Market {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  resolvesAt?: string;
  resolvedAt?: string;
  status: MarketStatus;
  category?: MarketCategory;
  subcategory?: MarketCategory;
  tags: MarketTag[];
  outcomes: MarketOutcome[];
  volume: MarketVolume;
  liquidity: MarketLiquidity;
  isResolved: boolean;
  resolvedOutcomeId?: string;
}

export enum MarketStatus {
  OPEN = "open",
  CLOSED = "closed",
  RESOLVED = "resolved",
  CANCELED = "canceled",
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface MarketFilters extends PaginationParams {
  status?: MarketStatus;
  categoryId?: string;
  subcategoryId?: string;
  search?: string;
  tags?: string[];
  sortBy?: "createdAt" | "expiresAt" | "volume" | "liquidity";
  sortDirection?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface MyriadError {
  status: number;
  message: string;
  code: string;
}

export interface MyriadResponse<T> {
  success: boolean;
  data?: T;
  error?: MyriadError;
}
