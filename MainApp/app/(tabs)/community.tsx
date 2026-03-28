import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Heart, MessageCircle, Share2, UsersRound, UserPlus, UserCheck, Clock, Globe, Users, Info } from 'lucide-react-native';
import { CommunityPost } from '@/types/community';
import { useCommunity } from '@/hooks/useCommunity';
import { useFriends } from '@/hooks/useFriends';
import { useToast } from '@/components/ToastProvider';
import CommentModal from '@/components/CommentModal';
import GuestState from '@/components/GuestState';
import PostCard from '@/components/PostCard';
import { sharePost } from '@/utils/sharePost';
import { AppColors } from '@/constants/colors';



type FeedTab = 'global' | 'friends';

const Page = () => {
    const toast = useToast();
    const { posts, loading, toggleLike, isLoggedIn, currentUserId } = useCommunity();
    const { friendUserIds, getFriendStatus, sendFriendRequest } = useFriends();
    const [commentReviewId, setCommentReviewId] = useState<string | null>(null);
    const [feedTab, setFeedTab] = useState<FeedTab>('global');

    const displayPosts = useMemo(() => {
        if (feedTab === 'friends') {
            return posts.filter((p) => friendUserIds.includes(p.userId));
        }
        return posts;
    }, [posts, feedTab, friendUserIds]);

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
        sharePost(item.foodName, item.description);
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={AppColors.primary} />
            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Community</Text>
                        <Text style={styles.headerSubtitle}>
                            See what others are cooking
                        </Text>
                    </View>
                </View>

                <View style={styles.feedTabsContainer}>
                    <TouchableOpacity
                        style={[styles.feedTab, feedTab === 'global' && styles.feedTabActive]}
                        onPress={() => setFeedTab('global')}
                        activeOpacity={0.7}
                    >
                        <Globe
                            size={16}
                            color={feedTab === 'global' ? '#fff' : AppColors.navy}
                        />
                        <Text
                            style={[
                                styles.feedTabText,
                                feedTab === 'global' && styles.feedTabTextActive,
                            ]}
                        >
                            Global
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.feedTab, feedTab === 'friends' && styles.feedTabActive]}
                        onPress={() => setFeedTab('friends')}
                        activeOpacity={0.7}
                    >
                        <Users
                            size={16}
                            color={feedTab === 'friends' ? '#fff' : AppColors.navy}
                        />
                        <Text
                            style={[
                                styles.feedTabText,
                                feedTab === 'friends' && styles.feedTabTextActive,
                            ]}
                        >
                            My Friends
                        </Text>
                    </TouchableOpacity>
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
                        data={displayPosts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <PostCard
                                item={item}
                                onLike={() => handleLike(item.id)}
                                onComment={() => handleComment(item.id)}
                                onShare={() => handleShare(item)}
                                isLiked={!!(currentUserId && item.likedBy?.includes(currentUserId))}
                                onAddFriend={() => handleAddFriend(item)}
                                friendStatus={getFriendStatus(item.userId)}
                                isOwnPost={item.userId === currentUserId}
                            />
                        )}
                        contentContainerStyle={styles.feedContent}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                )}

                <CommentModal
                    visible={!!commentReviewId}
                    reviewId={commentReviewId || ''}
                    onClose={() => setCommentReviewId(null)}
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
        fontSize: 32,
        fontWeight: '800',
        color: AppColors.navy,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },

    feedTabsContainer: {
        flexDirection: 'row',
        marginHorizontal: 24,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 8,
    },
    feedTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    feedTabActive: {
        backgroundColor: AppColors.navy,
    },
    feedTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.navy,
    },
    feedTabTextActive: {
        color: '#fff',
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: AppColors.navy,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        lineHeight: 22,
    },

    feedContent: {
        paddingTop: 8,
        paddingBottom: 120,
    },
    separator: {
        height: 10,
    },
});