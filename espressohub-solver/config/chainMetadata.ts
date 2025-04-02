import { z } from "zod";

import { chainMetadata as defaultChainMetadata } from "@hyperlane-xyz/registry";

import type { ChainMap, ChainMetadata } from "@hyperlane-xyz/sdk";
import { ChainMetadataSchema } from "@hyperlane-xyz/sdk";

import { objMerge } from "@hyperlane-xyz/utils";

// Added metadata for arbitrumsepolia, rollup1, and rollup2 based on the YAML examples
const customChainMetadata = {
  basesepolia: {
    rpcUrls: [
      {
        http: "https://base-sepolia-rpc.publicnode.com",
        pagination: {
          maxBlockRange: 3000,
        },
      },
    ],
  },
  arbitrumsepolia: {
    blockExplorers: [
      {
        apiKey: "SE4XBVZXEBTNBPBCYECM1IMEGHHVH1ZVII",
        apiUrl: "https://api-sepolia.arbiscan.io/api",
        family: "etherscan",
        name: "Arbiscan",
        url: "https://sepolia.arbiscan.io",
      },
    ],
    blocks: {
      confirmations: 1,
      estimateBlockTime: 3,
      reorgPeriod: 0,
    },
    chainId: 421614,
    deployer: {
      name: "Abacus Works",
      url: "https://www.hyperlane.xyz",
    },
    displayName: "Arbitrum Sepolia",
    domainId: 421614,
    gasCurrencyCoinGeckoId: "ethereum",
    index: {
      from: 49690504,
    },
    isTestnet: true,
    name: "arbitrumsepolia",
    nativeToken: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    protocol: "ethereum",
    rpcUrls: [
      { http: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public" },
      { http: "https://sepolia-rollup.arbitrum.io/rpc" },
    ],
    technicalStack: "arbitrumnitro",
  },
  rollup1: {
    chainId: 123456789,
    displayName: "Rollup1",
    domainId: 123456789,
    index: {
      from: 33,
    },
    isTestnet: true,
    name: "rollup1",
    nativeToken: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    protocol: "ethereum",
    rpcUrls: [{ http: "http://34.45.3.213:8547" }],
    technicalStack: "arbitrumnitro",
  },
  rollup2: {
    chainId: 1288752452,
    displayName: "Rollup2",
    domainId: 1288752452,
    index: {
      from: 16,
    },
    isTestnet: true,
    name: "rollup2",
    nativeToken: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    protocol: "ethereum",
    rpcUrls: [{ http: "http://34.162.155.134:8547" }],
    technicalStack: "arbitrumnitro",
  },
};

const chainMetadata = objMerge<ChainMap<ChainMetadata>>(
  defaultChainMetadata,
  customChainMetadata,
  10,
  true,
);

z.record(z.string(), ChainMetadataSchema).parse(chainMetadata);

export { chainMetadata };
