'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Enhanced focus management hook
export function useFocusManagement() {
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    const focusElement = useCallback((index: number) => {
        if (containerRef.current) {
            const elements = containerRef.current.querySelectorAll('[data-focusable="true"]');
            const element = elements[index] as HTMLElement;
            if (element) {
                element.focus();
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, []);

    const nextFocus = useCallback(() => {
        if (containerRef.current) {
            const elements = containerRef.current.querySelectorAll('[data-focusable="true"]');
            const nextIndex = (focusedIndex + 1) % elements.length;
            setFocusedIndex(nextIndex);
            focusElement(nextIndex);
        }
    }, [focusedIndex, focusElement]);

    const prevFocus = useCallback(() => {
        if (containerRef.current) {
            const elements = containerRef.current.querySelectorAll('[data-focusable="true"]');
            const prevIndex = focusedIndex <= 0 ? elements.length - 1 : focusedIndex - 1;
            setFocusedIndex(prevIndex);
            focusElement(prevIndex);
        }
    }, [focusedIndex, focusElement]);

    return {
        focusedIndex,
        setFocusedIndex,
        containerRef,
        focusElement,
        nextFocus,
        prevFocus
    };
}

// Dynamic height calculation hook
export function useDynamicHeight() {
    const [heights, setHeights] = useState<Map<string, number>>(new Map());
    const observerRef = useRef<ResizeObserver | null>(null);

    const measureElement = useCallback((id: string, element: HTMLElement) => {
        if (element) {
            const height = element.offsetHeight;
            setHeights(prev => {
                const newMap = new Map(prev);
                newMap.set(id, height);
                return newMap;
            });
        }
    }, []);

    const observeElement = useCallback((id: string, element: HTMLElement) => {
        if (!observerRef.current) {
            observerRef.current = new ResizeObserver((entries) => {
                entries.forEach((entry) => {
                    const elementId = entry.target.getAttribute('data-element-id');
                    if (elementId) {
                        measureElement(elementId, entry.target as HTMLElement);
                    }
                });
            });
        }

        element.setAttribute('data-element-id', id);
        observerRef.current.observe(element);
    }, [measureElement]);

    const unobserveElement = useCallback((element: HTMLElement) => {
        if (observerRef.current) {
            observerRef.current.unobserve(element);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return {
        heights,
        measureElement,
        observeElement,
        unobserveElement
    };
}

// Enhanced scroll behavior hook
export function useScrollBehavior() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback((smooth = true) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'instant'
            });
        }
    }, []);

    const scrollToElement = useCallback((elementId: string, smooth = true) => {
        if (scrollRef.current) {
            const element = scrollRef.current.querySelector(`[data-element-id="${elementId}"]`);
            if (element) {
                element.scrollIntoView({
                    behavior: smooth ? 'smooth' : 'instant',
                    block: 'center'
                });
            }
        }
    }, []);

    const scrollToTop = useCallback((smooth = true) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: 0,
                behavior: smooth ? 'smooth' : 'instant'
            });
        }
    }, []);

    return {
        scrollRef,
        scrollToBottom,
        scrollToElement,
        scrollToTop
    };
}

// Memory leak prevention hook
export function useMemoryLeakPrevention() {
    const cleanupFunctions = useRef<(() => void)[]>([]);

    const addCleanup = useCallback((cleanup: () => void) => {
        cleanupFunctions.current.push(cleanup);
    }, []);

    const removeCleanup = useCallback((cleanup: () => void) => {
        cleanupFunctions.current = cleanupFunctions.current.filter(fn => fn !== cleanup);
    }, []);

    useEffect(() => {
        return () => {
            // Run all cleanup functions on unmount
            cleanupFunctions.current.forEach(cleanup => {
                try {
                    cleanup();
                } catch (error) {
                    console.warn('Cleanup function error:', error);
                }
            });
            cleanupFunctions.current = [];
        };
    }, []);

    return {
        addCleanup,
        removeCleanup
    };
}
