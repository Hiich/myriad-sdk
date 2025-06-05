/**
 * Zod validation schemas for Myriad SDK
 */

import { z } from 'zod';
import { MarketStatus } from '../types/myriad';
import { MarketState, MarketAction } from '../types/polkamarket';

// Basic schemas
export const networkSchema = z.enum(['mainnet', 'testnet']);
export const addressSchema = z.string().min(1);
export const bigNumberishSchema = z.union([z.string(), z.number(), z.bigint()]);

// Myriad schemas
export const myriadConfigSchema = z.object({
  network: networkSchema
});

export const marketCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string()
});

export const marketTagSchema = z.object({
  id: z.string(),
  name: z.string()
});

export const marketOutcomeSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  imageUrl: z.string().optional()
});

export const marketVolumeSchema = z.object({
  total: z.number(),
  daily: z.number(),
  weekly: z.number()
});

export const marketLiquiditySchema = z.object({
  total: z.number()
});

export const marketSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  expiresAt: z.string(),
  resolvesAt: z.string().optional(),
  resolvedAt: z.string().optional(),
  status: z.nativeEnum(MarketStatus),
  category: marketCategorySchema.optional(),
  subcategory: marketCategorySchema.optional(),
  tags: z.array(marketTagSchema),
  outcomes: z.array(marketOutcomeSchema),
  volume: marketVolumeSchema,
  liquidity: marketLiquiditySchema,
  isResolved: z.boolean(),
  resolvedOutcomeId: z.string().optional()
});

export const paginationParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional()
});

export const marketFiltersSchema = paginationParamsSchema.extend({
  status: z.nativeEnum(MarketStatus).optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(['createdAt', 'expiresAt', 'volume', 'liquidity']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional()
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(schema: T) => z.object({
  data: z.array(schema),
  meta: z.object({
    currentPage: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    totalItems: z.number().int().nonnegative(),
    itemsPerPage: z.number().int().positive()
  })
});

export const myriadErrorSchema = z.object({
  status: z.number().int(),
  message: z.string(),
  code: z.string()
});

export const myriadResponseSchema = <T extends z.ZodTypeAny>(schema: T) => z.object({
  success: z.boolean(),
  data: schema.optional(),
  error: myriadErrorSchema.optional()
});

// Polkamarket schemas
export const polkamarketConfigSchema = z.object({
  web3Provider: z.string(),
  web3PrivateKey: z.string().optional(),
  web3EventsProvider: z.string().optional(),
  network: networkSchema.optional()
});

export const createMarketDescriptionSchema = z.object({
  value: bigNumberishSchema,
  closesAt: bigNumberishSchema,
  outcomes: bigNumberishSchema,
  token: addressSchema,
  distribution: z.array(bigNumberishSchema),
  question: z.string(),
  image: z.string(),
  arbitrator: addressSchema,
  fee: bigNumberishSchema,
  treasuryFee: bigNumberishSchema,
  treasury: addressSchema,
  realitio: addressSchema,
  realitioTimeout: bigNumberishSchema,
  manager: addressSchema
});

export const marketDataSchema = z.object({
  state: z.nativeEnum(MarketState),
  closesAt: bigNumberishSchema,
  outcomes: bigNumberishSchema,
  liquidity: bigNumberishSchema,
  fee: bigNumberishSchema,
  resolvedOutcomeId: z.number().nullable()
});

export const marketAltDataSchema = z.object({
  closesAt: bigNumberishSchema,
  questionId: z.string(),
  outcomes: bigNumberishSchema,
  token: addressSchema,
  fee: bigNumberishSchema,
  treasury: addressSchema,
  realitio: addressSchema,
  realitioTimeout: bigNumberishSchema,
  manager: addressSchema
});

export const marketOutcomeDataSchema = z.object({
  price: bigNumberishSchema,
  shares: bigNumberishSchema,
  totalShares: bigNumberishSchema
});

export const marketPricesDataSchema = z.object({
  liquidityPrice: bigNumberishSchema,
  outcomePrices: z.array(bigNumberishSchema)
});

export const marketSharesDataSchema = z.object({
  liquidityShares: bigNumberishSchema,
  outcomeShares: z.array(bigNumberishSchema)
});

export const userClaimStatusSchema = z.object({
  claimedWinnings: z.boolean(),
  claimedLiquidity: z.boolean(),
  claimedFees: z.boolean(),
  claimedVoided: z.boolean(),
  resolvedOutcomeId: bigNumberishSchema
});

export const userMarketSharesSchema = z.object({
  liquidityPoolShares: bigNumberishSchema,
  outcomeShares: z.array(bigNumberishSchema)
});

export const buyParamsSchema = z.object({
  marketId: bigNumberishSchema,
  outcomeId: bigNumberishSchema,
  minOutcomeSharesToBuy: bigNumberishSchema,
  value: bigNumberishSchema
});

export const sellParamsSchema = z.object({
  marketId: bigNumberishSchema,
  outcomeId: bigNumberishSchema,
  value: bigNumberishSchema,
  maxOutcomeSharesToSell: bigNumberishSchema
});

export const addLiquidityParamsSchema = z.object({
  marketId: bigNumberishSchema,
  value: bigNumberishSchema
});

export const removeLiquidityParamsSchema = z.object({
  marketId: bigNumberishSchema,
  shares: bigNumberishSchema
});

export const claimParamsSchema = z.object({
  marketId: bigNumberishSchema
});

export const claimVoidedParamsSchema = z.object({
  marketId: bigNumberishSchema,
  outcomeId: bigNumberishSchema
});

export const calcBuyAmountParamsSchema = z.object({
  amount: bigNumberishSchema,
  marketId: bigNumberishSchema,
  outcomeId: bigNumberishSchema
});

export const calcSellAmountParamsSchema = z.object({
  amount: bigNumberishSchema,
  marketId: bigNumberishSchema,
  outcomeId: bigNumberishSchema
});

export const transactionResponseSchema = z.object({
  hash: z.string(),
  wait: z.function().returns(z.promise(z.any()))
});

export const portfolioMarketSchema = z.object({
  marketId: z.string(),
  liquidityPoolShares: bigNumberishSchema,
  outcomeShares: z.array(bigNumberishSchema),
  claimStatus: userClaimStatusSchema
});

export const portfolioSchema = z.object({
  markets: z.array(portfolioMarketSchema)
});
