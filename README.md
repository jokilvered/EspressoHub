# EspressoHub - Multi-Rollup Manager & Bridge

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-blue?style=for-the-badge)](https://espresso-hub-brew.vercel.app/)
[![Demo Video](https://img.shields.io/badge/Demo-Watch_Video-red?style=for-the-badge&logo=youtube)](https://youtu.be/-0KHKo7l9OM)

EspressoHub is a comprehensive management and bridge solution for Espresso-powered rollups. Built during the Espresso "Build & Brew" Hackathon, this application provides a unified interface for tracking, bridging, and managing transactions across multiple Espresso-integrated rollups.

## Features

### 🔍 Cross-Rollup Transaction Search

- Search for any transaction across multiple Espresso-powered rollups
- Get detailed transaction information including confirmations, gas usage, and status
- Compare Espresso confirmation times vs. traditional chain confirmations

### 📋 Universal Transaction List

- View all transactions from multiple rollups in a single interface
- Filter by rollup, address, status, and more
- Sort and paginate through large transaction sets

### 🌉 Multi-Chain Bridge

- Transfer tokens between any Espresso-powered rollups
- Simple, user-friendly interface with built-in wallet connection
- Real-time fee estimates and confirmation status updates

### 📊 Rollup Leaderboard

- Compare performance metrics across different rollups
- Track TPS (transactions per second), block times, and gas costs
- See which rollups have the best Espresso confirmation advantage

### 📈 Comprehensive Metrics Dashboard

- View aggregated metrics across all Espresso rollups
- Monitor total transactions, confirmation times, and system health
- Track the time savings from Espresso's accelerated confirmations

### 👛 Multi-Chain Wallet

- Connect to any Espresso rollup with a single wallet interface
- Send transactions across any rollup without changing networks
- View balances and transaction history across all chains

### 🤝 Open Intents Contracts

- ERC-7683 based contracts from the Open Intents Framework
- Create and settle intents across all rollups
- Leverage the power of intent-based transactions for complex operations

## Project Structure

The EspressoHub project consists of several key components:

- **espresso-config**: Configuration files for Espresso rollups, Hyperlane integration, and RPC URLs
- **espresso-contracts**: Smart contracts implementing ERC-7683 Open Intents for cross-rollup operations
- **espressohub-frontend**: Next.js-based frontend application for user interaction
- **espressohub-solver**: Solver component for bridging between Espresso rollups
- **espressohub-tracker**: Transaction tracking and aggregation service for multiple rollups

## Quick Start

## Configuration

EspressoHub connects to multiple rollups using the configuration defined in `espresso-config`. The default configuration includes:

- **Rollup1**: Chain ID 123456789, RPC URL: http://34.45.3.213:8547
- **Rollup2**: Chain ID 1288752452, RPC URL: http://34.162.155.134:8547
- **Arbitrum Sepolia**: Used as a parent chain for some operations

Additional configuration can be found in the `core-config.yaml` and `warp-route-deployment.yaml` files.

## Deployed Contracts

EspressoHub interacts with various contracts deployed on each rollup. The key contract addresses can be found in the contract address tables for each rollup:

- Mailbox (Message relay system)
- InterchainAccountRouter (Cross-chain account management)
- Various ISM (Interchain Security Module) factories
# Rollup 1
RPC URL = http://34.45.3.213:8547

| Component                                  | Address                                      |
| ------------------------------------------ | -------------------------------------------- |
| staticMerkleRootMultisigIsmFactory         | `0x4A5a06A4f0A70FF95F1b87e92FFe4E95878c2C04` |
| staticMessageIdMultisigIsmFactory          | `0x55f91F97d40244D2CfD649a1C887b9723B99913F` |
| staticAggregationIsmFactory                | `0x81BB2ffCBE70096D1Da8aC504eAB92DF030F4b5F` |
| staticAggregationHookFactory               | `0x40f721a93CBd085d0507bc9D737ae9F46b424199` |
| domainRoutingIsmFactory                    | `0x77C99719bb3F86E7eA7e6Eb141eaBc50933A2662` |
| staticMerkleRootWeightedMultisigIsmFactory | `0xd15223159b2226a4A0e6c358b9c89dAED0b6d63b` |
| staticMessageIdWeightedMultisigIsmFactory  | `0xd2687b8218e0FC0495922e47b7FD76e104A833Fa` |
| proxyAdmin                                 | `0xE3b06240Eff0212905961eCfE2E8E105149634AD` |
| mailbox                                    | `0xDEca226751D08dd54fBF8b483BD8274421350CfF` |
| interchainAccountRouter                    | `0x7Dbe1F8cc6b030002DfE9f408c99dcABc98188Ba` |
| interchainAccountIsm                       | `0xA49BDD6db1b1215552211f2A0bC5C62024fe7998` |
| validatorAnnounce                          | `0x8aAC76746a61A8B3744f69970797395e997ae83c` |
| testRecipient                              | `0xCC22Ef9AB522a7f5f597e0407dD8834599B1a8E7` |
| merkleTreeHook                             | `0x262b311F33fF40B2c73C742c41F891f12ddA8958` |

# Rollup 2
RPC URL = http://34.162.155.134:8547

| Component                                  | Address                                      |
| ------------------------------------------ | -------------------------------------------- |
| staticMerkleRootMultisigIsmFactory         | `0xA96d10c71295Eb5f2BA918539b4ee22ACb9D894c` |
| staticMessageIdMultisigIsmFactory          | `0x3bc26A7378Ae7CAa2e21f7D556368c871Af970F6` |
| staticAggregationIsmFactory                | `0x39f223905768c19742036b3C6a6Dbf779953927E` |
| staticAggregationHookFactory               | `0xAF11839F66c0D522Faf39d6F3eE7A044c7BEDDe7` |
| domainRoutingIsmFactory                    | `0x737AAb795754881D0f5AB298cC68DA2daAA55aC7` |
| staticMerkleRootWeightedMultisigIsmFactory | `0x251B3F6bC2d0a3F4CC1853Df3e4A0f030E392698` |
| staticMessageIdWeightedMultisigIsmFactory  | `0xd8734181490E512717406b4842Fb7AdD701d5713` |
| proxyAdmin                                 | `0x2B0Ce96FA6B4213664Ee740435AA7Ec0FC0bd4e5` |
| mailbox                                    | `0x191AFEFF5201f1Bc7d982CA7477Be5d14F055544` |
| interchainAccountRouter                    | `0xdA3d1ecE6c0348FC4a5Ee15881E2F95Ee8a5DA55` |
| interchainAccountIsm                       | `0x4bDF5CCCe92291a2c2CEe8c506874759221f5fCA` |
| validatorAnnounce                          | `0x4A5a06A4f0A70FF95F1b87e92FFe4E95878c2C04` |
| testRecipient                              | `0x55f91F97d40244D2CfD649a1C887b9723B99913F` |
| merkleTreeHook                             | `0x0535D6FE2118E358B527211B26E78374DcFF50f0` |

# Arbitrum Sepolia

| Component                                  | Address                                      |
| ------------------------------------------ | -------------------------------------------- |
| staticMerkleRootMultisigIsmFactory         | `0x51f31d103571d40807110aD1B21fd76CEdB7A073` |
| staticMessageIdMultisigIsmFactory          | `0x0B408cccb2c32FeAE1ba669803BeB1E07AA19CA1` |
| staticAggregationIsmFactory                | `0xB0fD78e57d73E02ad456002A5990A62a41040eb7` |
| staticAggregationHookFactory               | `0x86e5c56df22b9de05200b3D30918771CB492B179` |
| domainRoutingIsmFactory                    | `0xE3a9D9Beac0E5ecfb8f99c6be60632d9Fb8846Eb` |
| staticMerkleRootWeightedMultisigIsmFactory | `0xd89FFbD23FF6e56DA88b57ca9a9ceC36B343B4dc` |
| staticMessageIdWeightedMultisigIsmFactory  | `0xe85Da70c1bcfc5866DEb1b169FCC7319Bc0c1065` |
| proxyAdmin                                 | `0x011D28B159C2D16338fec949ED14e09AdeaC6D2D` |
| mailbox                                    | `0xB733CafEDe04238AA10773Fd701cE021170dDa7E` |
| interchainAccountRouter                    | `0x9b8D106643152978e8cE387f206FA2b29987C771` |
| interchainAccountIsm                       | `0xfF46B6B9db593F3F8DfEaa78580B0CA452aaC533` |
| validatorAnnounce                          | `0xD515514B4bC452f32720D678A71706147D5f383B` |
| testRecipient                              | `0x512AB2936Ec466b67C120c1e5f2B937b2c1Db16d` |
| merkleTreeHook                             | `0x357Bc7F695f2E9E7681c49855884c5E28B5e7059` |

# core-config.yaml

```yaml
defaultHook:
  type: merkleTreeHook
defaultIsm:
  relayer: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  type: trustedRelayerIsm
owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
proxyAdmin:
  owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
requiredHook:
  beneficiary: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  maxProtocolFee: "100000000000000000"
  owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  protocolFee: "0"
  type: protocolFee
```

# warp-route-deployment.yaml

```yaml
arbitrumsepolia:
  interchainSecurityModule:
    modules:
      - relayer: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
        type: trustedRelayerIsm
      - domains: {}
        owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
        type: defaultFallbackRoutingIsm
    threshold: 1
    type: staticAggregationIsm
  isNft: false
  owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  proxyAdmin:
    address: "0x011D28B159C2D16338fec949ED14e09AdeaC6D2D"
    owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  type: native
rollup1:
  interchainSecurityModule:
    modules:
      - relayer: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
        type: trustedRelayerIsm
      - domains: {}
        owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
        type: defaultFallbackRoutingIsm
    threshold: 1
    type: staticAggregationIsm
  isNft: false
  owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  proxyAdmin:
    address: "0xE3b06240Eff0212905961eCfE2E8E105149634AD"
    owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  type: native
rollup2:
  interchainSecurityModule:
    modules:
      - relayer: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
        type: trustedRelayerIsm
      - domains: {}
        owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
        type: defaultFallbackRoutingIsm
    threshold: 1
    type: staticAggregationIsm
  isNft: false
  owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  proxyAdmin:
    address: "0x2B0Ce96FA6B4213664Ee740435AA7Ec0FC0bd4e5"
    owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  type: native
```


## Bridge Architecture

The EspressoHub bridge leverages Hyperlane's messaging infrastructure combined with Espresso's fast confirmation layer to provide:

1. Fast cross-rollup token transfers
2. Secure message passing between rollups
3. Intent-based transactions that can span multiple rollups

The bridge workflow:

1. User initiates a transfer on the source rollup
2. Transaction is quickly confirmed by Espresso
3. Message is relayed through Hyperlane's infrastructure
4. Corresponding action is executed on the destination rollup
5. User receives assets on the destination chain


## Acknowledgments

- Built for the Espresso Systems "Build & Brew" Hackathon
- Leverages Hyperlane for secure cross-chain messaging
- Implements ERC-7683 Open Intents framework
- Built on Next.js, Tailwind CSS, and wagmi/RainbowKit
