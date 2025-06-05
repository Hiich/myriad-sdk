# Myriad SDK

A TypeScript SDK for interacting with the Myriad protocol.

## Installation

```bash
npm install myriad-sdk
# or
yarn add myriad-sdk
# or
pnpm add myriad-sdk
```

## Usage

```typescript
import MyriadClient from 'myriad-sdk';
// or import specific components
import { config } from 'myriad-sdk';

// Initialize the client
const client = new MyriadClient({
  // configuration options
});

// Use the client
const result = await client.someMethod();
```

## Documentation

For detailed documentation, please refer to the source code and included TypeScript definitions.

## License

UNLICENSED - © Hich.eth
