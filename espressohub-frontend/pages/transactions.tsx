import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchTransactions, formatTimestamp } from '@/utils';

interface Transaction {
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
    status: 'pending' | 'confirmed' | 'finalized';
    espressoConfirmed: boolean;
    chainConfirmed: boolean;
    trackingStarted: string;
    lastUpdated: string;
    confirmations?: number;
    espressoTime?: string;
}

interface TransactionsResponse {
    success: boolean;
    data?: Transaction[];
    error?: string;
}

export default function TransactionsListPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [chainFilter, setChainFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const transactionsPerPage = 10;

    useEffect(() => {
        const loadTransactions = async () => {
            setIsLoading(true);
            const result = await fetchTransactions();

            if (result.success && result.data) {
                setTransactions(result.data);
            } else {
                setError(result.error || 'Failed to load transactions');
            }
            setIsLoading(false);
        };

        loadTransactions();
    }, []);

    // Format value based on wei amount
    const formatValue = (value?: string): string => {
        if (!value || value === '0') return '0 ETH';

        const wei = BigInt(value);
        if (wei === 0n) return '0 ETH';

        // Convert wei to ETH
        if (wei >= 1000000000000000000n) { // If >= 1 ETH
            return `${Number(wei) / 1e18} ETH`;
        } else if (wei >= 1000000000000000n) { // If >= 0.001 ETH
            return `${Number(wei) / 1e18} ETH`;
        } else if (wei >= 1000000000000n) { // If >= 0.000001 ETH
            return `${Number(wei) / 1e18} ETH`;
        } else {
            return `${wei.toString()} wei`;
        }
    };

    // Format address to be shorter
    const formatAddress = (address?: string): string => {
        if (!address) return 'N/A';
        if (address === 'Contract Creation') return address;
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Filter transactions based on user selections
    const filteredTransactions = transactions.filter(tx => {
        // Chain filter
        if (chainFilter !== 'all' && tx.chainName !== chainFilter) {
            return false;
        }

        // Status filter
        if (statusFilter !== 'all' && tx.status !== statusFilter) {
            return false;
        }

        // Search query (check in txHash, from, to)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                tx.txHash.toLowerCase().includes(query) ||
                (tx.from || '').toLowerCase().includes(query) ||
                (tx.to || '').toLowerCase().includes(query)
            );
        }

        return true;
    });

    // Get unique chain names for filter dropdown
    const uniqueChains = [...new Set(transactions.map(tx => tx.chainName))];

    // Pagination
    const indexOfLastTx = currentPage * transactionsPerPage;
    const indexOfFirstTx = indexOfLastTx - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTx, indexOfLastTx);
    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

    // Page change handler
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (isLoading) {
        return (
            <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6F4E37] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="text-center py-8">
                    <svg className="mx-auto h-16 w-16 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Transactions</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-[#A67C52] p-4 text-white">
                    <h2 className="text-xl font-semibold">Transaction List</h2>
                </div>

                <div className="p-6">
                    {/* Filters and Search */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by hash, from, or to address..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // Reset to first page on new search
                                }}
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                                value={chainFilter}
                                onChange={(e) => {
                                    setChainFilter(e.target.value);
                                    setCurrentPage(1); // Reset to first page on filter change
                                }}
                            >
                                <option value="all">All Chains</option>
                                {uniqueChains.map(chain => (
                                    <option key={chain} value={chain}>{chain}</option>
                                ))}
                            </select>

                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1); // Reset to first page on filter change
                                }}
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="finalized">Finalized</option>
                            </select>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    {currentTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tx Hash
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Chain
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Block
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            From
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            To
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Value
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentTransactions.map((tx) => (
                                        <tr key={tx.txHash} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <Link
                                                    href={`/?search=${encodeURIComponent(tx.txHash)}`}
                                                    className="text-[#6F4E37] hover:text-[#3A2D21] font-medium"
                                                >
                                                    {tx.txHash.substring(0, 10)}...{tx.txHash.substring(tx.txHash.length - 8)}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <Link
                                                    href={`/rollup/${tx.chainId}`}
                                                    className="text-[#6F4E37] hover:text-[#3A2D21]"
                                                >
                                                    {tx.chainName}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                <div className="text-gray-900">{tx.blockNumber}</div>
                                                {tx.blockTimestamp && (
                                                    <div className="text-xs text-gray-500">
                                                        {formatTimestamp(tx.blockTimestamp)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {formatAddress(tx.from)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {formatAddress(tx.to)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatValue(tx.value)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.status === 'finalized' ? 'bg-green-100 text-green-800' :
                                                    tx.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                                </span>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {tx.espressoConfirmed ? 'Espresso ✓' : 'Espresso ⏳'}
                                                    {tx.confirmations !== undefined && (
                                                        <span className="ml-1">{tx.confirmations}/12</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchQuery || chainFilter !== 'all' || statusFilter !== 'all' ?
                                    'Try adjusting your filters or search query.' :
                                    'No transactions have been processed yet.'}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredTransactions.length > transactionsPerPage && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstTx + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(indexOfLastTx, filteredTransactions.length)}
                                </span> of{' '}
                                <span className="font-medium">{filteredTransactions.length}</span> transactions
                            </div>

                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                    let pageNum;

                                    // For first 5 pages, show 1-5
                                    if (totalPages <= 5 || currentPage <= 3) {
                                        pageNum = i + 1;
                                    }
                                    // For last pages, show last 5 pages
                                    else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    }
                                    // For middle pages, show current page with 2 before and 2 after
                                    else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    // Skip page numbers outside range
                                    if (pageNum <= 0 || pageNum > totalPages) return null;

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => paginate(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === pageNum
                                                ? 'z-10 bg-[#6F4E37] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6F4E37]'
                                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${currentPage === totalPages ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-[#A67C52] p-4 text-white">
                    <h2 className="text-xl font-semibold">Transaction Statistics</h2>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-[#3A2D21] mb-2">Total Transactions</h3>
                            <p className="text-3xl font-bold">{transactions.length}</p>
                            <div className="mt-2 text-sm text-gray-600">
                                <span className="text-green-600 font-medium">
                                    {transactions.filter(tx => tx.espressoConfirmed).length}
                                </span> confirmed by Espresso
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="text-blue-600 font-medium">
                                    {transactions.filter(tx => tx.chainConfirmed).length}
                                </span> confirmed by chain
                            </div>
                        </div>

                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-[#3A2D21] mb-2">Transactions by Chain</h3>
                            {uniqueChains.map(chain => {
                                const count = transactions.filter(tx => tx.chainName === chain).length;
                                return (
                                    <div key={chain} className="flex justify-between mb-1">
                                        <span className="text-gray-600">{chain}:</span>
                                        <span className="font-medium">{count}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-[#3A2D21] mb-2">Confirmation Status</h3>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-600">Pending:</span>
                                <span className="font-medium">{transactions.filter(tx => tx.status === 'pending').length}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-600">Confirmed:</span>
                                <span className="font-medium">{transactions.filter(tx => tx.status === 'confirmed').length}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-600">Finalized:</span>
                                <span className="font-medium">{transactions.filter(tx => tx.status === 'finalized').length}</span>
                            </div>
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