'use client';

import { useState, useEffect } from 'react';
import { ErrorBoundary, HydrationErrorBoundary } from './ErrorBoundary';

interface ProgressiveEnhancementProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    enableJavaScript?: boolean;
}

export function ProgressiveEnhancement({
    children,
    fallback,
    enableJavaScript = true
}: ProgressiveEnhancementProps) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [hasJavaScript, setHasJavaScript] = useState(false);

    useEffect(() => {
        // Check if JavaScript is enabled
        setHasJavaScript(true);
        setIsHydrated(true);
    }, []);

    // If JavaScript is disabled, show fallback
    if (!hasJavaScript && !enableJavaScript) {
        return <>{fallback || children}</>;
    }

    // If not hydrated yet, show fallback
    if (!isHydrated) {
        return <>{fallback || children}</>;
    }

    return (
        <HydrationErrorBoundary>
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </HydrationErrorBoundary>
    );
}

// Hook to check if component is hydrated
export function useIsHydrated() {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return isHydrated;
}

// Hook to check if JavaScript is enabled
export function useHasJavaScript() {
    const [hasJavaScript, setHasJavaScript] = useState(false);

    useEffect(() => {
        setHasJavaScript(true);
    }, []);

    return hasJavaScript;
}
