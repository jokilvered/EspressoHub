import { RollupInfo } from "@/types";
import { fetchRollupInfo } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RollupDetailPage() {
    const router = useRouter();
    const { chainId } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [rollupInfo, setRollupInfo] = useState<RollupInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

    useEffect(() => {

        fetchRollupInfo(
            chainId as string
        ).then((response) => {
            if (response.success) {
                setRollupInfo(response.data!);
            } else {
                setError(response.error || 'Failed to load rollup data');
            }
        }
        ).catch((err) => {
            setError('An error occurred while loading the rollup data');
            console.error(err);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [chainId]);

    // Format gas price from wei to gwei
    const formatGasPrice = (weiPrice?: string): string => {
        if (!weiPrice) return 'N/A';
        const gweiPrice = parseFloat(weiPrice) / 1e9;
        return `${gweiPrice} Gwei`;
    };

    if (isLoading) {
        return (
            <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6F4E37] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading rollup data...</p>
            </div>
        );
    }

    if (error || !rollupInfo) {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="text-center py-8">
                    <svg className="mx-auto h-16 w-16 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Rollup</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                    <div className="mt-6">
                        <Link
                            href="/metrics"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6F4E37] hover:bg-[#3A2D21]"
                        >
                            Return to Metrics
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Back link */}
            <div className="mb-4">
                <Link
                    href="/metrics"
                    className="inline-flex items-center text-[#6F4E37] hover:text-[#3A2D21]"
                >
                    <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Metrics
                </Link>
            </div>

            {/* Rollup Header */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-[#A67C52] p-4 text-white">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{rollupInfo.name} Details</h2>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${rollupInfo.espressoConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {rollupInfo.espressoConnected ? 'Espresso Connected' : 'Espresso Disconnected'}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    {/* Rollup ID and Basic Info */}
                    <div className="mb-8">
                        <div className="text-sm text-gray-500">Chain ID</div>
                        <div className="text-xl font-semibold">{rollupInfo.chainId}</div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-sm font-medium text-gray-500">Transactions Per Second</h3>
                            <p className="mt-1 text-2xl font-semibold text-[#3A2D21]">{rollupInfo.tps.toFixed(3)}</p>
                        </div>

                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-sm font-medium text-gray-500">Current Block Height</h3>
                            <p className="mt-1 text-2xl font-semibold text-[#3A2D21]">{rollupInfo.blockHeight}</p>
                            {rollupInfo.lastEspressoBlockHeight && (
                                <p className="text-xs text-gray-500">
                                    Espresso Height: {rollupInfo.lastEspressoBlockHeight}
                                </p>
                            )}
                        </div>

                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-sm font-medium text-gray-500">Average Block Time</h3>
                            <p className="mt-1 text-2xl font-semibold text-[#3A2D21]">{rollupInfo.averageBlockTime}s</p>
                        </div>

                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-sm font-medium text-gray-500">Gas Price</h3>
                            <p className="mt-1 text-2xl font-semibold text-[#3A2D21]">{formatGasPrice(rollupInfo.gasPrice)}</p>
                        </div>
                    </div>

                    {/* Detailed Stats */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-[#3A2D21] mb-4">Rollup Statistics</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Total Transactions:</span>
                                    <span className="font-medium">{rollupInfo.transactionCount}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Last Processed Block:</span>
                                    <span className="font-medium">{rollupInfo.lastProcessedBlock}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Sync Status:</span>
                                    <span className="font-medium">
                                        {rollupInfo.lastProcessedBlock >= rollupInfo.blockHeight ? (
                                            <span className="text-green-600">Fully Synced</span>
                                        ) : (
                                            <span className="text-amber-600">
                                                {((rollupInfo.lastProcessedBlock / rollupInfo.blockHeight) * 100).toFixed(1)}% Synced
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Espresso Status:</span>
                                    <span className={`font-medium ${rollupInfo.espressoConnected ? 'text-green-600' : 'text-red-600'}`}>
                                        {rollupInfo.espressoConnected ? 'Connected' : 'Disconnected'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Espresso Block Height:</span>
                                    <span className="font-medium">{rollupInfo.lastEspressoBlockHeight || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Update Frequency:</span>
                                    <span className="font-medium">{rollupInfo.averageBlockTime > 0 ? `Every ${rollupInfo.averageBlockTime}s` : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#3A2D21] mb-4">Recent Transactions</h3>

                        {recentTransactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Transaction Hash
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Block
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                From
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                To
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentTransactions.map((tx) => (
                                            <tr key={tx.txHash}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link href={`/transaction/${tx.txHash}`} className="text-[#6F4E37] hover:text-[#3A2D21]">
                                                        {tx.txHash.substring(0, 10)}...{tx.txHash.substring(tx.txHash.length - 8)}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {tx.blockNumber}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {tx.from ? (
                                                        <>
                                                            {tx.from.substring(0, 6)}...{tx.from.substring(tx.from.length - 4)}
                                                        </>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {tx.to ? (
                                                        <>
                                                            {tx.to.substring(0, 6)}...{tx.to.substring(tx.to.length - 4)}
                                                        </>
                                                    ) : 'Contract Creation'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.status === 'finalized' ? 'bg-green-100 text-green-800' :
                                                        tx.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent transactions</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No transactions have been processed for this rollup yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Updated at timestamp */}
            <div className="text-center text-sm text-gray-500 mt-4 mb-8">
                Data updated at {new Date().toLocaleString()}
            </div>
        </div>
    );
}
