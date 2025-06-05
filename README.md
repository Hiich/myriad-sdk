# Myriad SDK

A comprehensive TypeScript SDK for interacting with the Myriad protocol and Polkamarket blockchain. This SDK provides a unified interface for accessing both the Myriad Markets API and Polkamarket blockchain functionality.

[![npm version](https://img.shields.io/npm/v/myriad-sdk.svg)](https://www.npmjs.com/package/myriad-sdk)
[![License](https://img.shields.io/badge/license-UNLICENSED-blue.svg)](LICENSE)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Myriad Markets API](#myriad-markets-api)
  - [Polkamarket Blockchain](#polkamarket-blockchain)
- [API Reference](#api-reference)
  - [MyriadClient](#myriadclient)
  - [Myriad Markets API Client](#myriad-markets-api-client)
  - [Polkamarket Client](#polkamarket-client)
  - [Prediction Market Contract](#prediction-market-contract)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Myriad SDK provides a unified interface for interacting with both the Myriad Markets API and the Polkamarket blockchain. It allows developers to easily integrate prediction market functionality into their applications, with features for fetching market data, executing trades, managing liquidity, and claiming rewards.

## Features

- **Unified Interface**: Access both Myriad Markets API and Polkamarket blockchain through a single client
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Input Validation**: Robust input validation using Zod schemas
- **Error Handling**: Consistent error handling across all API calls
- **Network Support**: Support for both mainnet and testnet environments
- **Comprehensive API**: Complete coverage of Myriad Markets API and Polkamarket blockchain functionality

## Installation

```bash
# Using npm
npm install myriad-sdk

# Using yarn
yarn add myriad-sdk

# Using pnpm
pnpm add myriad-sdk
```

## Configuration

The SDK requires certain environment variables to be set:

```bash
# Required
WEB3_PROVIDER=https://your-web3-provider-url

# Optional
WEB3_PRIVATE_KEY=your-private-key
WEB3_EVENTS_PROVIDER=https://your-web3-events-provider-url
MAINNET=true  # Set to "true" for mainnet, omit for testnet
```

You can set these variables in a `.env` file at the root of your project. The SDK will automatically load them using `dotenv`.

## Usage

### Basic Usage

```typescript
import MyriadClient from 'myriad-sdk';

// Initialize the client
const client = new MyriadClient();

// Access Myriad Markets API
const markets = await client.myriad.fetchMarkets();

// Access Polkamarket blockchain
await client.polkamarket.login();
const address = await client.polkamarket.getUserAddress();
```

### Myriad Markets API

The Myriad Markets API client provides methods for fetching market data:

```typescript
import MyriadClient from 'myriad-sdk';

const client = new MyriadClient();

// Fetch all markets with optional filters
const markets = await client.myriad.fetchMarkets({
  status: 'open',
  categoryId: 'sports',
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortDirection: 'desc'
});

// Fetch a specific market by ID
const market = await client.myriad.fetchMarketById('market-id');

// Fetch a specific market by slug
const marketBySlug = await client.myriad.fetchMarketBySlug('market-slug');
```

### Polkamarket Blockchain

The Polkamarket client provides methods for interacting with the Polkamarket blockchain:

```typescript
import MyriadClient from 'myriad-sdk';

const client = new MyriadClient();

// Login to connect wallet
await client.polkamarket.login();

// Get user's wallet address
const address = await client.polkamarket.getUserAddress();

// Get prediction market contract
const contract = client.polkamarket.getPredictionMarketContract();

// Get all market IDs
const marketIds = await contract.getMarkets();

// Get market data
const marketData = await contract.getMarketData('1');

// Buy outcome shares
const buyParams = {
  marketId: '1',
  outcomeId: '0',
  minOutcomeSharesToBuy: '1000000000000000000',
  value: '1000000000000000000'
};
const buyTx = await contract.buy(buyParams);
const receipt = await buyTx.wait();
```

## API Reference

### MyriadClient

The main client that provides access to both Myriad Markets API and Polkamarket blockchain.

```typescript
class MyriadClient {
  public readonly myriad: Myriad;
  public readonly polkamarket: Polkamarket;
  
  constructor();
}
```

### Myriad Markets API Client

The Myriad Markets API client provides methods for fetching market data.

```typescript
class Myriad {
  constructor(options: MyriadConfig);
  
  fetchMarkets(filters?: MarketFilters): Promise<PaginatedResponse<Market>>;
  fetchMarketById(id: string): Promise<Market>;
  fetchMarketBySlug(slug: string): Promise<Market>;
}
```

#### Market Filters

```typescript
interface MarketFilters {
  status?: 'open' | 'closed' | 'resolved' | 'canceled';
  categoryId?: string;
  subcategoryId?: string;
  search?: string;
  tags?: string[];
  sortBy?: 'createdAt' | 'expiresAt' | 'volume' | 'liquidity';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
```

#### Market Response

```typescript
interface Market {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  resolvesAt?: string;
  resolvedAt?: string;
  status: 'open' | 'closed' | 'resolved' | 'canceled';
  category?: MarketCategory;
  subcategory?: MarketCategory;
  tags: MarketTag[];
  outcomes: MarketOutcome[];
  volume: MarketVolume;
  liquidity: MarketLiquidity;
  isResolved: boolean;
  resolvedOutcomeId?: string;
}
```

### Polkamarket Client

The Polkamarket client provides methods for interacting with the Polkamarket blockchain.

```typescript
class Polkamarket {
  constructor(options: PolkamarketConfig);
  
  login(): Promise<void>;
  getUserAddress(): Promise<string>;
  getPredictionMarketContract(): PredictionMarketContract;
}
```

### Prediction Market Contract

The Prediction Market Contract provides methods for interacting with the Polkamarket prediction market contract.

```typescript
interface PredictionMarketContract {
  // Query methods
  getMarkets(): Promise<BigNumberish[]>;
  getMarketData(marketId: BigNumberish): Promise<MarketData>;
  getMarketAltData(marketId: BigNumberish): Promise<MarketAltData>;
  getOutcomeData(marketId: BigNumberish, outcomeId: BigNumberish): Promise<MarketOutcomeData>;
  getMarketPrices(marketId: BigNumberish): Promise<MarketPricesData>;
  getMarketShares(marketId: BigNumberish): Promise<MarketSharesData>;
  getUserClaimStatus(marketId: BigNumberish, userAddress: string): Promise<UserClaimStatus>;
  getUserMarketShares(marketId: BigNumberish, userAddress: string): Promise<UserMarketShares>;
  getMyPortfolio(): Promise<Portfolio>;
  
  // Transaction methods
  createMarket(description: CreateMarketDescription): Promise<TransactionResponse>;
  buy(params: BuyParams): Promise<TransactionResponse>;
  sell(params: SellParams): Promise<TransactionResponse>;
  addLiquidity(params: AddLiquidityParams): Promise<TransactionResponse>;
  removeLiquidity(params: RemoveLiquidityParams): Promise<TransactionResponse>;
  claimWinnings(params: ClaimParams): Promise<TransactionResponse>;
  claimLiquidity(params: ClaimParams): Promise<TransactionResponse>;
  claimFees(params: ClaimParams): Promise<TransactionResponse>;
  claimVoided(params: ClaimVoidedParams): Promise<TransactionResponse>;
  
  // Calculation methods
  calcBuyAmount(params: CalcBuyAmountParams): Promise<BigNumberish>;
  calcSellAmount(params: CalcSellAmountParams): Promise<BigNumberish>;
}
```

## Error Handling

The SDK provides consistent error handling across all API calls. Errors are thrown with descriptive messages that include the original error message when possible.

```typescript
try {
  const markets = await client.myriad.fetchMarkets();
} catch (error) {
  console.error('Error fetching markets:', error.message);
}
```

## Validation

The SDK uses Zod schemas to validate both input parameters and API responses. This ensures that the data you receive is correctly typed and structured.

## Examples

### Fetching Markets and Buying Shares

```typescript
import MyriadClient from 'myriad-sdk';

async function tradeOnMarket() {
  // Initialize client
  const client = new MyriadClient();
  
  try {
    // Fetch open markets
    const markets = await client.myriad.fetchMarkets({ status: 'open' });
    console.log(`Found ${markets.meta.totalItems} open markets`);
    
    if (markets.data.length > 0) {
      const market = markets.data[0];
      console.log(`Selected market: ${market.title}`);
      
      // Login to Polkamarket
      await client.polkamarket.login();
      
      // Get prediction market contract
      const contract = client.polkamarket.getPredictionMarketContract();
      
      // Buy shares in the first outcome
      const buyParams = {
        marketId: market.id,
        outcomeId: '0',
        minOutcomeSharesToBuy: '1000000000000000000', // 1 share with 18 decimals
        value: '1000000000000000000' // 1 token with 18 decimals
      };
      
      const tx = await contract.buy(buyParams);
      console.log(`Transaction hash: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

tradeOnMarket();
```

### Creating a New Market

```typescript
import MyriadClient from 'myriad-sdk';
import { config } from 'myriad-sdk';

async function createNewMarket() {
  // Initialize client
  const client = new MyriadClient();
  
  try {
    // Login to Polkamarket
    await client.polkamarket.login();
    
    // Get user address
    const userAddress = await client.polkamarket.getUserAddress();
    
    // Get prediction market contract
    const contract = client.polkamarket.getPredictionMarketContract();
    
    // Get network configuration
    const network = process.env.MAINNET === 'true' ? 'mainnet' : 'testnet';
    const networkConfig = config.contracts[network];
    
    // Create market description
    const marketDescription = {
      value: '1000000000000000000', // Initial liquidity (1 token with 18 decimals)
      closesAt: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days from now
      outcomes: 2, // Binary market (Yes/No)
      token: networkConfig.tokens.USDC, // Use USDC token
      distribution: ['500000000000000000', '500000000000000000'], // Equal initial distribution
      question: 'Will Bitcoin reach $100,000 by the end of 2025?',
      image: 'https://example.com/image.jpg',
      arbitrator: userAddress, // User is the arbitrator
      fee: '20000000000000000', // 2% fee (with 18 decimals)
      treasuryFee: '10000000000000000', // 1% treasury fee (with 18 decimals)
      treasury: networkConfig.treasury || userAddress,
      realitio: networkConfig.realitio || '0x0000000000000000000000000000000000000000',
      realitioTimeout: 86400 * 3, // 3 days timeout
      manager: userAddress // User is the manager
    };
    
    // Create the market
    const tx = await contract.createMarket(marketDescription);
    console.log(`Transaction hash: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`Market created in block ${receipt.blockNumber}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createNewMarket();
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

UNLICENSED - © Hich.eth
