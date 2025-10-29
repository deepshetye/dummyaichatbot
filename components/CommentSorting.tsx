'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SortOption } from '@/lib/hooks-sorting';

interface CommentSortingProps {
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
}

export function CommentSorting({ sortBy, onSortChange }: CommentSortingProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'mostVoted', label: 'Most Voted' }
    ];

    const currentOption = sortOptions.find(option => option.value === sortBy);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
            </span>
            <div className="relative" ref={dropdownRef}>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-32 justify-between"
                >
                    {currentOption?.label}
                    <ChevronDown className="h-4 w-4" />
                </Button>

                {isOpen && (
                    <Card className="absolute top-full right-0 mt-1 w-32 z-10 shadow-lg">
                        <div className="py-1">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onSortChange(option.value as SortOption);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${sortBy === option.value ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
