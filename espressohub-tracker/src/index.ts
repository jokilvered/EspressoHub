import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { ethers } from "ethers";

// Configuration
const config = {
  pollingIntervalMs: 5000,
  confirmationThreshold: 12,
  blockHistoryDepth: 10, // How many blocks to look back when starting
  chains: [
    {
      name: "Rollup1",
      nodeUrl: "http://34.45.3.213:8547",
      chainId: 123456789,
      isEspressoChain: true,
      caffNodeUrl: "http://34.45.3.213:8550",
    },
    {
      name: "Rollup2",
      nodeUrl: "http://34.162.155.134:8547",
      chainId: 1288752452,
      isEspressoChain: true,
      caffNodeUrl: "http://34.162.155.134:8550",
    },
  ],
};

// Types
interface TrackedTransaction {
  txHash: string;
  chainName: string;
  chainId: number;
  blockNumber?: number;
  blockTimestamp?: number;
  confirmations?: number;
  from?: string;
  to?: string;
  value?: string;
  gasUsed?: string;
  gasPrice?: string;
  method?: string;
  status?: string;
  espressoConfirmed: boolean;
  chainConfirmed: boolean;
  espressoTime?: Date;
  chainTime?: Date;
  timeDifferenceMs?: number;
  trackingStarted: Date;
  lastUpdated: Date;
}

interface RollupInfo {
  chainId: number;
  name: string;
  tps: number;
  gasPrice: string;
  blockHeight: number;
  transactionCount: number;
  espressoConnected: boolean;
  lastEspressoBlockHeight?: number;
  averageBlockTime: number;
  lastProcessedBlock: number;
}

interface RollupMetricsSnapshot {
  timestamp: Date;
  chainId: number;
  name: string;
  transactionCount: number;
  tps: number;
  avgEspressoConfirmationTimeMs: number;
  avgChainConfirmationTimeMs: number;
  gasPrice: string;
  blockHeight: number;
  contractDeployments: number;
}

// Add this with your other storage maps
const metricsHistory: Map<number, RollupMetricsSnapshot[]> = new Map();

// In-memory storage
const transactions: Map<string, TrackedTransaction> = new Map();
const rollupInfoCache: Map<number, RollupInfo> = new Map();
// Track the last processed block for each chain
const lastProcessedBlocks: Map<string, number> = new Map();

// Providers
const chainProviders: Map<string, ethers.JsonRpcProvider> = new Map();
const caffProviders: Map<string, ethers.JsonRpcProvider> = new Map();

// Initialize providers
config.chains.forEach((chain) => {
  chainProviders.set(chain.name, new ethers.JsonRpcProvider(chain.nodeUrl));
  lastProcessedBlocks.set(chain.name, 0); // Initialize with 0, will be updated on first run

  if (chain.isEspressoChain && chain.caffNodeUrl) {
    caffProviders.set(
      chain.name,
      new ethers.JsonRpcProvider(chain.caffNodeUrl)
    );
  }
});

// Process transactions in a block
async function processBlock(
  chainName: string,
  blockNumber: number
): Promise<void> {
  try {
    const provider = chainProviders.get(chainName);
    if (!provider) {
      throw new Error(`Provider not found for chain: ${chainName}`);
    }

    const block = await provider.getBlock(blockNumber, true);
    if (!block) {
      console.error(`Block ${blockNumber} not found on chain ${chainName}`);
      return;
    }

    console.log(
      `Processing block ${blockNumber} on ${chainName}, found ${block.transactions.length} transactions`
    );

    // Process each transaction in the block
    for (const txHash of block.transactions) {
      // Skip if already tracked
      if (transactions.has(txHash.toString())) {
        continue;
      }

      await trackTransaction(txHash.toString(), chainName);
    }

    // Update the last processed block
    lastProcessedBlocks.set(chainName, blockNumber);
  } catch (error) {
    console.error(
      `Error processing block ${blockNumber} on ${chainName}:`,
      error
    );
  }
}

// New function to listen for new blocks and transactions
async function listenForNewTransactions(): Promise<void> {
  for (const [chainName, provider] of chainProviders) {
    try {
      // Get the current block number
      const currentBlockNumber = await provider.getBlockNumber();
      let lastProcessedBlock = lastProcessedBlocks.get(chainName) || 0;

      // If this is the first time, start from a few blocks back
      if (lastProcessedBlock === 0) {
        lastProcessedBlock = Math.max(
          0,
          currentBlockNumber - config.blockHistoryDepth
        );
        lastProcessedBlocks.set(chainName, lastProcessedBlock);
      }

      // Process new blocks
      for (let i = lastProcessedBlock + 1; i <= currentBlockNumber; i++) {
        await processBlock(chainName, i);
      }

      // Update rollup info cache
      const chain = config.chains.find((c) => c.name === chainName);
      if (chain) {
        await getRollupInfo(chain.chainId);
      }
    } catch (error) {
      console.error(
        `Error listening for new transactions on ${chainName}:`,
        error
      );
    }
  }
}

// Tracker service functions
async function trackTransaction(
  txHash: string,
  chainName: string
): Promise<boolean> {
  try {
    const chain = config.chains.find((c) => c.name === chainName);
    if (!chain) {
      throw new Error(`Chain not found: ${chainName}`);
    }

    const provider = chainProviders.get(chainName);
    if (!provider) {
      throw new Error(`Provider not found for chain: ${chainName}`);
    }

    // Get transaction details
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      throw new Error(`Transaction not found: ${txHash}`);
    }

    console.log(`Found transaction ${txHash} on ${chainName}`);

    // Get transaction receipt for additional details
    const receipt = await provider.getTransactionReceipt(txHash);

    // Get block data to get timestamp
    const block = tx.blockNumber
      ? await provider.getBlock(tx.blockNumber)
      : null;

    // Try to determine method name from transaction data
    let method = "Unknown Method";
    if (tx.data && tx.data.length >= 10) {
      const methodId = tx.data.slice(0, 10);
      // In a real app, you'd have a method signature database or use a service like Etherscan API
      method = methodId === "0xa9059cbb" ? "transfer" : methodId;
    }

    // Create tracked transaction with detailed info
    const trackedTx: TrackedTransaction = {
      txHash,
      chainName,
      chainId: chain.chainId,
      blockNumber: tx.blockNumber ? Number(tx.blockNumber) : undefined,
      blockTimestamp: block?.timestamp ? Number(block.timestamp) : undefined,
      from: tx.from,
      to: tx.to || "Contract Creation",
      value: tx.value.toString(),
      gasUsed: receipt?.gasUsed?.toString(),
      gasPrice: receipt?.gasPrice?.toString(),
      method,
      status: receipt?.status
        ? Number(receipt.status) === 1
          ? "Success"
          : "Failed"
        : "Pending",
      espressoConfirmed: false,
      chainConfirmed: false,
      trackingStarted: new Date(),
      lastUpdated: new Date(),
    };

    // Check initial confirmation status
    if (receipt && tx.blockNumber) {
      const currentBlock = await provider.getBlockNumber();
      const confirmations = currentBlock - Number(tx.blockNumber);
      trackedTx.confirmations = confirmations;

      if (confirmations >= config.confirmationThreshold) {
        trackedTx.chainConfirmed = true;
        trackedTx.chainTime = new Date();
      }
    }

    // Store the transaction
    transactions.set(txHash, trackedTx);

    // Check for Espresso confirmation immediately
    await checkEspressoConfirmation(trackedTx);

    return true;
  } catch (error) {
    console.error("Error tracking transaction:", error);
    return false;
  }
}

async function checkConfirmations(): Promise<void> {
  for (const [txHash, tx] of transactions.entries()) {
    // Skip if already fully confirmed
    if (tx.espressoConfirmed && tx.chainConfirmed) {
      continue;
    }

    try {
      // Check chain confirmation
      if (!tx.chainConfirmed) {
        await checkChainConfirmation(tx);
      }

      // Check Espresso confirmation
      if (!tx.espressoConfirmed) {
        await checkEspressoConfirmation(tx);
      }
    } catch (error) {
      console.error(`Error checking confirmations for ${txHash}:`, error);
    }
  }
}

async function checkChainConfirmation(tx: TrackedTransaction): Promise<void> {
  const provider = chainProviders.get(tx.chainName);
  if (!provider || !tx.blockNumber) {
    return;
  }

  try {
    // Get current block number
    const currentBlock = await provider.getBlockNumber();

    // Calculate confirmations
    const confirmations = currentBlock - tx.blockNumber;

    // Update transaction
    tx.confirmations = confirmations;

    // Check if confirmation threshold reached
    if (confirmations >= config.confirmationThreshold && !tx.chainConfirmed) {
      tx.chainConfirmed = true;
      tx.chainTime = new Date();

      // Calculate time difference if both are confirmed
      if (tx.espressoConfirmed && tx.espressoTime) {
        tx.timeDifferenceMs =
          tx.chainTime.getTime() - tx.espressoTime.getTime();
      }
    }

    tx.lastUpdated = new Date();
  } catch (error) {
    console.error(`Error checking chain confirmation: ${error}`);
  }
}

async function checkEspressoConfirmation(
  tx: TrackedTransaction
): Promise<void> {
  const chain = config.chains.find((c) => c.name === tx.chainName);

  // Skip if not an Espresso chain
  if (!chain?.isEspressoChain) {
    return;
  }

  const caffProvider = caffProviders.get(tx.chainName);
  if (!caffProvider) {
    return;
  }

  try {
    // Get receipt from caff node
    const receipt = await caffProvider.getTransactionReceipt(tx.txHash);

    if (receipt) {
      // Transaction is confirmed by Espresso
      tx.espressoConfirmed = true;
      tx.espressoTime = new Date();

      // Calculate time difference if both are confirmed
      if (tx.chainConfirmed && tx.chainTime) {
        tx.timeDifferenceMs =
          tx.chainTime.getTime() - tx.espressoTime.getTime();
      }

      tx.lastUpdated = new Date();
    }
  } catch (error) {
    console.error(
      `Error checking Espresso confirmation for ${tx.txHash}:`,
      error
    );
  }
}

async function getRollupInfo(chainId: number): Promise<RollupInfo | null> {
  try {
    const chain = config.chains.find((c) => c.chainId === chainId);
    if (!chain) {
      throw new Error(`Chain not found with ID: ${chainId}`);
    }

    const provider = chainProviders.get(chain.name);
    if (!provider) {
      throw new Error(`Provider not found for chain: ${chain.name}`);
    }

    // Get current block number
    const blockNumber = await provider.getBlockNumber();
    const lastProcessedBlock = lastProcessedBlocks.get(chain.name) || 0;

    // Get last few blocks to calculate average block time and TPS
    const latestBlock = await provider.getBlock(blockNumber);
    const oldBlock = await provider.getBlock(Math.max(0, blockNumber - 10));

    if (!latestBlock || !oldBlock) {
      throw new Error("Failed to fetch blocks");
    }

    // Calculate metrics
    const blockTimeMs =
      latestBlock.timestamp && oldBlock.timestamp
        ? ((Number(latestBlock.timestamp) - Number(oldBlock.timestamp)) *
            1000) /
          (blockNumber - oldBlock.number)
        : 0;

    // Get Espresso connection status
    let espressoConnected = false;
    let lastEspressoBlockHeight;

    if (chain.isEspressoChain && chain.caffNodeUrl) {
      try {
        const caffProvider = caffProviders.get(chain.name);
        if (caffProvider) {
          const caffBlockNumber = await caffProvider.getBlockNumber();
          espressoConnected = true;
          lastEspressoBlockHeight = caffBlockNumber;
        }
      } catch (error) {
        console.error("Error checking Espresso connection:", error);
        espressoConnected = false;
      }
    }

    // Create rollup info with lastProcessedBlock
    const rollupInfo: RollupInfo = {
      chainId: chain.chainId,
      name: chain.name,
      tps: blockTimeMs > 0 ? 10 / (blockTimeMs / 1000) : 0, // Estimated TPS based on recent blocks
      gasPrice: latestBlock.baseFeePerGas?.toString() || "N/A",
      blockHeight: blockNumber,
      transactionCount: latestBlock.transactions.length,
      espressoConnected,
      lastEspressoBlockHeight,
      averageBlockTime: blockTimeMs / 1000, // in seconds
      lastProcessedBlock,
    };

    // Cache the result
    rollupInfoCache.set(chainId, rollupInfo);

    return rollupInfo;
  } catch (error) {
    console.error(`Error getting rollup info: ${error}`);
    return null;
  }
}

function determineTransactionStatus(
  tx: TrackedTransaction
): "pending" | "confirmed" | "finalized" {
  if (tx.espressoConfirmed && tx.chainConfirmed) {
    return "finalized";
  } else if (tx.espressoConfirmed) {
    return "confirmed";
  } else {
    return "pending";
  }
}

// Add function to find a transaction across all chains
async function findTransaction(
  txHash: string
): Promise<TrackedTransaction | null> {
  // First check if it's already in memory
  if (transactions.has(txHash)) {
    return transactions.get(txHash) || null;
  }

  // If not found in memory, try to find it on any chain
  for (const chain of config.chains) {
    try {
      const provider = chainProviders.get(chain.name);
      if (!provider) continue;

      const tx = await provider.getTransaction(txHash);
      if (tx) {
        // Found it, track it
        await trackTransaction(txHash, chain.name);
        return transactions.get(txHash) || null;
      }
    } catch (error) {
      console.error(
        `Error searching for transaction ${txHash} on ${chain.name}:`,
        error
      );
    }
  }

  return null;
}

let pollingInterval: number | Timer | null | undefined = null;

function startTracking(): void {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }

  pollingInterval = setInterval(async () => {
    // First listen for new transactions
    await listenForNewTransactions();

    // Then check confirmations for tracked transactions
    await checkConfirmations();

    // Take metrics snapshot every 5 minutes (60 polling intervals assuming 5s polling)
    let snapshotCounter = 0;
    if (++snapshotCounter >= 10) {
      await takeMetricsSnapshot();
      snapshotCounter = 0;
    }
  }, config.pollingIntervalMs);

  console.log(
    `🦊 Started tracking with interval ${config.pollingIntervalMs}ms`
  );
}

function calculateAvgConfirmationTime(
  transactions: TrackedTransaction[],
  confirmationType: "espresso" | "chain"
): number {
  const relevantTxs = transactions.filter((tx) =>
    confirmationType === "espresso"
      ? tx.espressoConfirmed && tx.blockTimestamp && tx.espressoTime
      : tx.chainConfirmed && tx.blockTimestamp && tx.chainTime
  );

  if (relevantTxs.length === 0) return 0;

  const totalTime = relevantTxs.reduce((sum, tx) => {
    const confirmTime =
      confirmationType === "espresso"
        ? tx.espressoTime!.getTime() - tx.blockTimestamp! * 1000
        : tx.chainTime!.getTime() - tx.blockTimestamp! * 1000;
    return sum + confirmTime;
  }, 0);

  return totalTime / relevantTxs.length;
}

function countContractDeployments(transactions: TrackedTransaction[]): number {
  return transactions.filter((tx) => tx.to === "Contract Creation").length;
}

async function takeMetricsSnapshot(): Promise<void> {
  for (const chain of config.chains) {
    try {
      const rollupInfo = await getRollupInfo(chain.chainId);
      if (!rollupInfo) continue;

      const chainTransactions = Array.from(transactions.values()).filter(
        (tx) => tx.chainId === chain.chainId
      );

      const snapshot: RollupMetricsSnapshot = {
        timestamp: new Date(),
        chainId: chain.chainId,
        name: chain.name,
        transactionCount: chainTransactions.length,
        tps: rollupInfo.tps,
        avgEspressoConfirmationTimeMs: calculateAvgConfirmationTime(
          chainTransactions,
          "espresso"
        ),
        avgChainConfirmationTimeMs: calculateAvgConfirmationTime(
          chainTransactions,
          "chain"
        ),
        gasPrice: rollupInfo.gasPrice,
        blockHeight: rollupInfo.blockHeight,
        contractDeployments: countContractDeployments(chainTransactions),
      };

      // Store the snapshot
      if (!metricsHistory.has(chain.chainId)) {
        metricsHistory.set(chain.chainId, []);
      }

      const chainHistory = metricsHistory.get(chain.chainId)!;
      chainHistory.push(snapshot);

      // Limit history size (keep last 24 hours assuming 5-minute snapshots)
      if (chainHistory.length > 288) {
        chainHistory.shift();
      }
    } catch (error) {
      console.error(
        `Error taking metrics snapshot for chain ${chain.name}:`,
        error
      );
    }
  }
}

// API
const app = new Elysia()
  .use(cors())

  // API routes
  .group("/api", (app) =>
    app
      // Get transaction details with comprehensive information
      .get("/status/:txHash", async ({ params }) => {
        const { txHash } = params;

        // Try to find the transaction if not already tracked
        let tx = await findTransaction(txHash);

        if (!tx) {
          return {
            success: false,
            error: "Transaction not found on any chain",
          };
        }

        // Get rollup info
        let rollupInfo = null;
        try {
          rollupInfo = await getRollupInfo(tx.chainId);
        } catch (error) {
          console.error(`Error fetching rollup info: ${error}`);
        }

        return {
          success: true,
          data: {
            transaction: {
              ...tx,
              status: determineTransactionStatus(tx),
              // Format values for display
              formattedValue: tx.value
                ? ethers.formatEther(tx.value) + " ETH"
                : "0 ETH",
              formattedGasUsed: tx.gasUsed || "N/A",
              formattedGasPrice: tx.gasPrice
                ? ethers.formatUnits(tx.gasPrice, "gwei") + " Gwei"
                : "N/A",
              // Calculate confirmation metrics
              confirmationLatencyMs: tx.timeDifferenceMs,
              espressoConfirmationDuration:
                tx.espressoTime && tx.blockTimestamp
                  ? tx.espressoTime.getTime() - tx.blockTimestamp * 1000
                  : null,
              chainConfirmationDuration:
                tx.chainTime && tx.blockTimestamp
                  ? tx.chainTime.getTime() - tx.blockTimestamp * 1000
                  : null,
            },
            rollupInfo,
          },
        };
      })

      // Get rollup information
      .get("/rollup/:chainId", async ({ params }) => {
        const chainId = Number(params.chainId);

        if (isNaN(chainId)) {
          return {
            success: false,
            error: "Invalid chain ID",
          };
        }

        const rollupInfo = await getRollupInfo(chainId);

        if (!rollupInfo) {
          return {
            success: false,
            error: "Rollup information not found",
          };
        }

        return {
          success: true,
          data: rollupInfo,
        };
      })

      // Get all tracked transactions
      .get("/transactions", () => {
        const allTransactions = Array.from(transactions.values()).map((tx) => ({
          ...tx,
          status: determineTransactionStatus(tx),
        }));

        return {
          success: true,
          data: allTransactions,
        };
      })

      // Get available chains
      .get("/chains", () => {
        return {
          success: true,
          data: config.chains,
        };
      })

      // Get cross-chain metrics (for dashboard)
      .get("/metrics", async () => {
        const metrics = {
          totalTransactions: transactions.size,
          confirmedByEspresso: 0,
          confirmedByChain: 0,
          averageEspressoTimeMs: 0,
          averageChainTimeMs: 0,
          timesSaved: 0,
        };

        let espressoConfirmationTimes = [];
        let chainConfirmationTimes = [];

        // Calculate metrics
        for (const tx of transactions.values()) {
          if (tx.espressoConfirmed) {
            metrics.confirmedByEspresso++;
            if (tx.espressoTime && tx.blockTimestamp) {
              espressoConfirmationTimes.push(
                tx.espressoTime.getTime() - tx.blockTimestamp * 1000
              );
            }
          }

          if (tx.chainConfirmed) {
            metrics.confirmedByChain++;
            if (tx.chainTime && tx.blockTimestamp) {
              chainConfirmationTimes.push(
                tx.chainTime.getTime() - tx.blockTimestamp * 1000
              );
            }
          }

          if (tx.timeDifferenceMs && tx.timeDifferenceMs > 0) {
            metrics.timesSaved += tx.timeDifferenceMs;
          }
        }

        // Calculate averages
        if (espressoConfirmationTimes.length > 0) {
          metrics.averageEspressoTimeMs =
            espressoConfirmationTimes.reduce((sum, time) => sum + time, 0) /
            espressoConfirmationTimes.length;
        }

        if (chainConfirmationTimes.length > 0) {
          metrics.averageChainTimeMs =
            chainConfirmationTimes.reduce((sum, time) => sum + time, 0) /
            chainConfirmationTimes.length;
        }

        // Get rollup info for all chains
        const rollupInfos = await Promise.all(
          config.chains.map(async (chain) => await getRollupInfo(chain.chainId))
        );

        return {
          success: true,
          data: {
            metrics,
            rollupInfos: rollupInfos.filter(Boolean),
          },
        };
      })
      // Add these inside your API group
      .get("/leaderboard/current", async () => {
        const leaderboardData = [];

        for (const chain of config.chains) {
          try {
            const rollupInfo = await getRollupInfo(chain.chainId);
            if (!rollupInfo) continue;

            const chainTransactions = Array.from(transactions.values()).filter(
              (tx) => tx.chainId === chain.chainId
            );

            leaderboardData.push({
              chainId: chain.chainId,
              name: chain.name,
              transactionCount: chainTransactions.length,
              tps: rollupInfo.tps,
              avgEspressoConfirmationTimeMs: calculateAvgConfirmationTime(
                chainTransactions,
                "espresso"
              ),
              avgChainConfirmationTimeMs: calculateAvgConfirmationTime(
                chainTransactions,
                "chain"
              ),
              gasPrice: rollupInfo.gasPrice,
              blockHeight: rollupInfo.blockHeight,
              contractDeployments: countContractDeployments(chainTransactions),
              espressoTimeAdvantageMs:
                calculateAvgConfirmationTime(chainTransactions, "chain") -
                calculateAvgConfirmationTime(chainTransactions, "espresso"),
            });
          } catch (error) {
            console.error(
              `Error generating leaderboard data for chain ${chain.name}:`,
              error
            );
          }
        }

        // Sort by transaction count (descending)
        leaderboardData.sort((a, b) => b.transactionCount - a.transactionCount);

        return {
          success: true,
          data: leaderboardData,
        };
      })

      .get("/leaderboard/history/:chainId", ({ params }) => {
        const chainId = Number(params.chainId);

        if (isNaN(chainId)) {
          return {
            success: false,
            error: "Invalid chain ID",
          };
        }

        const history = metricsHistory.get(chainId) || [];

        return {
          success: true,
          data: history,
        };
      })

      .get("/leaderboard/history", () => {
        const historyData: Record<number, RollupMetricsSnapshot[]> = {};

        for (const [chainId, snapshots] of metricsHistory.entries()) {
          historyData[chainId] = snapshots;
        }

        return {
          success: true,
          data: historyData,
        };
      })
  )

  .listen(3000);

// Start the tracker
startTracking();

console.log(
  `🦊 Espresso Confirmation Tracker API is running at ${app.server?.hostname}:${app.server?.port}`
);
