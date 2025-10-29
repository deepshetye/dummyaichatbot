'use client';

import { useState, useCallback, useMemo } from 'react';
import { Comment } from '@/lib/types';

export type SortOption = 'newest' | 'oldest' | 'mostVoted';

export function useCommentSorting(comments: Comment[]) {
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    const sortedComments = useMemo(() => {
        const sorted = [...comments];

        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            case 'oldest':
                return sorted.sort((a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
            case 'mostVoted':
                return sorted.sort((a, b) => b.votes - a.votes);
            default:
                return sorted;
        }
    }, [comments, sortBy]);

    const handleSortChange = useCallback((newSort: SortOption) => {
        setSortBy(newSort);
    }, []);

    return {
        sortBy,
        sortedComments,
        handleSortChange
    };
}
