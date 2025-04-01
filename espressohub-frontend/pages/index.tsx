import { useEffect, useState } from 'react';
import { TransactionResponse } from '@/types';
import SearchBar from '@/components/SearchBar';
import TransactionDetails from '@/components/TransactionDetails';
import RollupInfoCard from '@/components/RollupInfoCard';
import { fetchTransaction } from '@/utils';
import ConfirmationTimeline from '@/components/Timeline';
import NoResults from '@/components/NoResult';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<TransactionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialSearch, setInitialSearch] = useState('');

  useEffect(() => {
    const searchParam = router.query.search as string;
    if (searchParam) {
      setInitialSearch(searchParam);
      handleSearch(searchParam);
    }
  }, [router.query]);

  const handleSearch = async (hash: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTransaction(hash);
      if (data === null) {
        setError('Transaction not found');
        throw new Error('Transaction not found');
      }

      setSearchResults(data);
    } catch (err) {
      setError('An error occurred while searching for the transaction');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-[#A67C52] p-4 text-white">
        <h2 className="text-xl font-semibold">Transaction Search</h2>
      </div>

      <div className="p-6">
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          initialValue={initialSearch}
        />

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6F4E37] mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for transaction...</p>
          </div>
        )}

        {!isLoading && searchResults && searchResults.success && searchResults.data && (
          <>
            <TransactionDetails transaction={searchResults.data.transaction} />
            <ConfirmationTimeline transaction={searchResults.data.transaction} />
            <RollupInfoCard rollupInfo={searchResults.data.rollupInfo} />
          </>
        )}

        {!isLoading && (error || (searchResults && !searchResults.success)) && (
          <NoResults message={error || searchResults?.error} />
        )}
      </div>
    </div>
  );
}