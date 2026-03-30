import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, Share2, UserPlus, UserCheck, Clock, UserMinus } from 'lucide-react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withSequence, 
    withDelay,
    withTiming,
    runOnJS
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

const PostCard = ({
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
                        <Text style={styles.friendBadgePendingText}>Cancel</Text>
                    </TouchableOpacity>
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
                        <UserPlus size={14} color={AppColors.navy} />
                        <Text style={styles.addFriendText}>Add</Text>
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
                    onPress={onComment}
                    activeOpacity={0.7}
                >
                    <Text style={styles.commentCountTitle}>
                        {item.commentsCount || 0} {item.commentsCount === 1 ? 'Comment' : 'Comments'}
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
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
};

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
        paddingBottom: 12,
        gap: 12,
    },
    postAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f8f8f8',
        borderWidth: 1.5,
        borderColor: 'rgba(230, 57, 70, 0.2)',
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
        fontSize: 16,
        color: AppColors.navy,
    },
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 1,
    },
    countryChip: {
        backgroundColor: 'rgba(230, 57, 70, 0.08)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    countryChipText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 10,
        color: AppColors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    postTime: {
        fontFamily: AppFonts.regular,
        fontSize: 12,
        color: '#999',
    },
    imageContainer: {
        marginHorizontal: 12,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        height: 220,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        zIndex: 1,
    },
    foodBadgeText: {
        fontFamily: AppFonts.bold,
        fontSize: 12,
        color: AppColors.primary,
    },
    heartOverlay: {
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
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
        gap: 28,
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
        color: '#555',
        lineHeight: 18,
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
        borderColor: 'rgba(0,0,0,0.03)',
    },
    commentCountTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 10,
        color: '#aaa',
        textTransform: 'uppercase',
        marginBottom: 4,
        letterSpacing: 0.5,
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
        fontFamily: AppFonts.regular,
        fontSize: 11,
        color: '#ccc',
        fontStyle: 'italic',
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
        fontFamily: AppFonts.semiBold,
        fontSize: 12,
        color: AppColors.navy,
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
        fontFamily: AppFonts.semiBold,
        fontSize: 11,
        color: '#f59e0b',
    },
});
