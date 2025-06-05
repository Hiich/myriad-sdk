/**
 * Types for Polkamarket SDK
 *
 * Includes interfaces for the Polkamarkets JS SDK
 */

// Polkamarkets SDK specific interfaces
export interface PolkamarketsApplication {
  start: () => void;
  login: () => Promise<void>;
  getUserAddress: () => Promise<string>;
  getPredictionMarketV3Contract: (options: {
    contractAddress: string;
    querierContractAddress?: string;
  }) => PolkamarketsPredictionMarketContract;
}

export interface PolkamarketsPredictionMarketContract {
  getMarkets: () => Promise<BigNumberish[]>;
  getMarketData: (params: { marketId: BigNumberish }) => Promise<MarketData>;
  getMarketAltData: (params: { marketId: BigNumberish }) => Promise<MarketAltData>;
  getOutcomeData: (params: { marketId: BigNumberish; outcomeId: BigNumberish }) => Promise<MarketOutcomeData>;
  getMarketPrices: (params: { marketId: BigNumberish }) => Promise<MarketPricesData>;
  getMarketShares: (params: { marketId: BigNumberish }) => Promise<MarketSharesData>;
  getUserClaimStatus: (params: { marketId: BigNumberish; userAddress: string }) => Promise<UserClaimStatus>;
  getUserMarketShares: (params: { marketId: BigNumberish; userAddress: string }) => Promise<UserMarketShares>;
  createMarket: (description: CreateMarketDescription) => Promise<TransactionResponse>;
  buy: (params: BuyParams) => Promise<TransactionResponse>;
  sell: (params: SellParams) => Promise<TransactionResponse>;
  addLiquidity: (params: AddLiquidityParams) => Promise<TransactionResponse>;
  removeLiquidity: (params: RemoveLiquidityParams) => Promise<TransactionResponse>;
  claimWinnings: (params: ClaimParams) => Promise<TransactionResponse>;
  claimLiquidity: (params: ClaimParams) => Promise<TransactionResponse>;
  claimFees: (params: ClaimParams) => Promise<TransactionResponse>;
  claimVoided: (params: ClaimVoidedParams) => Promise<TransactionResponse>;
  calcBuyAmount: (params: CalcBuyAmountParams) => Promise<BigNumberish>;
  calcSellAmount: (params: CalcSellAmountParams) => Promise<BigNumberish>;
  getMyPortfolio: () => Promise<Portfolio>;
}

// Basic types
export type Address = string;
export type BigNumberish = string | number | bigint;
export type Network = 'mainnet' | 'testnet';

// Enum for market state
export enum MarketState {
  OPEN = 0,
  CLOSED = 1,
  RESOLVED = 2,
  VOIDED = 3
}

// Enum for market actions
export enum MarketAction {
  BUY = 0,
  SELL = 1,
  ADD_LIQUIDITY = 2,
  REMOVE_LIQUIDITY = 3,
  CLAIM_WINNINGS = 4,
  CLAIM_LIQUIDITY = 5,
  CLAIM_FEES = 6,
  CLAIM_VOIDED = 7
}

// Configuration interface
export interface PolkamarketConfig {
  web3Provider: string;
  web3PrivateKey?: string;
  web3EventsProvider?: string;
  network?: Network;
}

// Market description for creating markets
export interface CreateMarketDescription {
  value: BigNumberish;
  closesAt: BigNumberish;
  outcomes: BigNumberish;
  token: Address;
  distribution: BigNumberish[];
  question: string;
  image: string;
  arbitrator: Address;
  fee: BigNumberish;
  treasuryFee: BigNumberish;
  treasury: Address;
  realitio: Address;
  realitioTimeout: BigNumberish;
  manager: Address;
}

// Market data returned from getMarketData
export interface MarketData {
  state: MarketState;
  closesAt: BigNumberish;
  outcomes: BigNumberish;
  liquidity: BigNumberish;
  fee: BigNumberish;
  resolvedOutcomeId: number | null; // int256 that can be -1
}

// Market alternative data returned from getMarketAltData
export interface MarketAltData {
  closesAt: BigNumberish;
  questionId: string; // bytes32
  outcomes: BigNumberish;
  token: Address;
  fee: BigNumberish;
  treasury: Address;
  realitio: Address;
  realitioTimeout: BigNumberish;
  manager: Address;
}

// Market outcome data
export interface MarketOutcomeData {
  price: BigNumberish;
  shares: BigNumberish;
  totalShares: BigNumberish;
}

// Market prices data
export interface MarketPricesData {
  liquidityPrice: BigNumberish;
  outcomePrices: BigNumberish[];
}

// Market shares data
export interface MarketSharesData {
  liquidityShares: BigNumberish;
  outcomeShares: BigNumberish[];
}

// User claim status
export interface UserClaimStatus {
  claimedWinnings: boolean;
  claimedLiquidity: boolean;
  claimedFees: boolean;
  claimedVoided: boolean;
  resolvedOutcomeId: BigNumberish;
}

// User market shares
export interface UserMarketShares {
  liquidityPoolShares: BigNumberish;
  outcomeShares: BigNumberish[];
}

// Buy parameters
export interface BuyParams {
  marketId: BigNumberish;
  outcomeId: BigNumberish;
  minOutcomeSharesToBuy: BigNumberish;
  value: BigNumberish;
}

// Buy with ETH parameters
export interface BuyWithETHParams {
  marketId: BigNumberish;
  outcomeId: BigNumberish;
  minOutcomeSharesToBuy: BigNumberish;
  value: BigNumberish; // ETH amount to send
}

// Sell parameters
export interface SellParams {
  marketId: BigNumberish;
  outcomeId: BigNumberish;
  value: BigNumberish;
  maxOutcomeSharesToSell: BigNumberish;
}

// Sell to ETH parameters
export interface SellToETHParams {
  marketId: BigNumberish;
  outcomeId: BigNumberish;
  value: BigNumberish;
  maxOutcomeSharesToSell: BigNumberish;
}

// Add liquidity parameters
export interface AddLiquidityParams {
  marketId: BigNumberish;
  value: BigNumberish;
}

// Add liquidity with ETH parameters
export interface AddLiquidityWithETHParams {
  marketId: BigNumberish;
  value: BigNumberish; // ETH amount to send
}

// Remove liquidity parameters
export interface RemoveLiquidityParams {
  marketId: BigNumberish;
  shares: BigNumberish;
}

// Claim parameters
export interface ClaimParams {
  marketId: BigNumberish;
}

// Claim voided outcome shares parameters
export interface ClaimVoidedParams {
  marketId: BigNumberish;
  outcomeId: BigNumberish;
}

// Calc buy amount parameters
export interface CalcBuyAmountParams {
  amount: BigNumberish;
  marketId: BigNumberish;
  outcomeId: BigNumberish;
}

// Calc sell amount parameters
export interface CalcSellAmountParams {
  amount: BigNumberish;
  marketId: BigNumberish;
  outcomeId: BigNumberish;
}

// Transaction response interface
export interface TransactionResponse {
  hash: string;
  wait: () => Promise<TransactionReceipt>;
}

// Transaction receipt interface
export interface TransactionReceipt {
  blockHash: string;
  blockNumber: number;
  contractAddress: string | null;
  from: string;
  status?: number;
  to: string;
  transactionHash: string;
  transactionIndex: number;
}

// Portfolio market interface
export interface PortfolioMarket {
  marketId: string;
  liquidityPoolShares: BigNumberish;
  outcomeShares: BigNumberish[];
  claimStatus: UserClaimStatus;
}

// Portfolio interface
export interface Portfolio {
  markets: PortfolioMarket[];
}

/**
 * Prediction Market Contract interface
 * 
 * Defines the methods available on the Polkamarkets prediction market contract
 */
export interface PredictionMarketContract {
  getMarkets(): Promise<BigNumberish[]>;
  getMarketData(marketId: BigNumberish): Promise<MarketData>;
  getMarketAltData(marketId: BigNumberish): Promise<MarketAltData>;
  getOutcomeData(marketId: BigNumberish, outcomeId: BigNumberish): Promise<MarketOutcomeData>;
  getMarketPrices(marketId: BigNumberish): Promise<MarketPricesData>;
  getMarketShares(marketId: BigNumberish): Promise<MarketSharesData>;
  getUserClaimStatus(marketId: BigNumberish, userAddress: string): Promise<UserClaimStatus>;
  getUserMarketShares(marketId: BigNumberish, userAddress: string): Promise<UserMarketShares>;
  createMarket(description: CreateMarketDescription): Promise<TransactionResponse>;
  buy(params: BuyParams): Promise<TransactionResponse>;
  sell(params: SellParams): Promise<TransactionResponse>;
  addLiquidity(params: AddLiquidityParams): Promise<TransactionResponse>;
  removeLiquidity(params: RemoveLiquidityParams): Promise<TransactionResponse>;
  claimWinnings(params: ClaimParams): Promise<TransactionResponse>;
  claimLiquidity(params: ClaimParams): Promise<TransactionResponse>;
  claimFees(params: ClaimParams): Promise<TransactionResponse>;
  claimVoided(params: ClaimVoidedParams): Promise<TransactionResponse>;
  calcBuyAmount(params: CalcBuyAmountParams): Promise<BigNumberish>;
  calcSellAmount(params: CalcSellAmountParams): Promise<BigNumberish>;
  getMyPortfolio(): Promise<Portfolio>;
}
