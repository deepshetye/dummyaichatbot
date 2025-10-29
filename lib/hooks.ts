'use client';

import { useQuery } from '@tanstack/react-query';
import { questions } from '@/lib/data';
import { Question, SearchResult } from '@/lib/types';
import { highlightText } from '@/lib/utils';

export function useSearchQuestions(query: string) {
    return useQuery({
        queryKey: ['search', query],
        queryFn: async (): Promise<SearchResult[]> => {
            if (!query.trim()) return [];

            const filtered = questions.filter(question =>
                question.title.toLowerCase().includes(query.toLowerCase()) ||
                question.category.toLowerCase().includes(query.toLowerCase()) ||
                question.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );

            return filtered.slice(0, 10).map(question => ({
                id: question.id,
                title: question.title,
                category: question.category,
                highlightedTitle: highlightText(question.title, query)
            }));
        },
        enabled: query.length > 0,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useQuestion(id: string | null) {
    return useQuery({
        queryKey: ['question', id],
        queryFn: async (): Promise<Question | undefined> => {
            if (!id) return undefined;
            return questions.find(q => q.id === id);
        },
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useQuestions() {
    return useQuery({
        queryKey: ['questions'],
        queryFn: async (): Promise<Question[]> => {
            return questions;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
