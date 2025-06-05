import * as polkamarketsjs from "polkamarkets-js";
import { config } from "../../config";
import {
  Address,
  PolkamarketConfig,
  Network,
  PredictionMarketContract,
  PolkamarketsApplication,
} from "../../types/polkamarket";
import { PredictionMarketContractWrapper } from "./predictionMarketContract";
import { z } from "zod";
import { polkamarketConfigSchema } from "../../validation/schemas";
import { validate } from "../../validation/utils";
import { withValidation } from "../../validation/middleware";

/**
 * Polkamarket SDK Client
 *
 * Provides methods to interact with the Polkamarkets blockchain contracts
 */
export class Polkamarket {
  private readonly application: PolkamarketsApplication;
  private readonly network: Network;

  /**
   * Create a new Polkamarket client instance
   *
   * @param options Configuration options for the client
   */
  constructor(options: PolkamarketConfig) {
    // Validate config
    const validatedOptions = validate(
      polkamarketConfigSchema,
      options,
      "Polkamarket constructor"
    );

    this.network = validatedOptions.network || "mainnet";

    // Initialize the Polkamarkets application
    this.application = new polkamarketsjs.Application({
      web3Provider: validatedOptions.web3Provider,
      web3PrivateKey: validatedOptions.web3PrivateKey,
      web3EventsProvider: validatedOptions.web3EventsProvider,
    });

    // Start the application
    this.application.start();
  }

  /**
   * Connect wallet to the Polkamarkets application
   * This is required before performing transactions
   */
  login = withValidation<void, void>(
    z.void(),
    z.void(),
    "login"
  )(async (): Promise<void> => {
    try {
      await this.application.login();
    } catch (error) {
      throw new Error(
        `Failed to login to Polkamarkets: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });

  /**
   * Get the user's wallet address
   *
   * @returns The connected wallet address
   */
  getUserAddress = withValidation<void, Address>(
    z.void(),
    z.string().min(1),
    "getUserAddress"
  )(async (): Promise<Address> => {
    try {
      return await this.application.getUserAddress();
    } catch (error) {
      throw new Error(
        `Failed to get user address: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });

  /**
   * Get the Prediction Market contract instance
   *
   * @returns A PredictionMarketContract instance
   */
  getPredictionMarketContract = withValidation<void, PredictionMarketContract>(
    z.void(),
    z.any(), // We can't easily validate the contract instance with Zod
    "getPredictionMarketContract"
  )(() => {
    try {
      const networkConfig = config.contracts[this.network];

      // Get the prediction market contract from the application
      const pmContract = this.application.getPredictionMarketV3Contract({
        contractAddress: networkConfig.predictionMarket,
        querierContractAddress: networkConfig.predictionMarketQuerier,
      });

      // Return the wrapped contract
      return new PredictionMarketContractWrapper(pmContract);
    } catch (error) {
      throw new Error(
        `Failed to get prediction market contract: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });
}

// Export the Polkamarket class as default
export default Polkamarket;
