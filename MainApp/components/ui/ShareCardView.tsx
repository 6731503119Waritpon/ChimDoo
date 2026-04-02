import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { Heart, Share2 } from 'lucide-react-native';
import { CommunityPost, Comment } from '@/types/community';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { formatTimestamp } from '@/utils/formatTime';
import { useCommunity } from '@/hooks/useCommunity';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

interface ShareCardViewProps {
    item: CommunityPost;
    width: number;
    height: number;
}

const ShareCardView = ({ item, width, height }: ShareCardViewProps) => {
    const { subscribeToComments } = useCommunity();
    const [recentComments, setRecentComments] = useState<Comment[]>([]);
    const avatarLetter = (item.userName || '?').charAt(0).toUpperCase();

    useEffect(() => {
        const unsubscribe = subscribeToComments(item.id, (comments) => {
            setRecentComments(comments.slice(-4).reverse());
        });
        return () => unsubscribe();
    }, [item.id, subscribeToComments]);

    return (
        <View style={[styles.container, { width, height }]}>
            <View style={styles.headerLogo}>
                <Text style={styles.brandText}>ChimDoo</Text>
            </View>

            <View style={styles.postCardShadow}>
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
                            <Text style={styles.postTime}>{formatTimestamp(item.createdAt)}</Text>
                        </View>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
                        <View style={styles.foodBadge}>
                            <Text style={styles.foodBadgeText}>{item.foodName}</Text>
                        </View>
                    </View>

                    <View style={styles.bottomRow}>
                        <View style={styles.leftColumn}>
                            <View style={styles.postActionsLeft}>
                                <View style={styles.actionButton}>
                                    <Heart size={18} color={AppColors.primary} fill={AppColors.primary} />
                                    <Text style={styles.actionText}>{item.likes || 0}</Text>
                                </View>
                                <View style={styles.actionButton}>
                                    <Share2 size={16} color="#777" />
                                </View>
                            </View>

                            <View style={styles.captionContainer}>
                                {/* <Text style={styles.captionUser}>{item.userName}</Text> */}
                                <Text style={styles.captionText} numberOfLines={4}>{item.description}</Text>
                            </View>
                        </View>

                        <View style={styles.verticalDivider} />

                        <View style={styles.rightColumn}>
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
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.footerBranding}>
                <Text style={styles.footerTagline}>Found on ChimDoo • Taste the World</Text>
            </View>
        </View>
    );
};

export default ShareCardView;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 20,
    },
    headerLogo: {
        marginBottom: 15,
        alignItems: 'center',
    },
    brandText: {
        fontFamily: AppFonts.bold,
        fontSize: 28,
        color: AppColors.primary,
        letterSpacing: 1.5,
    },
    postCardShadow: {
        width: '92%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 10,
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 12,
        gap: 12,
    },
    postAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f8f8',
    },
    postAvatarPlaceholder: {
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postAvatarText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 16,
    },
    postUserInfo: {
        flex: 1,
    },
    postUserName: {
        fontFamily: AppFonts.bold,
        fontSize: 15,
        color: AppColors.navy,
    },
    postTime: {
        fontFamily: AppFonts.regular,
        fontSize: 11,
        color: '#999',
    },
    imageContainer: {
        marginHorizontal: 12,
        borderRadius: 20,
        overflow: 'hidden',
        height: 170,
        position: 'relative',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    foodBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    foodBadgeText: {
        fontFamily: AppFonts.bold,
        fontSize: 12,
        color: AppColors.primary,
    },
    bottomRow: {
        flexDirection: 'row',
        paddingVertical: 18,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
    },
    leftColumn: {
        flex: 0.8,
        paddingRight: 10,
    },
    postActionsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 10,
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
    captionUser: {
        fontFamily: AppFonts.bold,
        fontSize: 14,
        color: AppColors.navy,
        marginBottom: 2,
    },
    captionText: {
        fontFamily: AppFonts.regular,
        fontSize: 11,
        color: '#555',
        lineHeight: 14,
    },
    verticalDivider: {
        width: 1,
        backgroundColor: 'rgba(0,0,0,0.06)',
        alignSelf: 'stretch',
        marginVertical: 4,
    },
    rightColumn: {
        flex: 1.2,
        paddingLeft: 10,
        justifyContent: 'center',
    },
    commentsBox: {
        backgroundColor: '#f6f7f9',
        borderRadius: 10,
        padding: 8,
        marginTop: 4,
    },
    commentCountTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 10,
        color: '#aaa',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    commentPreviewText: {
        fontFamily: AppFonts.regular,
        fontSize: 10,
        color: '#666',
        lineHeight: 14,
        marginBottom: 1,
    },
    commentAuthor: {
        fontFamily: AppFonts.bold,
        color: AppColors.navy,
    },
    noCommentsText: {
        fontFamily: AppFonts.regular,
        fontSize: 10,
        color: '#ccc',
        fontStyle: 'italic',
    },
    footerBranding: {
        position: 'absolute',
        bottom: 20,
    },
    footerTagline: {
        fontFamily: AppFonts.bold,
        fontSize: 11,
        color: 'rgba(0,0,0,0.3)',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
