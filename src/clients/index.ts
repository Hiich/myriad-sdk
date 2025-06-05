import { Myriad } from "./myriad";
import { Polkamarket } from "./polkamarket";
import { configDotenv } from "dotenv";
configDotenv();
/**
 * Unified client for interacting with both Myriad Markets API and Polkamarket blockchain
 *
 * This client provides direct access to both the Myriad Markets API client and the Polkamarket blockchain client
 * as public properties, allowing for seamless interaction with both systems.
 */
export class MyriadClient {
  /** Myriad Markets API client */
  public readonly myriad: Myriad;
  /** Polkamarket blockchain client */
  public readonly polkamarket: Polkamarket;

  /**
   * Create a new MyriadClient instance
   *
   * @param config Configuration options for the client
   */
  constructor() {
    if (!process.env.WEB3_PROVIDER) {
      throw new Error("WEB3_PROVIDER environment variable is not set");
    }

    // Initialize Myriad client
    this.myriad = new Myriad({
      network: process.env.MAINNET === "true" ? "mainnet" : "testnet",
    });

    // Initialize Polkamarket client
    this.polkamarket = new Polkamarket({
      web3Provider: process.env.WEB3_PROVIDER,
      web3PrivateKey: process.env.WEB3_PRIVATE_KEY,
      web3EventsProvider: process.env.WEB3_EVENTS_PROVIDER,
      network: process.env.MAINNET === "true" ? "mainnet" : "testnet",
    });
  }

  // No helper methods - users will directly access client properties
}

// Export the client as default
export default MyriadClient;
