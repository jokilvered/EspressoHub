import { useEffect, useState } from "react";

interface SearchBarProps {
    onSearch: (hash: string) => void;
    isLoading: boolean;
    initialValue?: string;
}

export default function SearchBar({ onSearch, isLoading, initialValue = '' }: SearchBarProps) {
    const [hash, setHash] = useState(initialValue);

    useEffect(() => {
        setHash(initialValue);
    }, [initialValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hash.trim()) {
            onSearch(hash.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
                <input
                    type="text"
                    value={hash}
                    onChange={(e) => setHash(e.target.value)}
                    placeholder="Enter Transaction Hash"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 top-2 bg-[#6F4E37] text-white px-4 py-1 rounded-lg hover:bg-[#3A2D21] transition disabled:opacity-50"
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>
        </form>
    );
}