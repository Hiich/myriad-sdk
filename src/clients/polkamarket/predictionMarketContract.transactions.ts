import {
  BuyParams,
  SellParams,
  AddLiquidityParams,
  RemoveLiquidityParams,
  ClaimParams,
  ClaimVoidedParams,
  TransactionResponse,
  BigNumberish,
  PolkamarketsPredictionMarketContract,
} from '../../types/polkamarket';

/**
 * Helper class for handling Polkamarkets prediction market transactions
 * 
 * This class provides methods to prepare and execute transactions on the Polkamarkets prediction market contract
 */
export class PredictionMarketTransactions {
  private contract: PolkamarketsPredictionMarketContract;

  /**
   * Create a new PredictionMarketTransactions instance
   * 
   * @param contract The underlying Polkamarkets contract instance
   */
  constructor(contract: PolkamarketsPredictionMarketContract) {
    this.contract = contract;
  }

  /**
   * Prepare a buy transaction
   * 
   * @param marketId The market ID
   * @param outcomeId The outcome ID
   * @param ethAmount The amount of ETH/tokens to spend
   * @returns The prepared buy parameters
   */
  async prepareBuyTransaction(
    marketId: BigNumberish,
    outcomeId: BigNumberish,
    ethAmount: BigNumberish
  ): Promise<BuyParams> {
    try {
      // Calculate the minimum amount of outcome shares to buy
      const minOutcomeSharesToBuy = await this.contract.calcBuyAmount({
        marketId,
        outcomeId,
        amount: ethAmount,
      });

      // Return the buy parameters
      return {
        marketId,
        outcomeId,
        minOutcomeSharesToBuy,
        value: ethAmount,
      };
    } catch (error) {
      throw new Error(`Failed to prepare buy transaction: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Execute a buy transaction
   * 
   * @param params Buy parameters
   * @returns Transaction response
   */
  async executeBuyTransaction(params: BuyParams): Promise<TransactionResponse> {
    try {
      return await this.contract.buy(params);
    } catch (error) {
      throw new Error(`Failed to execute buy transaction: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Prepare a sell transaction
   * 
   * @param marketId The market ID
   * @param outcomeId The outcome ID
   * @param ethAmount The amount of ETH/tokens to receive
   * @returns The prepared sell parameters
   */
  async prepareSellTransaction(
    marketId: BigNumberish,
    outcomeId: BigNumberish,
    ethAmount: BigNumberish
  ): Promise<SellParams> {
    try {
      // Calculate the maximum amount of outcome shares to sell
      const maxOutcomeSharesToSell = await this.contract.calcSellAmount({
        marketId,
        outcomeId,
        amount: ethAmount,
      });

      // Return the sell parameters
      return {
        marketId,
        outcomeId,
        value: ethAmount,
        maxOutcomeSharesToSell,
      };
    } catch (error) {
      throw new Error(`Failed to prepare sell transaction: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Execute a sell transaction
   * 
   * @param params Sell parameters
   * @returns Transaction response
   */
  async executeSellTransaction(params: SellParams): Promise<TransactionResponse> {
    try {
      return await this.contract.sell(params);
    } catch (error) {
      throw new Error(`Failed to execute sell transaction: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Add liquidity to a market
   * 
   * @param marketId The market ID
   * @param value The amount of tokens to add
   * @returns Transaction response
   */
  async addLiquidity(marketId: BigNumberish, value: BigNumberish): Promise<TransactionResponse> {
    try {
      const params: AddLiquidityParams = {
        marketId,
        value,
      };
      return await this.contract.addLiquidity(params);
    } catch (error) {
      throw new Error(`Failed to add liquidity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Remove liquidity from a market
   * 
   * @param marketId The market ID
   * @param shares The amount of liquidity shares to remove
   * @returns Transaction response
   */
  async removeLiquidity(marketId: BigNumberish, shares: BigNumberish): Promise<TransactionResponse> {
    try {
      const params: RemoveLiquidityParams = {
        marketId,
        shares,
      };
      return await this.contract.removeLiquidity(params);
    } catch (error) {
      throw new Error(`Failed to remove liquidity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Claim winnings from a resolved market
   * 
   * @param marketId The market ID
   * @returns Transaction response
   */
  async claimWinnings(marketId: BigNumberish): Promise<TransactionResponse> {
    try {
      const params: ClaimParams = { marketId };
      return await this.contract.claimWinnings(params);
    } catch (error) {
      throw new Error(`Failed to claim winnings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Claim liquidity from a resolved market
   * 
   * @param marketId The market ID
   * @returns Transaction response
   */
  async claimLiquidity(marketId: BigNumberish): Promise<TransactionResponse> {
    try {
      const params: ClaimParams = { marketId };
      return await this.contract.claimLiquidity(params);
    } catch (error) {
      throw new Error(`Failed to claim liquidity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Claim fees from a resolved market
   * 
   * @param marketId The market ID
   * @returns Transaction response
   */
  async claimFees(marketId: BigNumberish): Promise<TransactionResponse> {
    try {
      const params: ClaimParams = { marketId };
      return await this.contract.claimFees(params);
    } catch (error) {
      throw new Error(`Failed to claim fees: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Claim voided outcome shares
   * 
   * @param marketId The market ID
   * @param outcomeId The outcome ID
   * @returns Transaction response
   */
  async claimVoided(marketId: BigNumberish, outcomeId: BigNumberish): Promise<TransactionResponse> {
    try {
      const params: ClaimVoidedParams = { marketId, outcomeId };
      return await this.contract.claimVoided(params);
    } catch (error) {
      throw new Error(`Failed to claim voided shares: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
