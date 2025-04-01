export interface Transaction {
  txHash: string;
  chainName: string;
  chainId: number;
  blockNumber?: number;
  blockTimestamp?: number;
  from?: string;
  to?: string;
  value?: string;
  gasUsed?: string;
  gasPrice?: string;
  method?: string;
  status: "pending" | "confirmed" | "finalized";
  espressoConfirmed: boolean;
  chainConfirmed: boolean;
  trackingStarted: string;
  lastUpdated: string;
  confirmations?: number;
  espressoTime?: string;
  chainTime?: string;
  formattedValue: string;
  formattedGasUsed: string;
  formattedGasPrice: string;
  espressoConfirmationDuration?: number;
  chainConfirmationDuration?: number | null;
}

export interface RollupInfo {
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

export interface TransactionResponse {
  success: boolean;
  data?: {
    transaction: Transaction;
    rollupInfo: RollupInfo;
  };
  error?: string;
}

export interface AllTransactionsResponse {
  success: boolean;
  data?: Transaction[];
  error?: string;
}

export interface RollupResponse {
  success: boolean;
  data?: RollupInfo;
  error?: string;
}
