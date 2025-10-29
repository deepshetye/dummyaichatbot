export interface Question {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    createdAt: string;
}

export interface Comment {
    id: string;
    content: string;
    author: string;
    createdAt: string;
    votes: number;
    parentId?: string;
    replies: Comment[];
    isEditing?: boolean;
}

export interface ChatMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    questionId?: string;
    timestamp: string;
}

export interface SearchResult {
    id: string;
    title: string;
    category: string;
    highlightedTitle: string;
}
