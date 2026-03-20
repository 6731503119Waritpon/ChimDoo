import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, MessageCircle, Share2, UserPlus, UserCheck, Clock } from 'lucide-react-native';
import { CommunityPost } from '@/types/community';
import { formatTimestamp } from '@/utils/formatTime';
import { AppColors } from '@/constants/colors';

interface PostCardProps {
    item: CommunityPost;
    onLike: () => void;
    onComment: () => void;
    onShare: () => void;
    isLiked: boolean;
    onAddFriend: () => void;
    friendStatus: 'none' | 'pending_sent' | 'pending_received' | 'accepted';
    isOwnPost: boolean;
}

const PostCard = ({
    item,
    onLike,
    onComment,
    onShare,
    isLiked,
    onAddFriend,
    friendStatus,
    isOwnPost,
}: PostCardProps) => {
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
                        <UserPlus size={14} color={AppColors.navy} />
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
                        {!!item.country && (
                            <View style={styles.countryChip}>
                                <Text style={styles.countryChipText}>{item.country}</Text>
                            </View>
                        )}
                        <Text style={styles.postDot}>·</Text>
                        <Text style={styles.postTime}>{formatTimestamp(item.createdAt)}</Text>
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
                        color={AppColors.primary}
                        fill={isLiked ? AppColors.primary : 'none'}
                    />
                    <Text style={styles.actionText}>{item.likes || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onComment}
                    activeOpacity={0.6}
                >
                    <MessageCircle size={22} color={AppColors.navy} />
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

export default PostCard;

const styles = StyleSheet.create({
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
        borderColor: AppColors.primary,
    },
    postAvatarPlaceholder: {
        backgroundColor: AppColors.navy,
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
        color: AppColors.navy,
    },
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    postFoodName: {
        fontSize: 12,
        color: AppColors.primary,
        fontWeight: '600',
    },
    countryChip: {
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    countryChipText: {
        fontSize: 10,
        color: AppColors.primary,
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
        color: AppColors.navy,
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
        fontSize: 11,
        fontWeight: '600',
        color: '#f59e0b',
    },
});
