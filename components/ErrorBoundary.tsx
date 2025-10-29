'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo
        });

        // Call the onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Log error for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-red-600 dark:text-red-300 mb-4">
                        We're sorry, but something unexpected happened. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details className="mt-4">
                            <summary className="cursor-pointer text-sm text-red-600 dark:text-red-300">
                                Error Details (Development)
                            </summary>
                            <pre className="mt-2 text-xs text-red-600 dark:text-red-300 overflow-auto">
                                {this.state.error.toString()}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

// Hydration error boundary specifically for hydration mismatches
export class HydrationErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Only catch hydration errors
        if (error.message.includes('hydration') || error.message.includes('Hydration')) {
            return { hasError: true, error };
        }
        return { hasError: false };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (error.message.includes('hydration') || error.message.includes('Hydration')) {
            this.setState({ error, errorInfo });
            console.warn('Hydration mismatch detected, gracefully handling:', error);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                        Loading interactive features...
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}
