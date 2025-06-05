import axios, { AxiosInstance } from "axios";
import { config } from "../../config";
import {
  Market,
  MarketFilters,
  MyriadConfig,
  MyriadResponse,
  Network,
  PaginatedResponse,
} from "../../types/myriad";
import { z } from 'zod';
import {
  marketSchema,
  marketFiltersSchema,
  myriadConfigSchema,
  myriadResponseSchema,
  paginatedResponseSchema
} from "../../validation/schemas";
import { validate } from "../../validation/utils";
import { withValidation } from "../../validation/middleware";

/**
 * Myriad Markets API Client
 *
 * Provides methods to interact with the Myriad Markets API
 */
export class Myriad {
  private readonly client: AxiosInstance;
  private readonly network: Network;

  /**
   * Create a new Myriad client instance
   *
   * @param options Configuration options for the client
   */
  constructor(options: MyriadConfig) {
    // Validate config
    const validatedOptions = validate(myriadConfigSchema, options, 'Myriad constructor');
    
    this.network = validatedOptions.network || "mainnet";

    const baseURL = config.myriad.baseUrls[this.network];

    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Fetch markets with optional filters
   *
   * @param filters Optional filters to apply to the markets query
   * @returns Paginated list of markets
   */
  fetchMarkets = withValidation<MarketFilters | undefined, PaginatedResponse<Market>>(
    marketFiltersSchema.optional(),
    paginatedResponseSchema(marketSchema),
    'fetchMarkets'
  )(async (filters?: MarketFilters): Promise<PaginatedResponse<Market>> => {
    try {
      const params = filters ? { ...filters } : {};
      const response = await this.client.get<
        MyriadResponse<PaginatedResponse<Market>>
      >("/markets", { params });

      // Validate the response structure
      const validatedResponse = validate(
        myriadResponseSchema(paginatedResponseSchema(marketSchema)),
        response.data,
        'fetchMarkets response'
      );

      if (!validatedResponse.success || !validatedResponse.data) {
        throw new Error(
          validatedResponse.error?.message || "Failed to fetch markets"
        );
      }

      return validatedResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch markets: ${error.response?.data?.message || error.message}`
        );
      }
      throw error;
    }
  });

  /**
   * Fetch a market by its ID
   *
   * @param id The market ID
   * @returns Market details
   */
  fetchMarketById = withValidation<string, Market>(
    z.string().min(1),
    marketSchema,
    'fetchMarketById'
  )(async (id: string): Promise<Market> => {
    try {
      const response = await this.client.get<MyriadResponse<Market>>(
        `/markets/${id}`
      );

      // Validate the response structure
      const validatedResponse = validate(
        myriadResponseSchema(marketSchema),
        response.data,
        'fetchMarketById response'
      );

      if (!validatedResponse.success || !validatedResponse.data) {
        throw new Error(
          validatedResponse.error?.message || `Market with ID ${id} not found`
        );
      }

      return validatedResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch market by ID: ${error.response?.data?.message || error.message}`
        );
      }
      throw error;
    }
  });

  /**
   * Fetch a market by its slug
   *
   * @param slug The market slug
   * @returns Market details
   */
  fetchMarketBySlug = withValidation<string, Market>(
    z.string().min(1),
    marketSchema,
    'fetchMarketBySlug'
  )(async (slug: string): Promise<Market> => {
    try {
      const response = await this.client.get<MyriadResponse<Market>>(
        `/markets/slug/${slug}`
      );

      // Validate the response structure
      const validatedResponse = validate(
        myriadResponseSchema(marketSchema),
        response.data,
        'fetchMarketBySlug response'
      );

      if (!validatedResponse.success || !validatedResponse.data) {
        throw new Error(
          validatedResponse.error?.message || `Market with slug ${slug} not found`
        );
      }

      return validatedResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch market by slug: ${error.response?.data?.message || error.message}`
        );
      }
      throw error;
    }
  });
}
