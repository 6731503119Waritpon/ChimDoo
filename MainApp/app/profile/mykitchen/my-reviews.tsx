import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    FlatList,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { ChevronLeft, MessageSquareText, Heart, MessageCircle, Trash2 } from 'lucide-react-native';
import { useCommunity } from '@/hooks/useCommunity';
import { CommunityPost } from '@/types/community';
import { useToast } from '@/components/ToastProvider';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

const formatTime = (timestamp: any): string => {
    if (!timestamp?.toDate) return '';
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

const ReviewCard = ({
    item,
    onDelete,
}: {
    item: CommunityPost;
    onDelete: (id: string) => void;
}) => (
    <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
            <View style={styles.cardTop}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginRight: 8 }}>
                    <Text style={styles.cardFoodName} numberOfLines={1}>
                        {item.foodName}
                    </Text>
                    {!!item.country && (
                        <View style={styles.countryChip}>
                            <Text style={styles.countryChipText}>{item.country}</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity
                    onPress={() => onDelete(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Trash2 size={16} color={AppColors.primary} />
                </TouchableOpacity>
            </View>
            <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
            <View style={styles.cardMeta}>
                <View style={styles.statBadge}>
                    <Heart size={12} color={AppColors.primary} />
                    <Text style={styles.statText}>{item.likes || 0}</Text>
                </View>
                <View style={styles.statBadge}>
                    <MessageCircle size={12} color={AppColors.navy} />
                    <Text style={styles.statText}>{item.commentsCount || 0}</Text>
                </View>
                <Text style={styles.cardTime}>{formatTime(item.createdAt)}</Text>
            </View>
        </View>
    </View>
);

const MyReviews = () => {
    const router = useRouter();
    const toast = useToast();
    const { getUserReviews, deleteReview, loading } = useCommunity();
    const [reviews, setReviews] = useState<CommunityPost[]>(getUserReviews());

    useFocusEffect(
        useCallback(() => {
            setReviews(getUserReviews());
        }, [getUserReviews])
    );

    const handleDelete = (reviewId: string) => {
        Alert.alert('Delete Review', 'Are you sure you want to delete this review?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteReview(reviewId);
                        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
                        toast.success('Deleted', 'Your review has been removed.');
                    } catch (err) {
                        toast.error('Error', 'Failed to delete review.');
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'My Reviews', headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Reviews</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={AppColors.primary} />
                </View>
            ) : reviews.length === 0 ? (
                <View style={styles.centerContent}>
                    <View style={styles.iconWrapper}>
                        <MessageSquareText size={48} color={AppColors.primary} />
                    </View>
                    <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        You haven't reviewed any recipes yet. Try cooking something delicious and share your thoughts!
                    </Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => router.replace('/')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.exploreButtonText}>Explore Recipes</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={reviews}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ReviewCard item={item} onDelete={handleDelete} />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default MyReviews;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 20,
        color: AppColors.navy,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    iconWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
        marginBottom: 12,
    },
    emptySubtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    exploreButton: {
        backgroundColor: AppColors.primary,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
    },
    exploreButtonText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: 'row',
    },
    cardImage: {
        width: 100,
        height: 100,
        backgroundColor: '#f0f0f0',
    },
    cardContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardFoodName: {
        fontFamily: AppFonts.bold,
        fontSize: 16,
        color: AppColors.navy,
        flexShrink: 1,
    },
    countryChip: {
        backgroundColor: 'rgba(29, 53, 87, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    countryChipText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 10,
        color: AppColors.navy,
    },
    cardDescription: {
        fontFamily: AppFonts.regular,
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
        marginBottom: 6,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 12,
        color: '#888',
    },
    cardTime: {
        fontFamily: AppFonts.regular,
        fontSize: 12,
        color: '#ccc',
    },
});