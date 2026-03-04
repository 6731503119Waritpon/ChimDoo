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
import { sharePost } from '@/components/ShareUtil';
import NotificationBell from '@/components/NotificationBell';
import NotificationModal from '@/components/NotificationModal';

const formatTime = (timestamp: any): string => {
    if (!timestamp?.toDate) return 'just now';
    const now = new Date();
    const date = timestamp.toDate();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
};

type FeedTab = 'global' | 'friends';

const PostCard = ({
    item,
    onLike,
    onComment,
    onShare,
    isLiked,
    onAddFriend,
    friendStatus,
    isOwnPost,
}: {
    item: CommunityPost;
    onLike: () => void;
    onComment: () => void;
    onShare: () => void;
    isLiked: boolean;
    onAddFriend: () => void;
    friendStatus: 'none' | 'pending_sent' | 'pending_received' | 'accepted';
    isOwnPost: boolean;
}) => {
    const avatarLetter = (item.userName || '?').charAt(0).toUpperCase();

    const renderFriendButton = () => {
        if (isOwnPost) return null;

        switch (friendStatus) {
            case 'accepted':
                return (
                    <View style={styles.friendBadge}>
                        <UserCheck size={14} color="#22c55e" />
                    </View>
                );
            case 'pending_sent':
                return (
                    <View style={styles.friendBadgePending}>
                        <Clock size={12} color="#f59e0b" />
                        <Text style={styles.friendBadgePendingText}>Pending</Text>
                    </View>
                );
            case 'pending_received':
                return (
                    <View style={styles.friendBadgePending}>
                        <Clock size={12} color="#3b82f6" />
                        <Text style={[styles.friendBadgePendingText, { color: '#3b82f6' }]}>Respond</Text>
                    </View>
                );
            default:
                return (
                    <TouchableOpacity
                        style={styles.addFriendButton}
                        onPress={onAddFriend}
                        activeOpacity={0.6}
                    >
                        <UserPlus size={14} color="#1D3557" />
                        <Text style={styles.addFriendText}>Add</Text>
                    </TouchableOpacity>
                );
        }
    };

    return (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                {item.userAvatar ? (
                    <Image source={{ uri: item.userAvatar }} style={styles.postAvatar} />
                ) : (
                    <View style={[styles.postAvatar, styles.postAvatarPlaceholder]}>
                        <Text style={styles.postAvatarText}>{avatarLetter}</Text>
                    </View>
                )}
                <View style={styles.postUserInfo}>
                    <Text style={styles.postUserName}>{item.userName}</Text>
                    <View style={styles.postMeta}>
                        <Text style={styles.postFoodName}>{item.foodName}</Text>
                        <Text style={styles.postDot}>·</Text>
                        <Text style={styles.postTime}>{formatTime(item.createdAt)}</Text>
                    </View>
                </View>
                {renderFriendButton()}
            </View>

            <Image source={{ uri: item.image }} style={styles.postImage} />

            <View style={styles.postActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onLike}
                    activeOpacity={0.6}
                >
                    <Heart
                        size={22}
                        color="#E63946"
                        fill={isLiked ? '#E63946' : 'none'}
                    />
                    <Text style={styles.actionText}>{item.likes || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onComment}
                    activeOpacity={0.6}
                >
                    <MessageCircle size={22} color="#1D3557" />
                    <Text style={styles.actionText}>{item.commentsCount || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onShare}
                    activeOpacity={0.6}
                >
                    <Share2 size={20} color="#777" />
                </TouchableOpacity>
            </View>

            <View style={styles.captionContainer}>
                <Text style={styles.captionUser}>{item.userName}</Text>
                <Text style={styles.captionText}>{item.description}</Text>
            </View>
        </View>
    );
};

const Page = () => {
    const toast = useToast();
    const { posts, loading, toggleLike, isLoggedIn, currentUserId } = useCommunity();
    const [showNotif, setShowNotif] = useState(false);
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
            <View style={styles.guestContainer}>
                <View style={styles.guestContent}>
                    <View style={styles.guestIconWrapper}>
                        <UsersRound size={48} color="#E63946" />
                    </View>
                    <Text style={styles.guestTitle}>Community</Text>
                    <Text style={styles.guestSubtitle}>
                        Sign in to see reviews, share your food experiences, and connect with other food lovers!
                    </Text>
                </View>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E63946" />
            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                <View style={[styles.header, { justifyContent: 'space-between' }]}>
                    <View>
                        <Text style={styles.headerTitle}>Community</Text>
                        <Text style={styles.headerSubtitle}>
                            See what others are cooking
                        </Text>
                    </View>
                    <NotificationBell onPress={() => setShowNotif(true)} />
                </View>

                <View style={styles.feedTabsContainer}>
                    <TouchableOpacity
                        style={[styles.feedTab, feedTab === 'global' && styles.feedTabActive]}
                        onPress={() => setFeedTab('global')}
                        activeOpacity={0.7}
                    >
                        <Globe
                            size={16}
                            color={feedTab === 'global' ? '#fff' : '#1D3557'}
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
                            color={feedTab === 'friends' ? '#fff' : '#1D3557'}
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
                                <Users size={48} color='#1D3557' />
                                <Text style={styles.emptyTitle}>No Friend Posts</Text>
                                <Text style={styles.emptySubtitle}>
                                    Add friends from the Global feed to see their posts here!
                                </Text>
                            </>
                        ) : (
                            <>
                                <Info size={48} color='#1D3557' />
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
            <NotificationModal visible={showNotif} onClose={() => setShowNotif(false)} />
        </>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
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
        color: '#1D3557',
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
        backgroundColor: '#1D3557',
    },
    feedTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1D3557',
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
        color: '#1D3557',
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

    postCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        paddingBottom: 10,
        gap: 12,
    },
    postAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: '#E63946',
    },
    postAvatarPlaceholder: {
        backgroundColor: '#1D3557',
        alignItems: 'center',
        justifyContent: 'center',
    },
    postAvatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    postUserInfo: {
        flex: 1,
    },
    postUserName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1D3557',
    },
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    postFoodName: {
        fontSize: 12,
        color: '#E63946',
        fontWeight: '600',
    },
    postDot: {
        fontSize: 12,
        color: '#ccc',
    },
    postTime: {
        fontSize: 12,
        color: '#aaa',
    },

    postImage: {
        width: '100%',
        height: 240,
        backgroundColor: '#f0f0f0',
    },

    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },

    captionContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 0,
    },
    captionUser: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1D3557',
        marginBottom: 4,
    },
    captionText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },

    addFriendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(29, 53, 87, 0.08)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    addFriendText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1D3557',
    },
    friendBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    friendBadgePending: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 20,
    },
    friendBadgePendingText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#f59e0b',
    },

    guestContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    guestContent: {
        alignItems: 'center',
        width: '100%',
    },
    guestIconWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    guestTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1D3557',
        marginBottom: 12,
    },
    guestSubtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 10,
    },
    guestButtons: {
        width: '100%',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#E63946',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    outlineButton: {
        borderWidth: 2,
        borderColor: '#E63946',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
    },
    outlineButtonText: {
        color: '#E63946',
        fontSize: 16,
        fontWeight: '700',
    },
});