import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, Share2, UserPlus, UserCheck, Clock, UserMinus } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withDelay,
    withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { CommunityPost, Comment } from '@/types/community';
import { formatTimestamp } from '@/utils/formatTime';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { useCommunity } from '@/hooks/useCommunity';

interface PostCardProps {
    item: CommunityPost;
    onLike: () => void;
    onComment: () => void;
    onShare: () => void;
    onImagePress: (uri: string) => void;
    isLiked: boolean;
    onAddFriend: () => void;
    onCancelFriend?: () => void;
    friendStatus: 'none' | 'pending_sent' | 'pending_received' | 'accepted';
    isOwnPost: boolean;
}

const PostCard = memo(({
    item,
    onLike,
    onComment,
    onShare,
    onImagePress,
    isLiked,
    onAddFriend,
    onCancelFriend,
    friendStatus,
    isOwnPost,
}: PostCardProps) => {
    const { subscribeToComments } = useCommunity();
    const [recentComments, setRecentComments] = useState<Comment[]>([]);
    const avatarLetter = (item.userName || '?').charAt(0).toUpperCase();

    const heartScale = useSharedValue(0);
    const heartOpacity = useSharedValue(0);
    const commentAreaScale = useSharedValue(1);

    useEffect(() => {
        const unsubscribe = subscribeToComments(item.id, (comments) => {
            setRecentComments(comments.slice(-4).reverse());
        });
        return () => unsubscribe();
    }, [item.id, subscribeToComments]);

    const heartStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }],
        opacity: heartOpacity.value,
    }));

    const animatedCommentStyle = useAnimatedStyle(() => ({
        transform: [{ scale: commentAreaScale.value }],
    }));

    const triggerHeartAnimation = useCallback(() => {
        heartScale.value = withSequence(
            withSpring(1.2, { damping: 10, stiffness: 100 }),
            withDelay(400, withSpring(0))
        );
        heartOpacity.value = withSequence(
            withTiming(1, { duration: 100 }),
            withDelay(500, withTiming(0, { duration: 200 }))
        );
    }, []);

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .maxDelay(250)
        .runOnJS(true)
        .onEnd(() => {
            triggerHeartAnimation();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            if (!isLiked) {
                onLike();
            }
        });

    const singleTap = Gesture.Tap()
        .numberOfTaps(1)
        .runOnJS(true)
        .onEnd(() => {
            onImagePress(item.image);
        });

    const composedGesture = Gesture.Exclusive(doubleTap, singleTap);

    const handleCommentPress = () => {
        commentAreaScale.value = withSequence(
            withTiming(0.96, { duration: 100 }),
            withSpring(1)
        );
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onComment();
    };

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
                    <TouchableOpacity
                        style={styles.friendBadgePending}
                        onPress={onCancelFriend}
                        activeOpacity={0.7}
                    >
                        <UserMinus size={12} color="#f59e0b" />
                        <Text style={styles.friendBadgePendingText}>CANCEL</Text>
                    </TouchableOpacity>
                );
            case 'pending_received':
                return (
                    <View style={styles.friendBadgeReply}>
                        <Clock size={12} color="#3b82f6" />
                        <Text style={[styles.friendBadgeReplyText, { color: '#3b82f6' }]}>REPLY</Text>
                    </View>
                );
            default:
                return (
                    <TouchableOpacity
                        style={styles.addFriendButton}
                        onPress={onAddFriend}
                        activeOpacity={0.6}
                    >
                        <UserPlus size={14} color={AppColors.navy} />
                        <Text style={styles.addFriendText}>ADD</Text>
                    </TouchableOpacity>
                );
        }
    };

    return (
        <GestureHandlerRootView style={styles.postCard}>
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
                        {!!item.country && (
                            <View style={styles.countryChip}>
                                <Text style={styles.countryChipText}>{item.country}</Text>
                            </View>
                        )}
                        <Text style={styles.postTime}>{formatTimestamp(item.createdAt)}</Text>
                    </View>
                </View>
                {renderFriendButton()}
            </View>

            <GestureDetector gesture={composedGesture}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
                    <View style={styles.foodBadge}>
                        <Text style={styles.foodBadgeText}>{item.foodName}</Text>
                    </View>

                    <Animated.View style={[styles.heartOverlay, heartStyle]}>
                        <Heart size={80} color="#fff" fill="#fff" />
                    </Animated.View>
                </View>
            </GestureDetector>

            <View style={styles.bottomRow}>
                <View style={styles.leftColumn}>
                    <View style={styles.postActionsLeft}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={onLike}
                            activeOpacity={0.6}
                        >
                            <Heart
                                size={20}
                                color={AppColors.primary}
                                fill={isLiked ? AppColors.primary : 'none'}
                            />
                            <Text style={styles.actionText}>{item.likes || 0}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={onShare}
                            activeOpacity={0.6}
                        >
                            <Share2 size={18} color="#777" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.captionContainer}>
                        {/* <Text style={styles.captionUser}>{item.userName}</Text> */}
                        <Text style={styles.captionText}>{item.description}</Text>
                    </View>
                </View>

                <View style={styles.verticalDivider} />

                <TouchableOpacity
                    style={styles.rightColumn}
                    onPress={handleCommentPress}
                    activeOpacity={0.9}
                >
                    <Animated.View style={animatedCommentStyle}>
                        <Text style={styles.commentCountTitle}>
                            {item.commentsCount || 0} {item.commentsCount === 1 ? 'COMMENT' : 'COMMENTS'}
                        </Text>
                        <View style={styles.commentsBox}>
                            {recentComments.length > 0 ? (
                                recentComments.map((comment) => (
                                    <Text key={comment.id} style={styles.commentPreviewText} numberOfLines={1}>
                                        <Text style={styles.commentAuthor}>{comment.userName}: </Text>
                                        {comment.text}
                                    </Text>
                                ))
                            ) : (
                                <Text style={styles.noCommentsText}>No comments yet...</Text>
                            )}
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
});

export default PostCard;

const styles = StyleSheet.create({
    postCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: AppColors.navy,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 6,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(29, 53, 87, 0.08)',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 14,
        gap: 12,
    },
    postAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#eee',
    },
    postAvatarPlaceholder: {
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postAvatarText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 18,
    },
    postUserInfo: {
        flex: 1,
    },
    postUserName: {
        fontFamily: AppFonts.bold,
        fontSize: 15,
        color: AppColors.navy,
        letterSpacing: -0.3,
    },
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 1,
    },
    countryChip: {
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    countryChipText: {
        fontFamily: AppFonts.bold,
        fontSize: 9,
        color: AppColors.primary,
        letterSpacing: 1,
    },
    postTime: {
        fontFamily: AppFonts.medium,
        fontSize: 11,
        color: '#94A3B8',
    },
    imageContainer: {
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        height: 220,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    postImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    foodBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        zIndex: 1,
    },
    foodBadgeText: {
        fontFamily: AppFonts.bold,
        fontSize: 11,
        color: AppColors.navy,
        letterSpacing: 0.5,
    },
    heartOverlay: {
        zIndex: 2,
    },
    bottomRow: {
        flexDirection: 'row',
        paddingVertical: 18,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
    },
    leftColumn: {
        flex: 0.8,
        paddingRight: 12,
    },
    postActionsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontFamily: AppFonts.bold,
        fontSize: 14,
        color: AppColors.navy,
    },
    captionContainer: {
        paddingTop: 0,
    },
    captionText: {
        fontFamily: AppFonts.regular,
        fontSize: 13,
        color: '#475569',
        lineHeight: 20,
    },
    verticalDivider: {
        width: 1.2,
        backgroundColor: 'rgba(0,0,0,0.06)',
        alignSelf: 'stretch',
        marginVertical: 2,
    },
    rightColumn: {
        flex: 1.2,
        paddingLeft: 12,
        justifyContent: 'center',
    },
    commentsBox: {
        backgroundColor: '#f6f7f9',
        borderRadius: 12,
        padding: 8,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    commentCountTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 10,
        color: '#94A3B8',
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    commentPreviewText: {
        fontFamily: AppFonts.regular,
        fontSize: 11,
        color: '#666',
        lineHeight: 15,
        marginBottom: 2,
    },
    commentAuthor: {
        fontFamily: AppFonts.bold,
        color: AppColors.navy,
    },
    noCommentsText: {
        fontFamily: AppFonts.medium,
        fontSize: 11,
        color: '#CBD5E1',
        fontStyle: 'italic',
    },
    addFriendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
        borderWidth: 1.2,
        borderColor: AppColors.navy,
    },
    addFriendText: {
        fontFamily: AppFonts.bold,
        fontSize: 9,
        color: AppColors.navy,
        letterSpacing: 1,
    },
    friendBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0FDF4',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#DCFCE7',
    },
    friendBadgePending: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    friendBadgePendingText: {
        fontFamily: AppFonts.bold,
        fontSize: 9,
        color: '#D97706',
        letterSpacing: 0.8,
    },
    friendBadgeReply: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#f7fbffff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#c7e8feff',
    },
    friendBadgeReplyText: {
        fontFamily: AppFonts.bold,
        fontSize: 9,
        color: '#3b82f6',
        letterSpacing: 0.8,
    },
});
