import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    FlatList,
    Image,
    ActivityIndicator,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ChevronLeft, Heart } from 'lucide-react-native';
import { useCommunity } from '@/hooks/useCommunity';
import { CommunityPost } from '@/types/community';

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

const FavoriteCard = ({ item }: { item: CommunityPost }) => (
    <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                <Text style={styles.cardFoodName} numberOfLines={1}>
                    {item.foodName}
                </Text>
                {!!item.country && (
                    <View style={styles.countryChip}>
                        <Text style={styles.countryChipText}>{item.country}</Text>
                    </View>
                )}
            </View>
            <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
            <View style={styles.cardMeta}>
                <Text style={styles.cardBy}>by {item.userName}</Text>
                <Text style={styles.cardTime}>{formatTime(item.createdAt)}</Text>
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
                    <ChevronLeft size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Favorites</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#E63946" />
                </View>
            ) : favorites.length === 0 ? (
                <View style={styles.centerContent}>
                    <View style={styles.iconWrapper}>
                        <Heart size={48} color="#E63946" />
                    </View>
                    <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Tap the heart on any community post to save it here!
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
        backgroundColor: '#F8F9FA',
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
        fontSize: 20,
        fontWeight: '700',
        color: '#1D3557',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1D3557',
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1D3557',
        marginBottom: 12,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
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
    cardFoodName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1D3557',
        flexShrink: 1,
    },
    countryChip: {
        backgroundColor: 'rgba(29, 53, 87, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    countryChipText: {
        fontSize: 10,
        color: '#1D3557',
        fontWeight: '600',
    },
    cardDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
        marginBottom: 6,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardBy: {
        fontSize: 12,
        color: '#aaa',
        fontWeight: '500',
    },
    cardTime: {
        fontSize: 12,
        color: '#ccc',
    },
});