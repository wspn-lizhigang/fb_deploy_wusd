# Solana Web3.js Fireblocks Provider

A Fireblocks-compatible Solana Web3.js provider supporting token minting and program deployment.

## Features

- Fully integrated Solana Web3.js provider with Fireblocks
- Supports token minting and program deployment
- Highly configurable connection adapter
- Built-in transaction status polling and retry mechanisms
- Compatible with devnet and mainnet environments

## Installation

```bash
yarn install -g typescript ts-node
yarn install
```

## Configuration

Set the following environment variables before use:

```env
FIREBLOCKS_API_KEY=your_api_key
FIREBLOCKS_SECRET_KEY_PATH=path_to_your_secret_key
FIREBLOCKS_VAULT_ACCOUNT_ID=your_vault_account_id
```

## Usage Examples

### Initialize Connection

```typescript
import { FireblocksConnectionAdapter, FireblocksConnectionAdapterConfig, FeeLevel } from 'solana_fireblocks_web3_provider';
import { clusterApiUrl } from '@solana/web3.js';

const config: FireblocksConnectionAdapterConfig = {
  apiKey: process.env.FIREBLOCKS_API_KEY,
  apiSecretPath: process.env.FIREBLOCKS_SECRET_KEY_PATH,
  vaultAccountId: process.env.FIREBLOCKS_VAULT_ACCOUNT_ID,
  feeLevel: FeeLevel.HIGH,
  silent: false,
  devnet: true
};

const connection = await FireblocksConnectionAdapter.create(
  clusterApiUrl('devnet'),
  config
);
```

### Deploy Program

Deploy Solana programs using:

```bash
yarn deploy
```

### Mint Tokens

Run the complete token minting script with:

```bash
yarn mint
```

This will:
- Create a new token mint account
- Initialize the token mint
- Create associated token account
- Mint specified amount of tokens

## API Reference

### FireblocksConnectionAdapter

Main connection adapter class with configurable options:

- `apiKey`: Fireblocks API key
- `apiSecretPath`: Path to Fireblocks secret key file
- `vaultAccountId`: Fireblocks vault account ID
- `feeLevel`: Transaction fee level (LOW/MEDIUM/HIGH)
- `silent`: Disable logging output
- `devnet`: Use devnet environment

### Helper Functions

- `waitForSignature`: Wait for transaction confirmation with auto-retry

## Important Notes

- Ensure Fireblocks API key has sufficient permissions
- Test on devnet before mainnet deployment
- Securely store secret keys - do not commit to version control 