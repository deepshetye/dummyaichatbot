'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Comment } from '@/lib/types';

interface VirtualScrollProps {
    items: Comment[];
    itemHeight: number;
    containerHeight: number;
    renderItem: (item: Comment, index: number) => React.ReactNode;
    overscan?: number;
}

export function VirtualScroll({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    overscan = 5,
}: VirtualScrollProps) {
    const [scrollTop, setScrollTop] = useState(0);
    const scrollElementRef = useRef<HTMLDivElement>(null);

    const visibleRange = useMemo(() => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const endIndex = Math.min(
            items.length - 1,
            Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
        );
        return { startIndex, endIndex };
    }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

    const visibleItems = useMemo(() => {
        return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
    }, [items, visibleRange]);

    const totalHeight = items.length * itemHeight;
    const offsetY = visibleRange.startIndex * itemHeight;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    };

    return (
        <div
            ref={scrollElementRef}
            style={{ height: containerHeight, overflow: 'auto' }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div
                    style={{
                        transform: `translateY(${offsetY}px)`,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                    }}
                >
                    {visibleItems.map((item, index) => (
                        <div
                            key={item.id}
                            style={{ height: itemHeight }}
                        >
                            {renderItem(item, visibleRange.startIndex + index)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
