'use client';

import { useState, useCallback, useMemo, memo, useRef, useEffect } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Edit2, Trash2, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Comment } from '@/lib/types';
import { generateId, formatDate, getInitials } from '@/lib/utils';
import { useLazyLoad } from '@/lib/hooks-intersection';
import { useDynamicHeight, useMemoryLeakPrevention } from '@/lib/hooks-dom';
import { VirtualScroll } from './VirtualScroll';
import { useVotePersistence, useConfirmationDialog } from '@/lib/hooks-core';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useCommentSorting } from '@/lib/hooks-sorting';
import { CommentSorting } from './CommentSorting';

interface CommentItemProps {
    comment: Comment;
    onEdit: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    onReply: (parentId: string, content: string) => void;
    onVote: (id: string, delta: number) => void;
    level?: number;
}

export const CommentItem = memo(function CommentItem({
    comment,
    onEdit,
    onDelete,
    onReply,
    onVote,
    level = 0
}: CommentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [replyContent, setReplyContent] = useState('');

    const maxLevel = 4;
    const canReply = level < maxLevel;

    // Dynamic height calculation for comment threads
    const commentRef = useRef<HTMLDivElement>(null);
    const { observeElement, unobserveElement } = useDynamicHeight();

    // Memory leak prevention
    const { addCleanup } = useMemoryLeakPrevention();

    // Vote persistence with browser storage
    const { votes, hasVoted, handleVote } = useVotePersistence(comment.id, comment.votes);

    // Confirmation dialog for deletions
    const { isOpen, message, showConfirmation, handleConfirm, handleCancel } = useConfirmationDialog();

    const handleEdit = useCallback(() => {
        if (editContent.trim()) {
            onEdit(comment.id, editContent.trim());
            setIsEditing(false);
        }
    }, [editContent, comment.id, onEdit]);

    const handleReply = useCallback(() => {
        if (replyContent.trim()) {
            onReply(comment.id, replyContent.trim());
            setReplyContent('');
            setIsReplying(false);
        }
    }, [replyContent, comment.id, onReply]);

    const handleVoteClick = useCallback((delta: number) => {
        if (!hasVoted) {
            handleVote(delta);
            onVote(comment.id, delta);
        }
    }, [hasVoted, handleVote, onVote, comment.id]);

    const handleDeleteClick = useCallback(() => {
        showConfirmation(
            'Are you sure you want to delete this comment? This action cannot be undone.',
            () => onDelete(comment.id)
        );
    }, [showConfirmation, onDelete, comment.id]);

    // Set up dynamic height observation
    useEffect(() => {
        if (commentRef.current) {
            observeElement(comment.id, commentRef.current);

            const cleanup = () => {
                if (commentRef.current) {
                    unobserveElement(commentRef.current);
                }
            };

            addCleanup(cleanup);
        }
    }, [comment.id, observeElement, unobserveElement, addCleanup]);

    return (
        <div
            ref={commentRef}
            className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-6' : ''}`}
            data-element-id={comment.id}
        >
            <Card className="p-6 mb-4 card-hover border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                            {getInitials(comment.author)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {comment.author}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(comment.createdAt)}
                            </span>
                        </div>

                        {isEditing ? (
                            <div className="space-y-2">
                                <Textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="min-h-[80px]"
                                    placeholder="Edit your comment..."
                                />
                                <div className="flex space-x-2">
                                    <Button size="sm" onClick={handleEdit}>
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditContent(comment.content);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                {comment.content}
                            </div>
                        )}

                        {!isEditing && (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleVoteClick(1)}
                                        className={`h-8 w-8 p-0 ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={hasVoted}
                                    >
                                        <ThumbsUp className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[20px] text-center">
                                        {votes}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleVoteClick(-1)}
                                        className={`h-8 w-8 p-0 ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={hasVoted}
                                    >
                                        <ThumbsDown className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setIsEditing(true)}
                                        className="h-8 px-3 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                    >
                                        <Edit2 className="h-3 w-3 mr-1" />
                                        Edit
                                    </Button>

                                    {canReply && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setIsReplying(true)}
                                            className="h-8 px-3 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                        >
                                            <Reply className="h-3 w-3 mr-1" />
                                            Reply
                                        </Button>
                                    )}

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleDeleteClick}
                                        className="h-8 px-3 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isReplying && (
                            <div className="mt-6 space-y-3">
                                <Textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="min-h-[100px] border-0 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Write a reply..."
                                />
                                <div className="flex space-x-3">
                                    <Button
                                        size="sm"
                                        onClick={handleReply}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                    >
                                        Reply
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setIsReplying(false);
                                            setReplyContent('');
                                        }}
                                        className="px-4 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Render replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-2">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onReply={onReply}
                            onVote={onVote}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={isOpen}
                message={message}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </div>
    );
});

// Lazy loaded comment item
function LazyCommentItem(props: CommentItemProps) {
    const { ref, hasIntersected } = useLazyLoad();

    return (
        <div ref={ref}>
            {hasIntersected ? <CommentItem {...props} /> : <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />}
        </div>
    );
}

interface CommentSystemProps {
    questionId: string;
}

export const CommentSystem = memo(function CommentSystem({ questionId }: CommentSystemProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');

    // Memory leak prevention
    const { addCleanup } = useMemoryLeakPrevention();

    // Comment sorting functionality
    const { sortBy, sortedComments, handleSortChange } = useCommentSorting(comments);

    // Virtual scrolling for large comment lists
    const shouldUseVirtualScrolling = sortedComments.length > 50;
    const ITEM_HEIGHT = 120; // Approximate height per comment
    const CONTAINER_HEIGHT = 400; // Max height for comment container

    const handleAddComment = useCallback(() => {
        if (newComment.trim()) {
            const comment: Comment = {
                id: generateId(),
                content: newComment.trim(),
                author: 'Anonymous User',
                createdAt: new Date().toISOString(),
                votes: 0,
                replies: []
            };

            setComments(prev => [comment, ...prev]);
            setNewComment('');
        }
    }, [newComment]);

    const handleEditComment = useCallback((id: string, content: string) => {
        setComments(prev =>
            prev.map(comment =>
                comment.id === id ? { ...comment, content } : comment
            )
        );
    }, []);

    // Recursively remove a comment by id from the nested tree
    const removeCommentById = useCallback((list: Comment[], targetId: string): Comment[] => {
        return list
            .filter((c) => c.id !== targetId)
            .map((c) => ({
                ...c,
                replies: c.replies && c.replies.length > 0 ? removeCommentById(c.replies, targetId) : [],
            }));
    }, []);

    const handleDeleteComment = useCallback((id: string) => {
        setComments((prev) => removeCommentById(prev, id));
    }, [removeCommentById]);

    const handleReplyToComment = useCallback((parentId: string, content: string) => {
        const reply: Comment = {
            id: generateId(),
            content,
            author: 'Anonymous User',
            createdAt: new Date().toISOString(),
            votes: 0,
            parentId,
            replies: []
        };

        setComments(prev =>
            prev.map(comment =>
                comment.id === parentId
                    ? { ...comment, replies: [...comment.replies, reply] }
                    : comment
            )
        );
    }, []);

    const handleVote = useCallback((id: string, delta: number) => {
        setComments(prev =>
            prev.map(comment =>
                comment.id === id
                    ? { ...comment, votes: comment.votes + delta }
                    : comment
            )
        );
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Comments ({comments.length})
                    </h3>
                </div>
                <CommentSorting sortBy={sortBy} onSortChange={handleSortChange} />
            </div>

            {/* Add new comment */}
            <Card className="p-6 border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="min-h-[120px] border-0 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            Add Comment
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Comments list */}
            <div className="space-y-4">
                {shouldUseVirtualScrolling ? (
                    <VirtualScroll
                        items={sortedComments}
                        itemHeight={ITEM_HEIGHT}
                        containerHeight={CONTAINER_HEIGHT}
                        renderItem={(comment, index) => (
                            <LazyCommentItem
                                key={comment.id}
                                comment={comment}
                                onEdit={handleEditComment}
                                onDelete={handleDeleteComment}
                                onReply={handleReplyToComment}
                                onVote={handleVote}
                            />
                        )}
                    />
                ) : (
                    sortedComments.map((comment) => (
                        <LazyCommentItem
                            key={comment.id}
                            comment={comment}
                            onEdit={handleEditComment}
                            onDelete={handleDeleteComment}
                            onReply={handleReplyToComment}
                            onVote={handleVote}
                        />
                    ))
                )}

                {comments.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="h-8 w-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            No comments yet
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400">
                            Be the first to share your thoughts!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
});
