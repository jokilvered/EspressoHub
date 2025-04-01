import { fetchLeaderboard } from '@/utils';
import { useEffect, useState } from 'react';

interface LeaderboardData {
    chainId: number;
    name: string;
    transactionCount: number;
    tps: number;
    avgEspressoConfirmationTimeMs: number;
    avgChainConfirmationTimeMs: number;
    gasPrice: string;
    blockHeight: number;
    contractDeployments: number;
    espressoTimeAdvantageMs: number;
}

export default function Leaderboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                const response = await fetchLeaderboard();
                if (response.success) {
                    setLeaderboardData(response.data);
                } else {
                    setError(response.error || 'Failed to load leaderboard data');
                }
            } catch (err) {
                setError('An error occurred while loading the leaderboard');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadLeaderboard();
    }, []);

    if (isLoading) {
        return (
            <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6F4E37] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading leaderboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="text-center py-8">
                    <svg className="mx-auto h-16 w-16 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Leaderboard</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-[#A67C52] p-4 text-white">
                <h2 className="text-xl font-semibold">Rollup Leaderboard</h2>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rollup
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transactions
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    TPS
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Block Height
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Espresso Advantage
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leaderboardData.map((rollup) => (
                                <tr key={rollup.chainId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {rollup.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {rollup.transactionCount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {rollup.tps.toFixed(3)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {rollup.blockHeight.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {rollup.espressoTimeAdvantageMs > 0 ? (
                                            <span className="text-green-600">{(rollup.espressoTimeAdvantageMs / 1000).toFixed(2)}s</span>
                                        ) : (
                                            <span className="text-yellow-600">No advantage yet</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
