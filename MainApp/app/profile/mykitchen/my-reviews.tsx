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
import { ChevronLeft, MessageSquareText, Heart, MessageCircle, Trash2, Clock } from 'lucide-react-native';
import { useCommunity } from '@/hooks/useCommunity';
import { CommunityPost } from '@/types/community';
import { useToast } from '@/components/ToastProvider';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { formatTimestamp } from '@/utils/formatTime';

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
                <View style={styles.titleRow}>
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
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    style={styles.deleteButton}
                    activeOpacity={0.6}
                >
                    <Trash2 size={16} color={AppColors.primary} />
                </TouchableOpacity>
            </View>

            <Text style={styles.cardDescription} numberOfLines={2}>
                {item.description}
            </Text>

            <View style={styles.cardMeta}>
                <View style={styles.statsRow}>
                    <View style={styles.metaItem}>
                        <Heart size={12} color={AppColors.primary} fill={AppColors.primary} />
                        <Text style={styles.metaText}>{item.likes || 0}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <MessageCircle size={12} color={AppColors.navy} />
                        <Text style={styles.metaText}>{item.commentsCount || 0}</Text>
                    </View>
                </View>
                <View style={styles.metaItem}>
                    <Clock size={12} color="#999" />
                    <Text style={styles.cardTime}>{formatTimestamp(item.createdAt)}</Text>
                </View>
            </View>
        </View>
    </View>
);

const MyReviews = () => {
    const router = useRouter();
    const toast = useToast();
    const { getUserReviews, deleteReview, loading } = useCommunity();
    const [reviews, setReviews] = useState<CommunityPost[]>([]);

    const refreshReviews = useCallback(() => {
        setReviews(getUserReviews());
    }, [getUserReviews]);

    useFocusEffect(
        useCallback(() => {
            refreshReviews();
        }, [refreshReviews])
    );

    const handleDelete = (reviewId: string) => {
        Alert.alert(
            'Delete Review',
            'Are you sure you want to delete this review?',
            [
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
            ]
        );
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
                <View style={{ width: 44 }} />
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={AppColors.primary} />
                </View>
            ) : reviews.length === 0 ? (
                <View style={styles.centerContent}>
                    <View style={styles.iconWrapper}>
                        <MessageSquareText size={48} color={AppColors.primary} fill="rgba(230, 57, 70, 0.05)" />
                    </View>
                    <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Your food reviews will appear here. Share your cooking experiences with the community!
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
        fontSize: 22,
        color: AppColors.navy,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(230, 57, 70, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
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
        color: '#777',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 10,
    },
    exploreButton: {
        backgroundColor: AppColors.primary,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        shadowColor: AppColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    exploreButtonText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 60,
        gap: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        flexDirection: 'row',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardImage: {
        width: 110,
        height: 110,
        borderRadius: 16,
        backgroundColor: '#f8f9fa',
    },
    cardContent: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleRow: {
        flex: 1,
        paddingRight: 8,
    },
    cardFoodName: {
        fontFamily: AppFonts.bold,
        fontSize: 17,
        color: AppColors.navy,
        marginBottom: 4,
    },
    countryChip: {
        backgroundColor: 'rgba(230, 57, 70, 0.06)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    countryChipText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 10,
        color: AppColors.primary,
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(230, 57, 70, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardDescription: {
        fontFamily: AppFonts.regular,
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
        marginVertical: 4,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 12,
        color: '#555',
    },
    cardTime: {
        fontFamily: AppFonts.regular,
        fontSize: 11,
        color: '#999',
    },
});