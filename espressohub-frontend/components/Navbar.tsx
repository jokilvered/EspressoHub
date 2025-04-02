import CustomConnectButton from '@/components/ConnectButton';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-[#6F4E37] text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                        <line x1="6" y1="1" x2="6" y2="4"></line>
                        <line x1="10" y1="1" x2="10" y2="4"></line>
                        <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                    <h1 className="text-xl font-bold">EspressoHub</h1>
                </div>
                <div className="flex space-x-4">
                    <Link href="/" className="hover:text-[#FFF8E1]">Search</Link>
                    <Link href="/bridge" className="hover:text-[#FFF8E1]">Bridge</Link>
                    <Link href="/transactions" className="hover:text-[#FFF8E1]">Transactions</Link>
                    <Link href="/leaderboard" className="hover:text-[#FFF8E1]">Leaderboard</Link>
                    <Link href="/metrics" className="hover:text-[#FFF8E1]">Metrics</Link>
                    <Link href="/wallet" className="hover:text-[#FFF8E1]">Wallet</Link>
                    <Link href="/about" className="hover:text-[#FFF8E1]">About</Link>
                </div>
                <CustomConnectButton />

            </div>
        </nav>
    );
}
