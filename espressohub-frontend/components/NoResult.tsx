interface NoResultsProps {
    message?: string;
}

export default function NoResults({ message = "No transaction found" }: NoResultsProps) {
    return (
        <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{message}</h3>
            <p className="mt-1 text-sm text-gray-500">Please check the transaction hash and try again.</p>
        </div>
    );
}
