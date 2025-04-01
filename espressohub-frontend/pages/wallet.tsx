'use client'

import { useEffect, useState } from 'react';
import { useAccount, useBalance, useChains, useConfig, useSendTransaction, useSimulateContract, useSwitchChain } from 'wagmi';
import CustomConnectButton from '@/components/ConnectButton';
import Link from 'next/link';
import { parseEther } from 'viem';
import { fetchTransactions } from '@/utils';
import { Transaction } from '@/types';
import { useRouter } from 'next/router';

export default function WalletPage() {
    const { address, isConnected } = useAccount();
    const { data: balanceData } = useBalance({
        address: address,
    });

    const { chain } = useAccount();

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedChainId, setSelectedChainId] = useState<number | undefined>(undefined);
    const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const chains = useChains();
    const { switchChain } = useSwitchChain();
    const config = useConfig();

    useEffect(() => {
        if (chains && chains.length > 0 && !selectedChainId) {
            setSelectedChainId(chains[0].id);
        }
    }, [chains, selectedChainId]);

    const { sendTransaction, isPending, data, variables, context } = useSendTransaction();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setTxHash(null);

        if (!recipient || !amount) {
            setError('Please fill all fields');
            return;
        }

        try {
            // Send transaction
            sendTransaction({
                to: recipient as `0x${string}`,
                value: parseEther(amount),
            });
            console.log('Transaction sent:', recipient, amount, data, variables);
            setRecipient('');
            setAmount('');
        } catch (err) {
            console.error('Transaction error:', err);
            setError('Transaction failed');
        }
    };

    useEffect(() => {
        if (data) {
            console.log('Transaction data:', data);
            // show modal about transaction hash and there is button to redirect search page
        }
    }, [data]);


    useEffect(() => {
        setMounted(true);
    }, []);


    // Load user transactions
    useEffect(() => {
        const loadMyTransactions = async () => {
            if (!address || !mounted) return;

            setIsLoading(true);
            try {
                const result = await fetchTransactions();
                if (result.success && result.data) {
                    // Filter transactions involving the connected account
                    const accountTransactions = result.data.filter(
                        tx => (tx.from?.toLowerCase() === address.toLowerCase() ||
                            tx.to?.toLowerCase() === address.toLowerCase())
                    );
                    setMyTransactions(accountTransactions);
                }
            } catch (error) {
                console.error('Error fetching my transactions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isConnected && mounted) {
            loadMyTransactions();
        }
    }, [address, isConnected, mounted]);

    if (!mounted) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="bg-[#A67C52] p-4 text-white flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Wallet</h2>
                        <div>Loading...</div>
                    </div>
                    <div className="p-6">
                        <div className="text-center py-8">
                            <p>Loading wallet interface...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }




    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-[#A67C52] p-4 text-white flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Wallet</h2>
                    <CustomConnectButton />
                </div>

                <div className="p-6">
                    {isConnected ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Account Info */}
                            <div className="col-span-1 md:col-span-2">
                                <div className="bg-[#FFF8E1] p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-[#3A2D21] mb-4">Account Information</h3>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600">Address:</p>
                                        <p className="font-mono break-all">{address}</p>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600">Balance:</p>
                                        <p className="text-xl font-semibold">
                                            {balanceData ? `${balanceData.formatted} ${balanceData.symbol}` : 'Loading...'}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600">Network:</p>
                                        <p className="font-medium">
                                            {chain ? chain.name : 'Not connected to a network'}
                                        </p>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="mt-6">
                                        <h4 className="font-medium text-[#3A2D21] mb-2">Recent Activity</h4>

                                        {isLoading ? (
                                            <div className="text-center py-4">
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#6F4E37] mx-auto"></div>
                                                <p className="mt-2 text-sm text-gray-600">Loading transactions...</p>
                                            </div>
                                        ) : myTransactions.length > 0 ? (
                                            <div className="space-y-2">
                                                {myTransactions.map((tx) => (
                                                    <div key={tx.txHash} className="flex justify-between bg-white p-3 rounded-lg shadow-sm">
                                                        <div>
                                                            <Link
                                                                href={`/transaction/${tx.txHash}`}
                                                                className="text-[#6F4E37] hover:text-[#3A2D21] font-medium"
                                                            >
                                                                {tx.txHash.substring(0, 8)}...{tx.txHash.substring(tx.txHash.length - 6)}
                                                            </Link>
                                                            <div className="text-xs text-gray-500">
                                                                {tx.blockTimestamp ? (
                                                                    new Date(tx.blockTimestamp * 1000).toLocaleString()
                                                                ) : (
                                                                    'Pending'
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className={`text-right ${tx.from?.toLowerCase() === address?.toLowerCase()
                                                            ? 'text-red-600' : 'text-green-600'
                                                            }`}>
                                                            {tx.from?.toLowerCase() === address?.toLowerCase() ? '- ' : '+ '}
                                                            {Number(tx.value) / 1e18} ETH
                                                            <div className="text-xs text-gray-500">
                                                                {tx.chainName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {myTransactions.length > 5 && (
                                                    <div className="text-center mt-2">
                                                        <Link
                                                            href="/transactions"
                                                            className="text-[#6F4E37] hover:text-[#3A2D21] text-sm"
                                                        >
                                                            View all transactions →
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 bg-white rounded-lg">
                                                <p className="text-sm text-gray-600">No transactions found for this account</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Send Transaction Form */}
                            <div className="col-span-1">
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-semibold text-[#3A2D21] mb-4">Send Transaction</h2>

                                    {txHash && (
                                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="text-green-700 font-medium">Transaction Sent!</div>
                                            <div className="mt-2 text-sm">
                                                <span className="font-medium">Transaction Hash: </span>
                                                <a
                                                    href={`/transaction/${txHash}`}
                                                    className="text-[#6F4E37] hover:text-[#3A2D21] font-mono break-all"
                                                >
                                                    {txHash}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="text-red-700">{error}</div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
                                                Recipient Address
                                            </label>
                                            <input
                                                type="text"
                                                id="recipient"
                                                value={recipient}
                                                onChange={(e) => setRecipient(e.target.value)}
                                                placeholder="0x..."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                                Amount (ETH)
                                            </label>
                                            <input
                                                type="number"
                                                id="amount"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.01"
                                                min="0"
                                                step="0.000000000000000001"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                                                required
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="chain" className="block text-sm font-medium text-gray-700 mb-1">
                                                Rollup Chain
                                            </label>
                                            <select
                                                id="chain"
                                                value={selectedChainId}
                                                onChange={(e) => setSelectedChainId(Number(e.target.value))}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                                                required
                                            >
                                                {chains.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isPending || !sendTransaction}
                                            className="w-full bg-[#6F4E37] text-white px-4 py-2 rounded-lg hover:bg-[#3A2D21] transition-colors disabled:opacity-70"
                                        >
                                            {isPending ? (
                                                <>
                                                    <span className="inline-block mr-2 animate-spin">⟳</span>
                                                    Sending...
                                                </>
                                            ) : (
                                                'Send Transaction'
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-lg">
                            <svg
                                className="w-16 h-16 text-[#A67C52] mx-auto mb-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="3" x2="9" y2="21"></line>
                            </svg>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Connect Your Wallet</h3>
                            <p className="text-gray-600 mb-6">Connect your Ethereum wallet to send transactions</p>
                            <CustomConnectButton />
                        </div>
                    )}
                </div>
            </div>

            {/* Network Status */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-[#A67C52] p-4 text-white">
                    <h2 className="text-xl font-semibold">Espresso Network Status</h2>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-[#3A2D21] mb-2">Rollup1</h3>
                            <div className="flex items-center mt-2">
                                <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-2"></span>
                                <span className="text-green-600 font-medium">Connected</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                Chain ID: 123456789
                            </div>
                            <div className="mt-4">
                                <Link
                                    href="/rollup/123456789"
                                    className="text-[#6F4E37] hover:text-[#3A2D21] text-sm font-medium"
                                >
                                    View Rollup Details →
                                </Link>
                            </div>
                        </div>

                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-[#3A2D21] mb-2">Rollup2</h3>
                            <div className="flex items-center mt-2">
                                <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-2"></span>
                                <span className="text-green-600 font-medium">Connected</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                Chain ID: 1288752452
                            </div>
                            <div className="mt-4">
                                <Link
                                    href="/rollup/1288752452"
                                    className="text-[#6F4E37] hover:text-[#3A2D21] text-sm font-medium"
                                >
                                    View Rollup Details →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
