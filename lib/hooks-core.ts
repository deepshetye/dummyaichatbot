'use client';

import { useState, useEffect, useCallback } from 'react';

// Browser storage utilities for vote persistence
export function useVotePersistence(commentId: string, initialVotes: number = 0) {
    const [votes, setVotes] = useState(initialVotes);
    const [hasVoted, setHasVoted] = useState(false);

    // Load persisted votes on mount
    useEffect(() => {
        try {
            const storedVotes = localStorage.getItem(`votes_${commentId}`);
            const storedHasVoted = localStorage.getItem(`hasVoted_${commentId}`);

            if (storedVotes) {
                setVotes(parseInt(storedVotes, 10));
            }
            if (storedHasVoted === 'true') {
                setHasVoted(true);
            }
        } catch (error) {
            console.warn('Failed to load votes from localStorage:', error);
        }
    }, [commentId]);

    const handleVote = useCallback((delta: number) => {
        if (hasVoted) {
            console.log('User has already voted on this comment');
            return;
        }

        const newVotes = votes + delta;
        setVotes(newVotes);
        setHasVoted(true);

        try {
            localStorage.setItem(`votes_${commentId}`, newVotes.toString());
            localStorage.setItem(`hasVoted_${commentId}`, 'true');
        } catch (error) {
            console.warn('Failed to persist votes to localStorage:', error);
        }
    }, [commentId, votes, hasVoted]);

    const resetVote = useCallback(() => {
        setVotes(initialVotes);
        setHasVoted(false);

        try {
            localStorage.removeItem(`votes_${commentId}`);
            localStorage.removeItem(`hasVoted_${commentId}`);
        } catch (error) {
            console.warn('Failed to reset votes in localStorage:', error);
        }
    }, [commentId, initialVotes]);

    return {
        votes,
        hasVoted,
        handleVote,
        resetVote
    };
}

// Confirmation dialog hook
export function useConfirmationDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

    const showConfirmation = useCallback((msg: string, confirmCallback: () => void) => {
        setMessage(msg);
        setOnConfirm(() => confirmCallback);
        setIsOpen(true);
    }, []);

    const handleConfirm = useCallback(() => {
        if (onConfirm) {
            onConfirm();
        }
        setIsOpen(false);
        setOnConfirm(null);
    }, [onConfirm]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        setOnConfirm(null);
    }, []);

    return {
        isOpen,
        message,
        showConfirmation,
        handleConfirm,
        handleCancel
    };
}

// Sticky header hook for chat interface
export function useStickyHeader() {
    const [stickyHeader, setStickyHeader] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const messages = document.querySelectorAll('[data-message-id]');
            let currentHeader = null;

            messages.forEach((message) => {
                const rect = message.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    const questionId = message.getAttribute('data-question-id');
                    if (questionId) {
                        currentHeader = questionId;
                    }
                }
            });

            setStickyHeader(currentHeader);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return stickyHeader;
}
