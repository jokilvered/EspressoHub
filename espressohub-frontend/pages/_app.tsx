import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  Chain,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const espressoRollup1 = {
  id: 123456789,
  name: 'Rollup1',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['/rpc/rollup1'] },
    default: { http: ['/rpc/rollup1'] },
  },
} as const satisfies Chain;

const espressoRollup2 = {
  id: 1288752452,
  name: 'Rollup2',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['/rpc/rollup2'] },
    default: { http: ['/rpc/rollup2'] },
  },
} as const satisfies Chain;


const config = getDefaultConfig({
  appName: 'EspressoHub',
  projectId: 'c3345655d13cccffc6cbb3853ad2ec24',
  chains: [
    espressoRollup1,
    espressoRollup2,
  ],
  ssr: true,
});

const queryClient = new QueryClient();


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>EspressoHub</title>
        <meta name="description" content="Track transactions across Espresso-integrated rollups" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col coffee-bg">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Component {...pageProps} />
              </main>
              <Footer />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>

      </div>
    </>
  );
}
