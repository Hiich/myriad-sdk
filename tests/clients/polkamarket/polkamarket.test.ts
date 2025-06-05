import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Polkamarket } from '../../../src/clients/polkamarket';
import * as polkamarketsjs from 'polkamarkets-js';
import { PredictionMarketContractWrapper } from '../../../src/clients/polkamarket/predictionMarketContract';

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
      })
    })
  };

  return {
    Application: vi.fn().mockImplementation(() => mockApplication)
  };
});

// Mock the config
vi.mock('../../../src/config', () => ({
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

describe('Polkamarket Client', () => {
  let polkamarket: Polkamarket;
  const validConfig = {
    web3Provider: 'https://example.com',
    web3PrivateKey: '0xprivatekey',
    network: 'mainnet' as const
  };

  beforeEach(() => {
    vi.clearAllMocks();
    polkamarket = new Polkamarket(validConfig);
  });

  describe('Constructor', () => {
    it('should create a new Polkamarket instance', () => {
      expect(polkamarket).toBeInstanceOf(Polkamarket);
      expect(polkamarketsjs.Application).toHaveBeenCalledWith({
        web3Provider: validConfig.web3Provider,
        web3PrivateKey: validConfig.web3PrivateKey,
        web3EventsProvider: undefined
      });
    });

    it('should throw an error with invalid config', () => {
      expect(() => new Polkamarket({} as any)).toThrow();
    });
  });

  describe('login', () => {
    it('should call the application login method', async () => {
      await polkamarket.login();
      const mockApp = (polkamarketsjs.Application as any).mock.results[0].value;
      expect(mockApp.login).toHaveBeenCalled();
    });

    it('should handle login errors', async () => {
      const mockApp = (polkamarketsjs.Application as any).mock.results[0].value;
      mockApp.login.mockRejectedValueOnce(new Error('Login failed'));
      
      await expect(polkamarket.login()).rejects.toThrow('Failed to login to Polkamarkets: Login failed');
    });
  });

  describe('getUserAddress', () => {
    it('should return the user address', async () => {
      const address = await polkamarket.getUserAddress();
      expect(address).toBe('0x123456789abcdef');
      
      const mockApp = (polkamarketsjs.Application as any).mock.results[0].value;
      expect(mockApp.getUserAddress).toHaveBeenCalled();
    });

    it('should handle getUserAddress errors', async () => {
      const mockApp = (polkamarketsjs.Application as any).mock.results[0].value;
      mockApp.getUserAddress.mockRejectedValueOnce(new Error('Address retrieval failed'));
      
      await expect(polkamarket.getUserAddress()).rejects.toThrow('Failed to get user address: Address retrieval failed');
    });
  });

  describe('getPredictionMarketContract', () => {
    it('should return a PredictionMarketContractWrapper instance', async () => {
      // Since getPredictionMarketContract is wrapped with withValidation, we need to await it
      const contract = await polkamarket.getPredictionMarketContract();
      
      // Check if it's a PredictionMarketContractWrapper
      expect(contract).toBeDefined();
      expect(contract).toBeInstanceOf(PredictionMarketContractWrapper);
      
      const mockApp = (polkamarketsjs.Application as any).mock.results[0].value;
      expect(mockApp.getPredictionMarketV3Contract).toHaveBeenCalledWith({
        contractAddress: '0xPredictionMarketAddress',
        querierContractAddress: '0xPredictionMarketQuerierAddress'
      });
    });

    it('should handle getPredictionMarketContract errors', async () => {
      const mockApp = (polkamarketsjs.Application as any).mock.results[0].value;
      mockApp.getPredictionMarketV3Contract.mockImplementationOnce(() => {
        throw new Error('Contract retrieval failed');
      });
      
      await expect(polkamarket.getPredictionMarketContract()).rejects.toThrow();
    });
  });
});
