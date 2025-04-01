export default function About() {
    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-[#A67C52] p-4 text-white">
                <h2 className="text-xl font-semibold">About EspressoHub</h2>
            </div>

            <div className="p-6">
                <h3 className="text-2xl font-bold text-[#3A2D21] mb-4">Build & Brew Hackathon Project</h3>

                <div className="prose max-w-none">
                    <p>
                        EspressoHub is a tool built for the Espresso Systems "Build & Brew"
                        hackathon to demonstrate the power of using Espresso for transaction confirmations on rollups.
                    </p>

                    <h4 className="text-xl font-semibold mt-6">Features</h4>
                    <ul>
                        <li>Track any transaction across supported Espresso-integrated rollups</li>
                        <li>See side-by-side comparison of Espresso vs. traditional confirmation times</li>
                        <li>Monitor rollup performance metrics in real-time</li>
                        <li>Compare various rollups using the leaderboard feature</li>
                    </ul>

                    <h4 className="text-xl font-semibold mt-6">How It Works</h4>
                    <p>
                        EspressoHub connects to multiple Espresso-integrated rollups and monitors
                        transactions in real-time. When a transaction is submitted to a rollup, it tracks:
                    </p>

                    <ol>
                        <li><strong>Espresso Confirmation</strong> - When the transaction is confirmed by the Espresso Network</li>
                        <li><strong>Chain Confirmation</strong> - When the transaction reaches the confirmation threshold on the rollup chain</li>
                    </ol>

                    <p>
                        By comparing these two timestamps, we can demonstrate the speed advantage that Espresso brings to
                        blockchain transactions, allowing for much faster finality and better user experience.
                    </p>

                    <h4 className="text-xl font-semibold mt-6">About Espresso Systems</h4>
                    <p>
                        Espresso Systems builds infrastructure for Web3 scaling and privacy. The Espresso Sequencer is a decentralized,
                        high-performance sequencing network that brings fast confirmations, better composability, and enhanced security
                        to rollups and applications.
                    </p>

                    <p className="mt-8 text-center text-gray-500 italic">
                        Created for the Build & Brew Hackathon - 2025
                    </p>
                </div>
            </div>
        </div>
    );
}