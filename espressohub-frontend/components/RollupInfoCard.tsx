import { RollupInfo } from "@/types";

interface RollupInfoCardProps {
    rollupInfo: RollupInfo;
}

export default function RollupInfoCard({ rollupInfo }: RollupInfoCardProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[#3A2D21] mb-4">Rollup Information</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">TPS</p>
                    <p className="text-xl font-semibold">{rollupInfo.tps.toFixed(3)}</p>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Block Height</p>
                    <p className="text-xl font-semibold">{rollupInfo.blockHeight}</p>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Avg Block Time</p>
                    <p className="text-xl font-semibold">{rollupInfo.averageBlockTime}s</p>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Espresso Status</p>
                    <p className={`text-xl font-semibold ${rollupInfo.espressoConnected ? 'text-green-500' : 'text-red-500'}`}>
                        {rollupInfo.espressoConnected ? 'Connected' : 'Disconnected'}
                    </p>
                </div>
            </div>
        </div>
    );
}
