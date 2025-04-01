import { Transaction } from "@/types";
import { formatDuration } from "@/utils";

interface ConfirmationTimelineProps {
    transaction: Transaction;
}

export default function ConfirmationTimeline({ transaction }: ConfirmationTimelineProps) {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#3A2D21] mb-4">Confirmation Timeline</h3>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute h-full w-0.5 bg-gray-200 left-6 top-0"></div>

                {/* Transaction Created */}
                <div className="ml-14 relative mb-8">
                    <div className="absolute -left-14 mt-1.5">
                        <div className="h-5 w-5 rounded-full border-4 border-[#6F4E37] bg-white"></div>
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-[#3A2D21] font-medium">Transaction Created</h4>
                        <p className="text-sm text-gray-500">{new Date(transaction.trackingStarted).toLocaleString()}</p>
                    </div>
                </div>

                {/* Espresso Confirmation */}
                <div className="ml-14 relative mb-8">
                    <div className="absolute -left-14 mt-1.5">
                        <div className={`h-5 w-5 rounded-full border-4 ${transaction.espressoConfirmed ? 'border-green-500' : 'border-gray-300'} bg-white`}></div>
                    </div>
                    <div className={`flex flex-col ${!transaction.espressoConfirmed ? 'opacity-50' : ''}`}>
                        <h4 className="text-[#3A2D21] font-medium">Espresso Confirmation</h4>
                        {transaction.espressoConfirmed && transaction.espressoTime ? (
                            <>
                                <p className="text-sm text-gray-500">
                                    {new Date(transaction.espressoTime).toLocaleString()}
                                </p>
                                {transaction.espressoConfirmationDuration && (
                                    <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {formatDuration(transaction.espressoConfirmationDuration / 1000)}ms confirmation time
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Pending...</p>
                        )}
                    </div>
                </div>

                {/* Chain Confirmation */}
                <div className="ml-14 relative mb-8">
                    <div className="absolute -left-14 mt-1.5">
                        <div className={`h-5 w-5 rounded-full border-4 ${transaction.chainConfirmed ? 'border-green-500' : 'border-gray-300'} bg-white`}></div>
                    </div>
                    <div className={`flex flex-col ${!transaction.chainConfirmed ? 'opacity-50' : ''}`}>
                        <h4 className="text-[#3A2D21] font-medium">Chain Confirmation</h4>
                        {transaction.chainConfirmed && transaction.chainTime ? (
                            <p className="text-sm text-gray-500">
                                {new Date(transaction.chainTime).toLocaleString()}
                            </p>
                        ) : (
                            <>
                                <p className="text-sm text-gray-500">Pending...</p>
                                <p className="text-sm text-gray-500">
                                    {transaction.confirmations || 0}/12 confirmations
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
