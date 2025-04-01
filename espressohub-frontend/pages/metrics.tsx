import { fetchMetrics, formatDuration } from '@/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
interface Metrics {
    totalTransactions: number;
    confirmedByEspresso: number;
    confirmedByChain: number;
    averageEspressoTimeMs: number;
    averageChainTimeMs: number;
    timesSaved: number;
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

interface MetricsResponse {
    success: boolean;
    data?: {
        metrics: Metrics;
        rollupInfos: RollupInfo[];
    };
    error?: string;
}

export default function MetricsDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<MetricsResponse['data'] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const metrics = fetchMetrics();

        metrics
            .then((response: MetricsResponse) => {
                if (response.success) {
                    setData(response.data);
                } else {
                    setError(response.error || 'Failed to load metrics data');
                }
            })
            .catch((err) => {
                setError('An error occurred while loading the metrics');
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6F4E37] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading metrics data...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="text-center py-8">
                    <svg className="mx-auto h-16 w-16 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Metrics</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    const { metrics, rollupInfos } = data;
    const formattedEspressoTime = formatDuration(metrics.averageEspressoTimeMs);
    const formattedChainTime = metrics.averageChainTimeMs ? formatDuration(metrics.averageChainTimeMs) : 'N/A';

    // Format gas price from wei to gwei
    const formatGasPrice = (weiPrice: string): string => {
        const gweiPrice = parseFloat(weiPrice) / 1e9;
        return `${gweiPrice} Gwei`;
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-[#A67C52] p-4 text-white">
                    <h2 className="text-xl font-semibold">Espresso Network Metrics Dashboard</h2>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Transaction Stats */}
                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-[#3A2D21] mb-2">Transaction Stats</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Transactions:</span>
                                    <span className="font-medium">{metrics.totalTransactions}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Confirmed by Espresso:</span>
                                    <span className="font-medium">{metrics.confirmedByEspresso}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Confirmed by Chain:</span>
                                    <span className="font-medium">{metrics.confirmedByChain}</span>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Times */}
                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-[#3A2D21] mb-2">Confirmation Times</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Avg. Espresso Time:</span>
                                    <span className="font-medium">{formattedEspressoTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Avg. Chain Time:</span>
                                    <span className="font-medium">{formattedChainTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Time Saved:</span>
                                    <span className="font-medium">{formatDuration(metrics.timesSaved)}</span>
                                </div>
                            </div>
                        </div>

                        {/* System Health */}
                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-[#3A2D21] mb-2">System Health</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tracking Rollups:</span>
                                    <span className="font-medium">{rollupInfos.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Connected to Espresso:</span>
                                    <span className="font-medium">{rollupInfos.filter(r => r.espressoConnected).length} / {rollupInfos.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Espresso Health:</span>
                                    <span className="font-medium text-green-500">Operational</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-[#3A2D21] mb-4">Rollup Information</h3>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rollup</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TPS</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block Height</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed Blocks</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block Time</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gas Price</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espresso</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rollupInfos.map((rollup) => (
                                    <tr key={rollup.chainId}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">            <Link href={`/rollup/${rollup.chainId}`} className="text-[#6F4E37] hover:text-[#3A2D21]">
                                                        {rollup.name}
                                                    </Link>
                                                    </div>
                                                    <div className="text-sm text-gray-500">ID: {rollup.chainId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{rollup.tps.toFixed(3)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{rollup.blockHeight}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{rollup.lastProcessedBlock}</div>
                                            {rollup.lastProcessedBlock < rollup.blockHeight && (
                                                <div className="text-xs text-amber-600">
                                                    {((rollup.lastProcessedBlock / rollup.blockHeight) * 100).toFixed(1)}% synced
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {rollup.transactionCount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{rollup.averageBlockTime}s</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatGasPrice(rollup.gasPrice)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rollup.espressoConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {rollup.espressoConnected ? 'Connected' : 'Disconnected'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/rollup/${rollup.chainId}`}
                                                className="text-[#6F4E37] hover:text-[#3A2D21]"
                                            >
                                                View Details →
                                            </Link>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Visual Comparison Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-[#A67C52] p-4 text-white">
                    <h2 className="text-xl font-semibold">Confirmation Comparison</h2>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Espresso vs Chain Confirmation */}
                        <div>
                            <h3 className="text-lg font-semibold text-[#3A2D21] mb-4">Confirmation Time Comparison</h3>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                            Espresso
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-green-600">
                                            {formattedEspressoTime}
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                                    <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                </div>
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                            Chain
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-blue-600">
                                            {formattedChainTime}
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                    <div style={{ width: metrics.averageChainTimeMs ? `${Math.min(100, (metrics.averageChainTimeMs / metrics.averageEspressoTimeMs) * 100)}%` : "0%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                {metrics.averageChainTimeMs > 0 ? (
                                    <>Espresso confirmations are {(metrics.averageChainTimeMs / metrics.averageEspressoTimeMs).toFixed(1)}x faster than traditional chain confirmations.</>
                                ) : (
                                    <>No chain confirmations recorded yet. Espresso confirmations are working properly.</>
                                )}
                            </p>
                        </div>

                        {/* Transaction Status */}
                        <div>
                            <h3 className="text-lg font-semibold text-[#3A2D21] mb-4">Transaction Status</h3>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                            Espresso Confirmed
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-green-600">
                                            {metrics.confirmedByEspresso} / {metrics.totalTransactions}
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                                    <div style={{ width: `${(metrics.confirmedByEspresso / Math.max(1, metrics.totalTransactions)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                </div>
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                            Chain Confirmed
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-blue-600">
                                            {metrics.confirmedByChain} / {metrics.totalTransactions}
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                    <div style={{ width: `${(metrics.confirmedByChain / Math.max(1, metrics.totalTransactions)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                {metrics.confirmedByEspresso > 0 && metrics.confirmedByChain === 0 ? (
                                    <>All transactions have been confirmed by Espresso, demonstrating the speed advantage of the Espresso network.</>
                                ) : metrics.confirmedByChain > 0 ? (
                                    <>{(metrics.confirmedByChain / metrics.totalTransactions * 100).toFixed(1)}% of transactions have reached full chain confirmation.</>
                                ) : (
                                    <>No transactions have reached chain confirmation yet.</>
                                )}
                            </p>
                        </div>
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