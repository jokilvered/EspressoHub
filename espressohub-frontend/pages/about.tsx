export default function About() {
    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-[#A67C52] p-4 text-white">
                <h2 className="text-xl font-semibold">About EspressoHub</h2>
            </div>

            <div className="p-6">
                <h3 className="text-2xl font-bold text-[#3A2D21] mb-4">Reimagining Blockchain Interaction</h3>

                <div className="prose max-w-none">
                    <p className="text-lg text-[#6F4E37] bg-[#FFF8E1] p-3 rounded-lg">
                        EspressoHub is the definitive solution for blockchain interoperability, offering a comprehensive platform
                        that unifies multiple rollups and simplifies complex cross-chain interactions.
                    </p>

                    <h4 className="text-xl font-semibold mt-6">Our Solution</h4>
                    <ul>
                        <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-4 before:h-4 before:bg-[#A67C52] before:rounded-full">
                            Unified dashboard for seamless multi-chain management
                        </li>
                        <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-4 before:h-4 before:bg-[#A67C52] before:rounded-full">
                            <span className="text-[#6F4E37] font-semibold">Cross-chain</span> asset handling and wallet management
                        </li>
                        <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-4 before:h-4 before:bg-[#A67C52] before:rounded-full">
                            Integrated bridge and swap functionality
                        </li>
                        <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-4 before:h-4 before:bg-[#A67C52] before:rounded-full">
                            Comprehensive transaction tracking and insights
                        </li>
                        <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-4 before:h-4 before:bg-[#A67C52] before:rounded-full">
                            Real-time rollup performance metrics
                        </li>
                        <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-4 before:h-4 before:bg-[#A67C52] before:rounded-full">
                            Detailed network health monitoring
                        </li>
                    </ul>

                    <h4 className="text-xl font-semibold mt-6">Vision</h4>
                    <p>
                        We are building the infrastructure to transform blockchain from a fragmented landscape
                        into a seamless, interconnected ecosystem. EspressoHub breaks down technological barriers,
                        making complex blockchain interactions simple, transparent, and accessible.
                    </p>

                    <h4 className="text-xl font-semibold mt-6">How We Achieve <span className="text-[#6F4E37]">Cross-Chain</span> Functionality</h4>
                    <ol>
                        <li><strong>Espresso Sequencer Integration</strong> - Leveraging Espresso's high-performance sequencing network</li>
                        <li><strong>Unified Transaction Layer</strong> - Creating a single interface for multiple blockchain networks</li>
                        <li><strong>Advanced Bridging Mechanisms</strong> - Enabling seamless asset transfers between different chains using hyperlane</li>
                    </ol>

                    <h4 className="text-xl font-semibold mt-6">About Espresso Systems</h4>
                    <p>
                        Espresso Systems is pioneering infrastructure for a more connected, efficient Web3 ecosystem.
                        Our decentralized sequencing network enables faster confirmations, enhanced composability,
                        and improved security for blockchain applications.
                    </p>
                </div>
            </div>
        </div>
    );
}