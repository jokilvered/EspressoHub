import { Transaction } from "@/types";
import { formatTimestamp } from "@/utils";
import Link from "next/link";

interface TransactionDetailsProps {
    transaction: Transaction;
}

export default function TransactionDetails({ transaction }: TransactionDetailsProps) {
    const statusColors = {
        finalized: 'bg-green-100 text-green-800',
        confirmed: 'bg-yellow-100 text-yellow-800',
        pending: 'bg-gray-100 text-gray-800'
    };

    return (
        <div className="bg-[#FFF8E1] rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#3A2D21]">Transaction Details</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[transaction.status]}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">Transaction Hash</p>
                    <p className="font-mono text-sm break-all">{transaction.txHash}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Rollup Chain</p>
                    <p className="font-medium">    <Link href={`/rollup/${transaction.chainId}`} className="text-[#6F4E37] hover:text-[#3A2D21]">
                        {transaction.chainName} (#{transaction.chainId})
                    </Link>
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Block</p>
                    <p className="font-medium">#{transaction.blockNumber}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Timestamp</p>
                    <p className="font-medium">{transaction.blockTimestamp ? formatTimestamp(transaction.blockTimestamp) : 'N/A'}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-mono text-sm break-all">{transaction.from}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-mono text-sm break-all">{transaction.to}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Value</p>
                    <p className="font-medium">{transaction.formattedValue}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Gas</p>
                    <p className="font-medium">{transaction.formattedGasUsed} ({transaction.formattedGasPrice})</p>
                </div>
            </div>
        </div>
    );
}

