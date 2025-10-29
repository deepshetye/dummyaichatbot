'use client';

import { useState, useEffect } from 'react';
import { ChatInterface } from './ChatInterface';
import { useIsHydrated } from './ProgressiveEnhancement';

export function ChatWrapper() {
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const isHydrated = useIsHydrated();

    const handleQuestionSelect = (questionId: string) => {
        setSelectedQuestionId(questionId);
    };

    // Listen for question selection events from search
    useEffect(() => {
        if (!isHydrated) return;

        const handleQuestionSelected = (event: CustomEvent) => {
            const { questionId } = event.detail;
            setSelectedQuestionId(questionId);
        };

        window.addEventListener('questionSelected', handleQuestionSelected as EventListener);

        return () => {
            window.removeEventListener('questionSelected', handleQuestionSelected as EventListener);
        };
    }, [isHydrated]);

    // Don't render interactive components until hydrated
    if (!isHydrated) {
        return (
            <div className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Chat Interface
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Loading interactive features...
                </p>
            </div>
        );
    }

    return (
        <ChatInterface
            selectedQuestionId={selectedQuestionId}
            onQuestionSelect={handleQuestionSelect}
        />
    );
}
