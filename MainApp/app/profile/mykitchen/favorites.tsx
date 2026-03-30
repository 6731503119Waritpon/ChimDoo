import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ChevronLeft, Heart } from 'lucide-react-native';
import { useCommunity } from '@/hooks/useCommunity';
import { CommunityPost } from '@/types/community';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { formatTimestamp } from '@/utils/formatTime';

const FavoriteCard = ({ item }: { item: CommunityPost }) => (
    <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardFoodName} numberOfLines={1}>
                    {item.foodName}
                </Text>
                {!!item.country && (
                    <View style={styles.countryChip}>
                        <Text style={styles.countryChipText}>{item.country}</Text>
                    </View>
                )}
            </View>
            <Text style={styles.cardDescription} numberOfLines={2}>
                {item.description}
            </Text>
            <View style={styles.cardMeta}>
                <Text style={styles.cardBy}>by {item.userName}</Text>
                <Text style={styles.cardTime}>{formatTimestamp(item.createdAt)}</Text>
            </View>
        </View>
    </View>
);

const Favorites = () => {
    const { getUserFavorites, loading } = useCommunity();
    const favorites = getUserFavorites();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Favorites', headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Favorites</Text>
                <View style={{ width: 44 }} />
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={AppColors.primary} />
                </View>
            ) : favorites.length === 0 ? (
                <View style={styles.centerContent}>
                    <View style={styles.iconWrapper}>
                        <Heart size={44} color={AppColors.primary} fill="rgba(230, 57, 70, 0.1)" />
                    </View>
                    <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Posts you like will appear here. Explore the community to discover delicious dishes!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <FavoriteCard item={item} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default Favorites;

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
        paddingHorizontal: 16,
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
        marginBottom: 8,
    },
    emptySubtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
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
        width: 90,
        height: 90,
        borderRadius: 16,
        backgroundColor: '#f8f9fa',
    },
    cardContent: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 4,
    },
    cardFoodName: {
        fontFamily: AppFonts.bold,
        fontSize: 17,
        color: AppColors.navy,
        maxWidth: '70%',
    },
    countryChip: {
        backgroundColor: 'rgba(29, 53, 87, 0.06)',
        paddingHorizontal: 8,
        paddingVertical: 3,
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
        marginBottom: 8,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardBy: {
        fontFamily: AppFonts.medium,
        fontSize: 12,
        color: '#999',
    },
    cardTime: {
        fontFamily: AppFonts.regular,
        fontSize: 12,
        color: '#ccc',
    },
});