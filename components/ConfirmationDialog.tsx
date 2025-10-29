'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationDialog({
    isOpen,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}: ConfirmationDialogProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
            confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
            border: 'border-red-200 dark:border-red-800',
            background: 'bg-red-50 dark:bg-red-900/20'
        },
        warning: {
            icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
            confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
            border: 'border-yellow-200 dark:border-yellow-800',
            background: 'bg-yellow-50 dark:bg-yellow-900/20'
        },
        info: {
            icon: <AlertTriangle className="h-6 w-6 text-blue-600" />,
            confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
            border: 'border-blue-200 dark:border-blue-800',
            background: 'bg-blue-50 dark:bg-blue-900/20'
        }
    };

    const styles = variantStyles[variant];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className={`w-full max-w-md mx-4 ${styles.border} ${styles.background}`}>
                <div className="p-6">
                    <div className="flex items-start space-x-3">
                        {styles.icon}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Confirm Action
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                {message}
                            </p>
                            <div className="flex space-x-3">
                                <Button
                                    onClick={onConfirm}
                                    className={`${styles.confirmButton} flex-1`}
                                >
                                    {confirmText}
                                </Button>
                                <Button
                                    onClick={onCancel}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    {cancelText}
                                </Button>
                            </div>
                        </div>
                        <Button
                            onClick={onCancel}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
