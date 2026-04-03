import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Platform,
    RefreshControl,
} from 'react-native';
import { UsersRound, CircleHelp } from 'lucide-react-native';
import { CommunityPost } from '@/types/community';
import { useCommunity } from '@/hooks/useCommunity';
import { useFriends } from '@/hooks/useFriends';
import { useToast } from '@/components/ui/ToastProvider';
import CommentModal from '@/components/modals/CommentModal';
import GuestState from '@/components/ui/GuestState';
import PostCard from '@/components/cards/PostCard';
import Pagination from '@/components/ui/Pagination';
import SkeletonPostCard from '@/components/ui/SkeletonPostCard';
import ConfirmCancelModal from '@/components/modals/ConfirmCancelModal';
import CommunityInfoModal from '@/components/modals/CommunityInfoModal';
import SharePostModal from '@/components/modals/SharePostModal';
import ImageFullscreenModal from '@/components/modals/ImageFullscreenModal';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

import { FeedTabBar } from '@/modules/community/components/FeedTabBar';
import { EmptyFeedState } from '@/modules/community/components/EmptyFeedState';

type FeedTab = 'global' | 'friends';

const Page = () => {
    const toast = useToast();
    const { posts, loading, toggleLike, isLoggedIn, currentUserId } = useCommunity();
    const { friendUserIds, getFriendStatus, sendFriendRequest, outgoingRequests, cancelFriendRequest } = useFriends();
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

    const handleLike = async (reviewId: string) => {
        if (!isLoggedIn) {
            toast.info('Login Required', 'Please log in to like posts!');
            return;
        }
        try {
            await toggleLike(reviewId);
        } catch (err) {
            toast.error('Error', 'Failed to update like.');
        }
    };

    const handleComment = (reviewId: string) => {
        if (!isLoggedIn) {
            toast.info('Login Required', 'Please log in to comment!');
            return;
        }
        setCommentReviewId(reviewId);
    };

    const handleShare = (item: CommunityPost) => {
        setSharingPost(item);
    };

    const handleImagePress = (uri: string) => {
        setSelectedFullImage(uri);
    };

    const handleAddFriend = async (post: CommunityPost) => {
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
    };

    const handleCancelPress = (post: CommunityPost) => {
        const request = outgoingRequests.find(r => r.requesteeId === post.userId);
        if (request) {
            setPendingCancelInfo({ id: request.id, name: post.userName });
            setCancelModalVisible(true);
        }
    };

    const handleConfirmCancel = async () => {
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
    };

    if (!isLoggedIn) {
        return (
            <GuestState
                icon={UsersRound}
                title="Community"
                subtitle="Sign in to see reviews, share your food experiences, and connect with other food lovers!"
            />
        );
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={styles.headerTitle}>Community</Text>
                            <CircleHelp size={28} color={AppColors.navy} />
                        </View>
                        <Text style={styles.headerSubtitle}>
                            See what others are cooking
                        </Text>
                    </View>
                </View>
                <FeedTabBar feedTab={feedTab} setFeedTab={setFeedTab} />
                <FlatList
                    data={[1, 2, 3]}
                    keyExtractor={(i) => i.toString()}
                    renderItem={() => <SkeletonPostCard />}
                    contentContainerStyle={styles.feedContent}
                />
            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={styles.headerTitle}>Community</Text>
                            <TouchableOpacity
                                onPress={() => setInfoModalVisible(true)}
                                activeOpacity={0.6}
                                style={{ paddingTop: 6 }}
                            >
                                <CircleHelp size={28} color={AppColors.navy} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.headerSubtitle}>
                            See what others are cooking
                        </Text>
                    </View>
                </View>

                <FeedTabBar feedTab={feedTab} setFeedTab={setFeedTab} />

                {displayPosts.length === 0 ? (
                    <EmptyFeedState feedTab={feedTab} />
                ) : (
                    <FlatList
                        data={paginatedPosts}
                        refreshControl={
                            <RefreshControl 
                                refreshing={refreshing} 
                                onRefresh={onRefresh} 
                                colors={[AppColors.primary]} 
                                tintColor={AppColors.primary} 
                            />
                        }
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <PostCard
                                item={item}
                                onLike={() => handleLike(item.id)}
                                onComment={() => handleComment(item.id)}
                                onShare={() => handleShare(item)}
                                onImagePress={handleImagePress}
                                isLiked={!!(currentUserId && item.likedBy?.includes(currentUserId))}
                                onAddFriend={() => handleAddFriend(item)}
                                friendStatus={getFriendStatus(item.userId)}
                                onCancelFriend={() => handleCancelPress(item)}
                                isOwnPost={item.userId === currentUserId}
                            />
                        )}
                        contentContainerStyle={styles.feedContent}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListFooterComponent={
                            totalItems > 0 ? (
                                <View style={styles.paginationWrapper}>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalItems={totalItems}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                        onPageChange={(page) => setCurrentPage(page)}
                                    />
                                </View>
                            ) : null
                        }
                    />
                )}

                <CommentModal
                    visible={!!commentReviewId}
                    reviewId={commentReviewId || ''}
                    onClose={() => setCommentReviewId(null)}
                />

                <ConfirmCancelModal
                    visible={cancelModalVisible}
                    onClose={() => setCancelModalVisible(false)}
                    onConfirm={handleConfirmCancel}
                    userName={pendingCancelInfo?.name || ''}
                    loading={isCanceling}
                />

                <CommunityInfoModal
                    visible={infoModalVisible}
                    onClose={() => setInfoModalVisible(false)}
                />

                <SharePostModal
                    visible={!!sharingPost}
                    item={sharingPost}
                    onClose={() => setSharingPost(null)}
                />

                <ImageFullscreenModal
                    visible={!!selectedFullImage}
                    imageUri={selectedFullImage}
                    onClose={() => setSelectedFullImage(null)}
                />
            </View>
        </>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 64 : 48,
        paddingHorizontal: 24,
        paddingBottom: 12,
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 32,
        color: AppColors.navy,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: AppColors.textLight,
        marginTop: 2,
    },

    feedContent: {
        paddingTop: 8,
        paddingBottom: 160,
    },
    separator: {
        height: 10,
    },
    paginationWrapper: {
        marginTop: 6,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
});