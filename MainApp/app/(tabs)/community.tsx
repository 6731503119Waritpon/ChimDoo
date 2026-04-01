import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Platform,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { UsersRound, Globe, Users, Info, CircleHelp } from 'lucide-react-native';
import { CommunityPost } from '@/types/community';
import { useCommunity } from '@/hooks/useCommunity';
import { useFriends } from '@/hooks/useFriends';
import { useToast } from '@/components/ToastProvider';
import CommentModal from '@/components/CommentModal';
import GuestState from '@/components/GuestState';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SkeletonPostCard from '@/components/SkeletonPostCard';
import ConfirmCancelModal from '@/components/ConfirmCancelModal';
import CommunityInfoModal from '@/components/CommunityInfoModal';
import SharePostModal from '@/components/SharePostModal';
import ImageFullscreenModal from '@/components/ImageFullscreenModal';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

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
    const activeIndex = useSharedValue(0);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1200);
    }, []);

    useEffect(() => {
        activeIndex.value = withTiming(feedTab === 'global' ? 0 : 1, {
            duration: 300,
        });
        setCurrentPage(1);
    }, [feedTab]);

    const globalTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(activeIndex.value, [0, 1], [1, 0.45], 'clamp');
        const scale = interpolate(activeIndex.value, [0, 1], [1.1, 0.95], 'clamp');
        return { opacity, transform: [{ scale }] };
    });

    const friendsTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(activeIndex.value, [0, 1], [0.45, 1], 'clamp');
        const scale = interpolate(activeIndex.value, [0, 1], [0.95, 1.1], 'clamp');
        return { opacity, transform: [{ scale }] };
    });

    const indicatorStyle = useAnimatedStyle(() => {
        const left = interpolate(activeIndex.value, [0, 1], [0, 50], 'clamp');
        return {
            left: `${left + 15}%`,
            width: '25%',
        };
    });

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
        } catch (err: any) {
            if (err.message === 'Friend request already exists') {
                toast.info('Already Sent', 'You already sent a request to this person');
            } else {
                console.error('[Community] Add friend error:', err);
                toast.error('Error', err?.message || 'Failed to send friend request');
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
                <View style={styles.liquidContainer}>
                    <View style={styles.liquidTab}><Text style={styles.liquidText}>Global</Text></View>
                    <View style={styles.liquidTab}><Text style={styles.liquidText}>Friends</Text></View>
                </View>
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

                <View style={styles.liquidContainer}>
                    <TouchableOpacity
                        style={styles.liquidTab}
                        onPress={() => setFeedTab('global')}
                        activeOpacity={0.6}
                    >
                        <Animated.View style={[styles.tabInner, globalTextStyle]}>
                            <Globe
                                size={20}
                                color={AppColors.navy}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={styles.liquidText}>Global</Text>
                        </Animated.View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.liquidTab}
                        onPress={() => setFeedTab('friends')}
                        activeOpacity={0.6}
                    >
                        <Animated.View style={[styles.tabInner, friendsTextStyle]}>
                            <Users
                                size={20}
                                color={AppColors.navy}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={styles.liquidText}>Friends</Text>
                        </Animated.View>
                    </TouchableOpacity>

                    <Animated.View style={[styles.liquidIndicator, indicatorStyle]} />
                </View>

                {displayPosts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        {feedTab === 'friends' ? (
                            <>
                                <Users size={48} color={AppColors.navy} />
                                <Text style={styles.emptyTitle}>No Friend Posts</Text>
                                <Text style={styles.emptySubtitle}>
                                    Add friends from the Global feed to see their posts here!
                                </Text>
                            </>
                        ) : (
                            <>
                                <Info size={48} color={AppColors.navy} />
                                <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                                <Text style={styles.emptySubtitle}>
                                    Be the first to share your food experience! Go to a recipe, tap "Chim Doo", then write a review.
                                </Text>
                            </>
                        )}
                    </View>
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
    loadingContainer: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        color: '#888',
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
        color: '#888',
        marginTop: 2,
    },

    liquidContainer: {
        flexDirection: 'row',
        marginHorizontal: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 24,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(29, 53, 87, 0.08)',
        marginBottom: 16,
        position: 'relative',
        height: 56,
        alignItems: 'center',
    },
    liquidTab: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    liquidText: {
        fontFamily: AppFonts.bold,
        fontSize: 15,
        color: AppColors.navy,
    },
    liquidIndicator: {
        position: 'absolute',
        bottom: 8,
        height: 4,
        backgroundColor: AppColors.primary,
        borderRadius: 2,
        shadowColor: AppColors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        lineHeight: 22,
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