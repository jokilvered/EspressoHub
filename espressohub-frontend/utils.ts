import { AllTransactionsResponse, RollupResponse, TransactionResponse } from "@/types";


export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";


export async function fetchTransaction(
  txHash: string
): Promise<TransactionResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/status/${txHash}`);
    const data = await response.json();
    return data as TransactionResponse;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }
}

export async function fetchChains() {
  try {
    const response = await fetch(`${API_BASE_URL}/chains`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chains:", error);
    return {
      success: false,
      error: "Failed to fetch chain data",
    };
  }
}

export async function fetchLeaderboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/current`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return {
      success: false,
      error: "Failed to fetch leaderboard data",
    };
  }
}

export const fetchMetrics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/metrics`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return {
      success: false,
      error: "Failed to fetch metrics data",
    };
  }
};

export const fetchRollupInfo = async (chainId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rollup/${chainId}`);
    const result: RollupResponse = await response.json();

    return result;
  } catch (error) {
    console.error("Error fetching rollup info:", error);
    return {
      success: false,
      error: "Failed to fetch rollup info",
    };
  }
};

export const fetchTransactions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    const result = await response.json();
    return result as AllTransactionsResponse;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return {
      success: false,
      error: "Failed to fetch transactions data",
    };
  }
};
