import { useState, useCallback, useMemo, useEffect } from 'react';
import { CommunityPost } from '@/types/community';
import { useCommunity } from '@/hooks/useCommunity';
import { useFriends } from '@/hooks/useFriends';
import { useToast } from '@/components/ui/ToastProvider';

type FeedTab = 'global' | 'friends';

export function useCommunityUI() {
    const toast = useToast();
    const { posts, toggleLike, isLoggedIn, currentUserId } = useCommunity();
    const { friendUserIds, sendFriendRequest, outgoingRequests, cancelFriendRequest } = useFriends();
    
    const [commentReviewId, setCommentReviewId] = useState<string | null>(null);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [pendingCancelInfo, setPendingCancelInfo] = useState<{ id: string; name: string } | null>(null);
    const [isCanceling, setIsCanceling] = useState(false);
    const [feedTab, setFeedTab] = useState<FeedTab>('global');
    const [sharingPost, setSharingPost] = useState<CommunityPost | null>(null);
    const [selectedFullImage, setSelectedFullImage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    const ITEMS_PER_PAGE = 10;

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1200);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [feedTab]);

    const displayPosts = useMemo(() => {
        if (feedTab === 'friends') {
            return posts.filter((p) => friendUserIds.includes(p.userId));
        }
        return posts;
    }, [posts, feedTab, friendUserIds]);

    const totalItems = displayPosts.length;
    
    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return displayPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [displayPosts, currentPage]);

    const handleLike = useCallback(async (reviewId: string) => {
        if (!isLoggedIn) {
            toast.info('Login Required', 'Please log in to like posts!');
            return;
        }
        try {
            await toggleLike(reviewId);
        } catch (err) {
            toast.error('Error', 'Failed to update like.');
        }
    }, [isLoggedIn, toggleLike, toast]);

    const handleComment = useCallback((reviewId: string) => {
        if (!isLoggedIn) {
            toast.info('Login Required', 'Please log in to comment!');
            return;
        }
        setCommentReviewId(reviewId);
    }, [isLoggedIn, toast]);

    const handleShare = useCallback((item: CommunityPost) => {
        setSharingPost(item);
    }, []);

    const handleImagePress = useCallback((uri: string) => {
        setSelectedFullImage(uri);
    }, []);

    const handleAddFriend = useCallback(async (post: CommunityPost) => {
        if (!isLoggedIn) {
            toast.info('Login Required', 'Please log in to add friends!');
            return;
        }
        try {
            await sendFriendRequest(post.userId, post.userName, post.userAvatar);
            toast.success('Request Sent!', `Friend request sent to ${post.userName}`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '';
            if (message === 'Friend request already exists') {
                toast.info('Already Sent', 'You already sent a request to this person');
            } else {
                console.error('[Community] Add friend error:', err);
                toast.error('Error', message || 'Failed to send friend request');
            }
        }
    }, [isLoggedIn, sendFriendRequest, toast]);

    const handleCancelPress = useCallback((post: CommunityPost) => {
        const request = outgoingRequests.find(r => r.requesteeId === post.userId);
        if (request) {
            setPendingCancelInfo({ id: request.id, name: post.userName });
            setCancelModalVisible(true);
        }
    }, [outgoingRequests]);

    const handleConfirmCancel = useCallback(async () => {
        if (!pendingCancelInfo) return;
        setIsCanceling(true);
        try {
            await cancelFriendRequest(pendingCancelInfo.id);
            toast.success('Canceled', `Friend request to ${pendingCancelInfo.name} canceled`);
            setCancelModalVisible(false);
        } catch (err) {
            console.error('[Community] Cancel friend error:', err);
            toast.error('Error', 'Failed to cancel request');
        } finally {
            setIsCanceling(false);
            setPendingCancelInfo(null);
        }
    }, [pendingCancelInfo, cancelFriendRequest, toast]);

    return {
        feedTab, setFeedTab,
        commentReviewId, setCommentReviewId,
        cancelModalVisible, setCancelModalVisible,
        infoModalVisible, setInfoModalVisible,
        pendingCancelInfo, isCanceling,
        sharingPost, setSharingPost,
        selectedFullImage, setSelectedFullImage,
        currentPage, setCurrentPage,
        refreshing, onRefresh,
        paginatedPosts, totalItems, ITEMS_PER_PAGE,
        displayPosts,
        handleLike, handleComment, handleShare, handleImagePress,
        handleAddFriend, handleCancelPress, handleConfirmCancel
    };
}
