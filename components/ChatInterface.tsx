'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useQuestion } from '@/lib/hooks';
import { ChatMessage } from '@/lib/types';
import { generateId, formatDate, getInitials } from '@/lib/utils';
import { CommentSystem } from './CommentSystem';
import { useScrollBehavior, useMemoryLeakPrevention } from '@/lib/hooks-dom';
import { useStickyHeader } from '@/lib/hooks-core';

interface ChatInterfaceProps {
    selectedQuestionId: string | null;
    onQuestionSelect: (questionId: string) => void;
}

export function ChatInterface({ selectedQuestionId, onQuestionSelect }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(selectedQuestionId);

    // Enhanced scroll behavior and memory leak prevention
    const { scrollRef, scrollToBottom, scrollToElement } = useScrollBehavior();
    const { addCleanup } = useMemoryLeakPrevention();

    // Sticky header functionality
    const stickyHeader = useStickyHeader();

    const { data: question } = useQuestion(currentQuestionId);

    useEffect(() => {
        if (currentQuestionId && question) {
            // Add user message
            const userMessage: ChatMessage = {
                id: generateId(),
                type: 'user',
                content: question.title,
                questionId: question.id,
                timestamp: new Date().toISOString()
            };

            // Add assistant response
            const assistantMessage: ChatMessage = {
                id: generateId(),
                type: 'assistant',
                content: question.content,
                questionId: question.id,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, userMessage, assistantMessage]);

            // Enhanced scroll behavior for new messages
            setTimeout(() => {
                scrollToBottom(true);
            }, 100);
        }
    }, [currentQuestionId, question]);

    // Update currentQuestionId when selectedQuestionId changes
    useEffect(() => {
        setCurrentQuestionId(selectedQuestionId);
    }, [selectedQuestionId]);

    return (
        <div className="flex flex-col min-h-[60vh] bg-white dark:bg-gray-800">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-blue-600" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        AI Chat Assistant
                    </h1>
                </div>
            </div>

            {/* Sticky Header */}
            {stickyHeader && (
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Currently viewing: {stickyHeader}
                        </span>
                    </div>
                </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-hidden min-h-[280px]">
                <ScrollArea ref={scrollRef} className="h-full">
                    <div className="p-6 space-y-6">
                        {messages.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-6">
                                    <Bot className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                                    Welcome to AI Chat
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                    Search for a question to get started
                                </p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    data-message-id={message.id}
                                    data-question-id={message.questionId}
                                    className={`flex space-x-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    {message.type === 'assistant' && (
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                <Bot className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div
                                        className={`max-w-3xl ${message.type === 'user' ? 'order-first' : ''
                                            }`}
                                    >
                                        <Card className={`p-6 ${message.type === 'user'
                                            ? 'bg-blue-600 text-white border-0'
                                            : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                                            }`}>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    {message.type === 'user' && (
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarFallback className="bg-white text-blue-600 text-xs">
                                                                <User className="h-3 w-3" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    <span className={`text-sm font-medium ${message.type === 'user' ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                                                        }`}>
                                                        {message.type === 'user' ? 'You' : 'AI Assistant'}
                                                    </span>
                                                    <span className={`text-xs ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                                        }`}>
                                                        {formatDate(message.timestamp)}
                                                    </span>
                                                </div>

                                                <div className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {message.content}
                                                </div>

                                                {message.questionId && (
                                                    <div className="mt-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className={`text-xs ${message.type === 'user'
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-gray-100 dark:bg-gray-700'
                                                                }`}
                                                        >
                                                            Question ID: {message.questionId}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>

                                    {message.type === 'user' && (
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Comments Section */}
            {currentQuestionId && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                    <CommentSystem questionId={currentQuestionId} />
                </div>
            )}
        </div>
    );
}
