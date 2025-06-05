import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PredictionMarketContractWrapper } from '../../../src/clients/polkamarket/predictionMarketContract';
import { BigNumberish, MarketState } from '../../../src/types/polkamarket';

describe('PredictionMarketContractWrapper', () => {
  let contractWrapper: PredictionMarketContractWrapper;
  const mockContract = {
    getMarkets: vi.fn(),
    getMarketData: vi.fn(),
    getMarketAltData: vi.fn(),
    getOutcomeData: vi.fn(),
    getMarketPrices: vi.fn(),
    getMarketShares: vi.fn(),
    getUserClaimStatus: vi.fn(),
    getUserMarketShares: vi.fn(),
    createMarket: vi.fn(),
    buy: vi.fn(),
    sell: vi.fn(),
    addLiquidity: vi.fn(),
    removeLiquidity: vi.fn(),
    claimWinnings: vi.fn(),
    claimLiquidity: vi.fn(),
    claimFees: vi.fn(),
    claimVoided: vi.fn(),
    calcBuyAmount: vi.fn(),
    calcSellAmount: vi.fn(),
    getMyPortfolio: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    contractWrapper = new PredictionMarketContractWrapper(mockContract as any);
  });

  describe('getMarkets', () => {
    it('should return market IDs', async () => {
      const expectedMarkets: BigNumberish[] = ['1', '2', '3'];
      mockContract.getMarkets.mockResolvedValue(expectedMarkets);

      const result = await contractWrapper.getMarkets();
      expect(result).toEqual(expectedMarkets);
      expect(mockContract.getMarkets).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockContract.getMarkets.mockRejectedValue(new Error('Failed to get markets'));
      await expect(contractWrapper.getMarkets()).rejects.toThrow('Failed to get markets');
    });
  });

  describe('getMarketData', () => {
    it('should return market data', async () => {
      const marketId = '1';
      const expectedData = {
        state: MarketState.OPEN,
        closesAt: '1000000000',
        outcomes: '2',
        liquidity: '1000',
        fee: '10',
        resolvedOutcomeId: null
      };
      mockContract.getMarketData.mockResolvedValue(expectedData);

      const result = await contractWrapper.getMarketData(marketId);
      expect(result).toEqual(expectedData);
      expect(mockContract.getMarketData).toHaveBeenCalledWith({ marketId });
    });

    it('should handle errors', async () => {
      mockContract.getMarketData.mockRejectedValue(new Error('Failed to get market data'));
      await expect(contractWrapper.getMarketData('1')).rejects.toThrow('Failed to get market data');
    });
  });

  describe('getMarketAltData', () => {
    it('should return market alt data', async () => {
      const marketId = '1';
      const expectedData = {
        closesAt: '1000000000',
        questionId: '0x123',
        outcomes: '2',
        token: '0xTokenAddress',
        fee: '10',
        treasury: '0xTreasuryAddress',
        realitio: '0xRealitioAddress',
        realitioTimeout: '86400',
        manager: '0xManagerAddress'
      };
      mockContract.getMarketAltData.mockResolvedValue(expectedData);

      const result = await contractWrapper.getMarketAltData(marketId);
      expect(result).toEqual(expectedData);
      expect(mockContract.getMarketAltData).toHaveBeenCalledWith({ marketId });
    });

    it('should handle errors', async () => {
      mockContract.getMarketAltData.mockRejectedValue(new Error('Failed to get market alt data'));
      await expect(contractWrapper.getMarketAltData('1')).rejects.toThrow('Failed to get market alt data');
    });
  });

  describe('getOutcomeData', () => {
    it('should return outcome data', async () => {
      const marketId = '1';
      const outcomeId = '0';
      const expectedData = {
        price: '500000000000000000',
        shares: '1000000000000000000',
        totalShares: '2000000000000000000'
      };
      mockContract.getOutcomeData.mockResolvedValue(expectedData);

      const result = await contractWrapper.getOutcomeData(marketId, outcomeId);
      expect(result).toEqual(expectedData);
      expect(mockContract.getOutcomeData).toHaveBeenCalledWith({ marketId, outcomeId });
    });

    it('should handle errors', async () => {
      mockContract.getOutcomeData.mockRejectedValue(new Error('Failed to get outcome data'));
      await expect(contractWrapper.getOutcomeData('1', '0')).rejects.toThrow('Failed to get outcome data');
    });
  });

  describe('getMarketPrices', () => {
    it('should return market prices data', async () => {
      const marketId = '1';
      const expectedData = {
        liquidityPrice: '500000000000000000',
        outcomePrices: ['400000000000000000', '600000000000000000']
      };
      mockContract.getMarketPrices.mockResolvedValue(expectedData);

      const result = await contractWrapper.getMarketPrices(marketId);
      expect(result).toEqual(expectedData);
      expect(mockContract.getMarketPrices).toHaveBeenCalledWith({ marketId });
    });

    it('should handle errors', async () => {
      mockContract.getMarketPrices.mockRejectedValue(new Error('Failed to get market prices'));
      await expect(contractWrapper.getMarketPrices('1')).rejects.toThrow('Failed to get market prices');
    });
  });

  // Additional tests for other methods can be added following the same pattern
});
