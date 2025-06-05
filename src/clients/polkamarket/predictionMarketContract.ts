import {
  MarketData,
  MarketAltData,
  MarketOutcomeData,
  MarketPricesData,
  MarketSharesData,
  UserClaimStatus,
  UserMarketShares,
  BuyParams,
  SellParams,
  AddLiquidityParams,
  RemoveLiquidityParams,
  ClaimParams,
  ClaimVoidedParams,
  CalcBuyAmountParams,
  CalcSellAmountParams,
  TransactionResponse,
  Portfolio,
  BigNumberish,
  PredictionMarketContract,
  CreateMarketDescription,
  PolkamarketsPredictionMarketContract,
} from '../../types/polkamarket';

/**
 * Wrapper for the Polkamarkets Prediction Market Contract
 * 
 * Provides strongly typed methods to interact with the contract
 */
export class PredictionMarketContractWrapper implements PredictionMarketContract {
  private contract: PolkamarketsPredictionMarketContract;

  /**
   * Create a new PredictionMarketContractWrapper instance
   * 
   * @param contract The underlying Polkamarkets contract instance
   */
  constructor(contract: PolkamarketsPredictionMarketContract) {
    this.contract = contract;
  }

  /**
   * Get all market IDs
   * 
   * @returns Array of market IDs
   */
  async getMarkets(): Promise<BigNumberish[]> {
    try {
      return await this.contract.getMarkets();
    } catch (error) {
      throw new Error(`Failed to get markets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get market data by ID
   * 
   * @param marketId The market ID
   * @returns Market data
   */
  async getMarketData(marketId: BigNumberish): Promise<MarketData> {
    try {
      return await this.contract.getMarketData({ marketId });
    } catch (error) {
      throw new Error(`Failed to get market data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get alternative market data by ID
   * 
   * @param marketId The market ID
   * @returns Alternative market data
   */
  async getMarketAltData(marketId: BigNumberish): Promise<MarketAltData> {
    try {
      return await this.contract.getMarketAltData({ marketId });
    } catch (error) {
      throw new Error(`Failed to get market alt data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get outcome data for a market
   * 
   * @param marketId The market ID
   * @param outcomeId The outcome ID
   * @returns Outcome data
   */
  async getOutcomeData(marketId: BigNumberish, outcomeId: BigNumberish): Promise<MarketOutcomeData> {
    try {
      return await this.contract.getOutcomeData({ marketId, outcomeId });
    } catch (error) {
      throw new Error(`Failed to get outcome data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get market prices data
   * 
   * @param marketId The market ID
   * @returns Market prices data
   */
  async getMarketPrices(marketId: BigNumberish): Promise<MarketPricesData> {
    try {
      return await this.contract.getMarketPrices({ marketId });
    } catch (error) {
      throw new Error(`Failed to get market prices: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get market shares data
   * 
   * @param marketId The market ID
   * @returns Market shares data
   */
  async getMarketShares(marketId: BigNumberish): Promise<MarketSharesData> {
    try {
      return await this.contract.getMarketShares({ marketId });
    } catch (error) {
      throw new Error(`Failed to get market shares: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get user claim status for a market
   * 
   * @param marketId The market ID
   * @param userAddress The user's address
   * @returns User claim status
   */
  async getUserClaimStatus(marketId: BigNumberish, userAddress: string): Promise<UserClaimStatus> {
    try {
      return await this.contract.getUserClaimStatus({ marketId, userAddress });
    } catch (error) {
      throw new Error(`Failed to get user claim status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get user market shares
   * 
   * @param marketId The market ID
   * @param userAddress The user's address
   * @returns User market shares
   */
  async getUserMarketShares(marketId: BigNumberish, userAddress: string): Promise<UserMarketShares> {
    try {
      return await this.contract.getUserMarketShares({ marketId, userAddress });
    } catch (error) {
      throw new Error(`Failed to get user market shares: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create a new prediction market
   * 
   * @param description Market description
   * @returns Transaction response
   */
  async createMarket(description: CreateMarketDescription): Promise<TransactionResponse> {
    try {
      return await this.contract.createMarket(description);
    } catch (error) {
      throw new Error(`Failed to create market: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Buy outcome shares
   * 
   * @param params Buy parameters
   * @returns Transaction response
   */
  async buy(params: BuyParams): Promise<TransactionResponse> {
    try {
      return await this.contract.buy(params);
    } catch (error) {
      throw new Error(`Failed to buy outcome shares: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Sell outcome shares
   * 
   * @param params Sell parameters
   * @returns Transaction response
   */
  async sell(params: SellParams): Promise<TransactionResponse> {
    try {
      return await this.contract.sell(params);
    } catch (error) {
      throw new Error(`Failed to sell outcome shares: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Add liquidity to a market
   * 
   * @param params Add liquidity parameters
   * @returns Transaction response
   */
  async addLiquidity(params: AddLiquidityParams): Promise<TransactionResponse> {
    try {
      return await this.contract.addLiquidity(params);
    } catch (error) {
      throw new Error(`Failed to add liquidity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Remove liquidity from a market
   * 
   * @param params Remove liquidity parameters
   * @returns Transaction response
   */
  async removeLiquidity(params: RemoveLiquidityParams): Promise<TransactionResponse> {
    try {
      return await this.contract.removeLiquidity(params);
    } catch (error) {
      throw new Error(`Failed to remove liquidity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Claim winnings from a resolved market
   * 
   * @param params Claim parameters
   * @returns Transaction response
   */
  async claimWinnings(params: ClaimParams): Promise<TransactionResponse> {
    try {
      return await this.contract.claimWinnings(params);
    } catch (error) {
      throw new Error(`Failed to claim winnings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Claim liquidity from a resolved market
   * 
   * @param params Claim parameters
   * @returns Transaction response
   */
  async claimLiquidity(params: ClaimParams): Promise<TransactionResponse> {
    try {
      return await this.contract.claimLiquidity(params);
    } catch (error) {
      throw new Error(`Failed to claim liquidity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Claim fees from a resolved market
   * 
   * @param params Claim parameters
   * @returns Transaction response
   */
  async claimFees(params: ClaimParams): Promise<TransactionResponse> {
    try {
      return await this.contract.claimFees(params);
    } catch (error) {
      throw new Error(`Failed to claim fees: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Claim voided outcome shares
   * 
   * @param params Claim voided parameters
   * @returns Transaction response
   */
  async claimVoided(params: ClaimVoidedParams): Promise<TransactionResponse> {
    try {
      return await this.contract.claimVoided(params);
    } catch (error) {
      throw new Error(`Failed to claim voided shares: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Calculate the amount of outcome shares to buy
   * 
   * @param params Calculation parameters
   * @returns Amount of outcome shares
   */
  async calcBuyAmount(params: CalcBuyAmountParams): Promise<BigNumberish> {
    try {
      return await this.contract.calcBuyAmount(params);
    } catch (error) {
      throw new Error(`Failed to calculate buy amount: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Calculate the amount of outcome shares to sell
   * 
   * @param params Calculation parameters
   * @returns Amount of outcome shares
   */
  async calcSellAmount(params: CalcSellAmountParams): Promise<BigNumberish> {
    try {
      return await this.contract.calcSellAmount(params);
    } catch (error) {
      throw new Error(`Failed to calculate sell amount: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get the user's portfolio
   * 
   * @returns User portfolio
   */
  async getMyPortfolio(): Promise<Portfolio> {
    try {
      return await this.contract.getMyPortfolio();
    } catch (error) {
      throw new Error(`Failed to get portfolio: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
