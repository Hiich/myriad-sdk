/**
 * Type declarations for polkamarkets-js
 * 
 * This file provides TypeScript type definitions for the Polkamarkets JavaScript SDK
 */

declare module 'polkamarkets-js' {
  import { 
    PolkamarketsApplication,
    PolkamarketsPredictionMarketContract,
    CreateMarketDescription,
    TransactionResponse
  } from './polkamarket';

  /**
   * Application class for interacting with Polkamarkets
   */
  export class Application implements PolkamarketsApplication {
    /**
     * Create a new Polkamarkets application instance
     * 
     * @param options Configuration options
     */
    constructor(options: {
      web3Provider: string;
      web3PrivateKey?: string;
      web3EventsProvider?: string;
    });

    /**
     * Start the Polkamarkets application
     */
    start(): void;

    /**
     * Connect wallet to the Polkamarkets application
     */
    login(): Promise<void>;

    /**
     * Get the connected wallet address
     * 
     * @returns The wallet address
     */
    getUserAddress(): Promise<string>;

    /**
     * Get the Prediction Market V3 contract
     * 
     * @param options Contract options
     * @returns The prediction market contract
     */
    getPredictionMarketV3Contract(options: {
      contractAddress: string;
      querierContractAddress?: string;
    }): PolkamarketsPredictionMarketContract;
  }

  /**
   * Create a new prediction market
   * 
   * @param description Market description
   * @returns Transaction response
   */
  export function createMarket(description: CreateMarketDescription): Promise<TransactionResponse>;
}
