import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function CustomConnectButton() {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === 'authenticated');

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        type="button"
                                        className="bg-[#6F4E37] text-white px-4 py-2 rounded-lg hover:bg-[#3A2D21] transition-colors"
                                    >
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Wrong Network
                                    </button>
                                );
                            }

                            return (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="flex items-center bg-[#A67C52] text-white px-3 py-2 rounded-lg hover:bg-[#6F4E37] transition-colors"
                                    >
                                        {chain.hasIcon && (
                                            <div className="mr-1">
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        className="w-4 h-4"
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <span>{chain.name}</span>
                                    </button>

                                    <button
                                        onClick={openAccountModal}
                                        type="button"
                                        className="bg-[#6F4E37] text-white px-3 py-2 rounded-lg hover:bg-[#3A2D21] transition-colors"
                                    >
                                        {account.displayName}
                                        {account.displayBalance ? ` (${account.displayBalance})` : ''}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}

