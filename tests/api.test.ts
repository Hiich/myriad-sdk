import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { Polkamarket } from '../src/clients/polkamarket';
import * as polkamarketsjs from 'polkamarkets-js';

// Mock the polkamarkets-js module
vi.mock('polkamarkets-js', () => {
  const mockApplication = {
    start: vi.fn(),
    login: vi.fn().mockResolvedValue(undefined),
    getUserAddress: vi.fn().mockResolvedValue('0x123456789abcdef'),
    getPredictionMarketV3Contract: vi.fn().mockReturnValue({
      getMarkets: vi.fn().mockResolvedValue(['1', '2', '3']),
      getMarketData: vi.fn().mockResolvedValue({
        state: 0,
        closesAt: '1000000000',
        outcomes: '2',
        liquidity: '1000',
        fee: '10',
        resolvedOutcomeId: null
      }),
      getMarketAltData: vi.fn().mockResolvedValue({
        closesAt: '1000000000',
        questionId: '0x123',
        outcomes: '2',
        token: '0xTokenAddress',
        fee: '10',
        treasury: '0xTreasuryAddress',
        realitio: '0xRealitioAddress',
        realitioTimeout: '86400',
        manager: '0xManagerAddress'
      }),
      getOutcomeData: vi.fn().mockResolvedValue({
        price: '500000000000000000',
        shares: '1000000000000000000',
        totalShares: '2000000000000000000'
      }),
      getMarketPrices: vi.fn().mockResolvedValue({
        liquidityPrice: '500000000000000000',
        outcomePrices: ['400000000000000000', '600000000000000000']
      }),
      getMarketShares: vi.fn().mockResolvedValue({
        liquidityShares: '1000000000000000000',
        outcomeShares: ['500000000000000000', '500000000000000000']
      }),
      getUserClaimStatus: vi.fn().mockResolvedValue({
        claimedWinnings: false,
        claimedLiquidity: false,
        claimedFees: false,
        claimedVoided: false,
        resolvedOutcomeId: '0'
      }),
      getUserMarketShares: vi.fn().mockResolvedValue({
        liquidityPoolShares: '100000000000000000',
        outcomeShares: ['50000000000000000', '50000000000000000']
      }),
      getMyPortfolio: vi.fn().mockResolvedValue({
        markets: [
          {
            marketId: '1',
            liquidityPoolShares: '100000000000000000',
            outcomeShares: ['50000000000000000', '50000000000000000'],
            claimStatus: {
              claimedWinnings: false,
              claimedLiquidity: false,
              claimedFees: false,
              claimedVoided: false,
              resolvedOutcomeId: '0'
            }
          }
        ]
      })
    })
  };

  return {
    Application: vi.fn().mockImplementation(() => mockApplication)
  };
});

// Mock the config
vi.mock('../src/config', () => ({
  config: {
    contracts: {
      mainnet: {
        predictionMarket: '0xPredictionMarketAddress',
        predictionMarketQuerier: '0xPredictionMarketQuerierAddress'
      },
      testnet: {
        predictionMarket: '0xTestPredictionMarketAddress',
        predictionMarketQuerier: '0xTestPredictionMarketQuerierAddress'
      }
    }
  }
}));

describe('API Endpoints Responsiveness', () => {
  let polkamarket: Polkamarket;
  let contract: any;

  // Mock the PredictionMarketContractWrapper
  vi.mock('../src/clients/polkamarket/predictionMarketContract', () => {
    return {
      PredictionMarketContractWrapper: vi.fn().mockImplementation(() => ({
        getMarkets: vi.fn().mockResolvedValue(['1', '2', '3']),
        getMarketData: vi.fn().mockResolvedValue({
          state: 0,
          closesAt: '1000000000',
          outcomes: '2',
          liquidity: '1000',
          fee: '10',
          resolvedOutcomeId: null
        }),
        getMarketAltData: vi.fn().mockResolvedValue({
          closesAt: '1000000000',
          questionId: '0x123',
          outcomes: '2',
          token: '0xTokenAddress',
          fee: '10',
          treasury: '0xTreasuryAddress',
          realitio: '0xRealitioAddress',
          realitioTimeout: '86400',
          manager: '0xManagerAddress'
        }),
        getOutcomeData: vi.fn().mockResolvedValue({
          price: '500000000000000000',
          shares: '1000000000000000000',
          totalShares: '2000000000000000000'
        }),
        getMarketPrices: vi.fn().mockResolvedValue({
          liquidityPrice: '500000000000000000',
          outcomePrices: ['400000000000000000', '600000000000000000']
        }),
        getMarketShares: vi.fn().mockResolvedValue({
          liquidityShares: '1000000000000000000',
          outcomeShares: ['500000000000000000', '500000000000000000']
        }),
        getUserClaimStatus: vi.fn().mockResolvedValue({
          claimedWinnings: false,
          claimedLiquidity: false,
          claimedFees: false,
          claimedVoided: false,
          resolvedOutcomeId: '0'
        }),
        getUserMarketShares: vi.fn().mockResolvedValue({
          liquidityPoolShares: '100000000000000000',
          outcomeShares: ['50000000000000000', '50000000000000000']
        }),
        getMyPortfolio: vi.fn().mockResolvedValue({
          markets: [
            {
              marketId: '1',
              liquidityPoolShares: '100000000000000000',
              outcomeShares: ['50000000000000000', '50000000000000000'],
              claimStatus: {
                claimedWinnings: false,
                claimedLiquidity: false,
                claimedFees: false,
                claimedVoided: false,
                resolvedOutcomeId: '0'
              }
            }
          ]
        })
      }))
    };
  });

  beforeAll(async () => {
    polkamarket = new Polkamarket({
      web3Provider: 'https://example.com',
      web3PrivateKey: '0xprivatekey',
      network: 'mainnet'
    });
    
    // Since getPredictionMarketContract returns a Promise, we need to await it
    contract = await polkamarket.getPredictionMarketContract();
  });

  describe('Polkamarket Client', () => {
    it('should respond to login', () => {
      polkamarket.login();
      expect(true).toBe(true); // If no error is thrown, the test passes
    });

    it('should respond to getUserAddress', () => {
      const address = polkamarket.getUserAddress();
      expect(address).toBeDefined();
    });

    it('should respond to getPredictionMarketContract', async () => {
      const contract = await polkamarket.getPredictionMarketContract();
      expect(contract).toBeDefined();
    });
  });

  describe('Prediction Market Contract', () => {
    // Make sure we have a valid contract object for testing
    beforeEach(() => {
      expect(contract).toBeDefined();
      expect(typeof contract.getMarkets).toBe('function');
      expect(typeof contract.getMarketData).toBe('function');
      expect(typeof contract.getMarketAltData).toBe('function');
      expect(typeof contract.getOutcomeData).toBe('function');
      expect(typeof contract.getMarketPrices).toBe('function');
      expect(typeof contract.getMarketShares).toBe('function');
      expect(typeof contract.getUserClaimStatus).toBe('function');
      expect(typeof contract.getUserMarketShares).toBe('function');
      expect(typeof contract.getMyPortfolio).toBe('function');
    });

    it('should respond to getMarkets', async () => {
      const markets = await contract.getMarkets();
      expect(Array.isArray(markets)).toBe(true);
    });

    it('should respond to getMarketData', async () => {
      const marketData = await contract.getMarketData('1');
      expect(marketData).toHaveProperty('state');
      expect(marketData).toHaveProperty('closesAt');
    });

    it('should respond to getMarketAltData', async () => {
      const marketAltData = await contract.getMarketAltData('1');
      expect(marketAltData).toHaveProperty('closesAt');
      expect(marketAltData).toHaveProperty('questionId');
    });

    it('should respond to getOutcomeData', async () => {
      const outcomeData = await contract.getOutcomeData('1', '0');
      expect(outcomeData).toHaveProperty('price');
      expect(outcomeData).toHaveProperty('shares');
    });

    it('should respond to getMarketPrices', async () => {
      const prices = await contract.getMarketPrices('1');
      expect(prices).toHaveProperty('liquidityPrice');
      expect(prices).toHaveProperty('outcomePrices');
    });

    it('should respond to getMarketShares', async () => {
      const shares = await contract.getMarketShares('1');
      expect(shares).toHaveProperty('liquidityShares');
      expect(shares).toHaveProperty('outcomeShares');
    });

    it('should respond to getUserClaimStatus', async () => {
      const claimStatus = await contract.getUserClaimStatus('1', '0x123456789abcdef');
      expect(claimStatus).toHaveProperty('claimedWinnings');
      expect(claimStatus).toHaveProperty('claimedLiquidity');
    });

    it('should respond to getUserMarketShares', async () => {
      const userShares = await contract.getUserMarketShares('1', '0x123456789abcdef');
      expect(userShares).toHaveProperty('liquidityPoolShares');
      expect(userShares).toHaveProperty('outcomeShares');
    });

    it('should respond to getMyPortfolio', async () => {
      const portfolio = await contract.getMyPortfolio();
      expect(portfolio).toHaveProperty('markets');
      expect(Array.isArray(portfolio.markets)).toBe(true);
    });
  });
});
