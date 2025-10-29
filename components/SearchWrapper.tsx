'use client';

import { SearchAutocomplete } from './SearchAutocomplete';
import { useIsHydrated } from './ProgressiveEnhancement';

export function SearchWrapper() {
    const isHydrated = useIsHydrated();

    const handleSelectQuestion = (questionId: string) => {
        // Dispatch custom event for client components to listen
        window.dispatchEvent(new CustomEvent('questionSelected', {
            detail: { questionId }
        }));
    };

    // Don't render interactive components until hydrated
    if (!isHydrated) {
        return (
            <div className="w-full max-w-2xl p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-400 text-center">
                    Search functionality will be available when JavaScript loads
                </p>
            </div>
        );
    }

    return (
        <SearchAutocomplete
            onSelectQuestion={handleSelectQuestion}
            placeholder="Search for questions..."
        />
    );
}
