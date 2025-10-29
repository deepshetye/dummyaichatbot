'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSearchQuestions } from '@/lib/hooks';
import { debounce } from '@/lib/utils';
import { SearchResult } from '@/lib/types';
import { useFocusManagement } from '@/lib/hooks-dom';

interface SearchAutocompleteProps {
    onSelectQuestion: (questionId: string) => void;
    placeholder?: string;
}

export function SearchAutocomplete({
    onSelectQuestion,
    placeholder = "Search questions..."
}: SearchAutocompleteProps) {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Enhanced focus management
    const { containerRef, nextFocus, prevFocus } = useFocusManagement();

    const { data: searchResults = [], isLoading } = useSearchQuestions(debouncedQuery);

    const debouncedSearch = debounce((value: string) => {
        setDebouncedQuery(value);
    }, 300);

    useEffect(() => {
        debouncedSearch(query);
    }, [query, debouncedSearch]);

    useEffect(() => {
        if (query.length > 0) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
            setSelectedIndex(-1);
        }
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || searchResults.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < searchResults.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : searchResults.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
                    handleSelectQuestion(searchResults[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                inputRef.current?.blur();
                break;
            case 'Tab':
                // Enhanced tab navigation
                if (e.shiftKey) {
                    prevFocus();
                } else {
                    nextFocus();
                }
                break;
        }
    };

    const handleSelectQuestion = (result: SearchResult) => {
        setQuery('');
        setIsOpen(false);
        setSelectedIndex(-1);
        onSelectQuestion(result.id);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setSelectedIndex(-1);
    };

    return (
        <div className="relative w-full max-w-2xl">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length > 0 && setIsOpen(true)}
                    className="pl-12 pr-12 py-4 w-full rounded-2xl border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base"
                />
                {isOpen && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setIsOpen(false)}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-3 max-h-72 overflow-y-auto z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-xl"
                >
                    {isLoading ? (
                        <div className="p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Searching...</span>
                            </div>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="py-2">
                            {searchResults.map((result, index) => (
                                <div
                                    key={result.id}
                                    className={`px-5 py-4 cursor-pointer transition-all duration-200 group ${index === selectedIndex
                                        ? 'bg-blue-50 dark:bg-blue-900/10'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}
                                    onClick={() => handleSelectQuestion(result)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 transition-colors duration-200 ${index === selectedIndex
                                            ? 'bg-blue-500'
                                            : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400'
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <div
                                                className="text-md font-medium text-left text-gray-900 dark:text-gray-100 leading-relaxed mb-2"
                                                dangerouslySetInnerHTML={{ __html: result.highlightedTitle }}
                                            />
                                            <div className="flex items-center space-x-2">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                    {result.category}
                                                </span>
                                                <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                                    Question
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : query.length > 0 ? (
                        <div className="p-8">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                    <Search className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">No results found</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        Try a different search term
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
