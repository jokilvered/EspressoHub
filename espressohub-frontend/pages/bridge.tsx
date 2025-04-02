// File: pages/bridge.tsx
import { useState, useEffect } from 'react';
import { useAccount, useBalance, useChains, useConfig, useSendTransaction, useSwitchChain } from 'wagmi';
import CustomConnectButton from '@/components/ConnectButton';
import { parseEther } from 'viem';
import { ArrowRightLeft } from 'lucide-react';

export default function BridgePage() {
    // Use client-side only state to prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    const { address, isConnected } = useAccount();
    const chains = useChains();
    const config = useConfig();

    // Bridge state
    const [fromChainId, setFromChainId] = useState<number | undefined>(undefined);
    const [toChainId, setToChainId] = useState<number | undefined>(undefined);
    const [amount, setAmount] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { switchChain } = useSwitchChain();

    // Get balance for the selected 'from' chain
    const { data: balanceData } = useBalance({
        address,
        chainId: fromChainId,
    });

    // Set mounted to true after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // Initialize chains
    useEffect(() => {
        if (chains && chains.length > 0 && !fromChainId && !toChainId) {
            // Set default from chain to first chain
            setFromChainId(chains[0].id);
            // Set default to chain to second chain or first if only one exists
            setToChainId(chains.length > 1 ? chains[1].id : chains[0].id);
        }
    }, [chains, fromChainId, toChainId]);

    // Update recipient address to self when address changes
    useEffect(() => {
        if (address && !recipientAddress) {
            setRecipientAddress(address);
        }
    }, [address, recipientAddress]);

    // Swap the from and to chains
    const handleSwapChains = () => {
        const temp = fromChainId;
        setFromChainId(toChainId);
        setToChainId(temp);
    };

    // Set max amount based on balance
    const handleSetMaxAmount = () => {
        if (balanceData) {
            // Set to 90% of balance to account for gas
            const maxAmount = parseFloat(balanceData.formatted) * 0.9;
            setAmount(maxAmount.toString());
        }
    };

    // Set recipient to self (connected address)
    const handleSetSelf = () => {
        if (address) {
            setRecipientAddress(address);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConnected) {
            setError('Please connect your wallet first');
            return;
        }

        if (!fromChainId || !toChainId) {
            setError('Please select both chains');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (!recipientAddress) {
            setError('Please enter a recipient address');
            return;
        }

        setError(null);
        setTxHash(null);
        setIsProcessing(true);

        try {
            switchChain({
                chainId: fromChainId,
            });


        } catch (err) {
            console.error('Bridge error:', err);
            setError('Failed to bridge tokens');
        } finally {
            setIsProcessing(false);
        }
    };

    // Render placeholder content for SSR
    if (!mounted) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="bg-[#A67C52] p-4 text-white flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Bridge & Swap</h2>
                        <div>Loading...</div>
                    </div>
                    <div className="p-6">
                        <div className="text-center py-8">
                            <p>Loading bridge interface...</p>
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
                    <h2 className="text-xl font-semibold">Bridge & Swap</h2>
                    <CustomConnectButton />
                </div>

                <div className="p-6">
                    {isConnected ? (
                        <div className="flex justify-center">
                            <div className="w-full max-w-md bg-[#F9F5F1] rounded-lg p-6 shadow-sm">
                                {txHash && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="text-green-700 font-medium">Transaction Submitted!</div>
                                        <div className="mt-2 text-sm">
                                            <span className="font-medium">Transaction Hash: </span>
                                            <span className="font-mono text-xs break-all">
                                                {txHash}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="text-red-700">{error}</div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    {/* From and To Chain Selection */}
                                    <div className="mb-5">
                                        <div className="flex justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700">From</label>
                                            <label className="block text-sm font-medium text-gray-700">To</label>
                                        </div>

                                        <div className="flex items-center">
                                            <select
                                                value={fromChainId || ''}
                                                onChange={(e) => setFromChainId(Number(e.target.value))}
                                                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                                            >
                                                {chains.map((chain) => (
                                                    <option key={`from-${chain.id}`} value={chain.id}>
                                                        {chain.name}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                type="button"
                                                onClick={handleSwapChains}
                                                className="mx-2 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md"
                                            >
                                                <ArrowRightLeft size={20} />
                                            </button>

                                            <select
                                                value={toChainId || ''}
                                                onChange={(e) => setToChainId(Number(e.target.value))}
                                                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                                            >
                                                {chains.map((chain) => (
                                                    <option key={`to-${chain.id}`} value={chain.id}>
                                                        {chain.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Token Selection */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Token</label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52] appearance-none"
                                                defaultValue="ETH"
                                            >
                                                <option value="ETH">ETH</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="mb-5">
                                        <div className="flex justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                                            <span className="text-sm text-gray-500">
                                                My balance: {balanceData?.formatted.slice(0, 7) || '0.0000'} ETH
                                            </span>
                                        </div>

                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.001"
                                                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleSetMaxAmount}
                                                className="px-4 py-2 bg-[#A67C52] text-white font-medium rounded-r-lg hover:bg-[#8D5D38]"
                                            >
                                                Max
                                            </button>
                                        </div>
                                    </div>

                                    {/* Recipient Address */}
                                    <div className="mb-5">
                                        <div className="flex justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700">Recipient address</label>
                                            <span className="text-sm text-gray-500">
                                                Remote balance: 0
                                            </span>
                                        </div>

                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={recipientAddress}
                                                onChange={(e) => setRecipientAddress(e.target.value)}
                                                placeholder="0x..."
                                                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleSetSelf}
                                                className="px-4 py-2 bg-[#A67C52] text-white font-medium rounded-r-lg hover:bg-[#8D5D38]"
                                            >
                                                Self
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full py-3 px-4 bg-[#E07E2C] hover:bg-[#C06A1E] text-white font-medium rounded-lg transition-colors disabled:opacity-70"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="inline-block mr-2 animate-spin">⟳</span>
                                                Processing...
                                            </>
                                        ) : (
                                            'CONTINUE'
                                        )}
                                    </button>
                                </form>

                                {/* Fees & Time Estimate */}
                                <div className="mt-5 text-center text-sm text-gray-500">
                                    <p>Estimated fees: 0.001 ETH</p>
                                    <p>Estimated time: ~5 minutes</p>
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
                                <path d="M18 6L6 18M6 6l12 12" />
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            </svg>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Connect Your Wallet</h3>
                            <p className="text-gray-600 mb-6">Please connect your wallet to use the bridge</p>
                            <CustomConnectButton />
                        </div>
                    )}
                </div>
            </div>

            {/* Bridge Information */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-[#A67C52] p-4 text-white">
                    <h2 className="text-xl font-semibold">Bridge Information</h2>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-[#3A2D21] mb-2">How It Works</h3>
                            <p className="text-gray-700 mb-2">
                                The Espresso Bridge enables token transfers between Rollup1 and Rollup2.
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Fast transfers with Espresso confirmation</li>
                                <li>Secure cross-chain messaging</li>
                                <li>Low fees compared to other bridges</li>
                            </ul>
                        </div>

                        <div className="bg-[#FFF8E1] p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-[#3A2D21] mb-2">Supported Tokens</h3>
                            <div className="space-y-2">
                                <div className="flex items-center p-2 bg-white rounded">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-blue-600">Ξ</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Ethereum (ETH)</p>
                                        <p className="text-xs text-gray-500">Native currency</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-2 bg-white rounded opacity-50">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-green-600">$</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">USDC (Coming soon)</p>
                                        <p className="text-xs text-gray-500">USD Stablecoin</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transfers */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-[#A67C52] p-4 text-white">
                    <h2 className="text-xl font-semibold">Recent Transfers</h2>
                </div>

                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Transaction
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        From
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        To
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}