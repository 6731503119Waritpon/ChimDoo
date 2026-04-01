import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Platform,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { ChevronLeft, Trash2, Clock, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useHistory } from '@/hooks/useHistory';
import { AppFonts } from '@/constants/theme';
import { AppColors } from '@/constants/colors';
import { getPalette } from '@/utils/paletteEngine';
import { HistoryItem } from '@/services/history';

const HistoryItemCard = ({ item, index }: { item: HistoryItem, index: number }) => {
    const router = useRouter();
    const palette = getPalette(item.category, item.name);

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 50).duration(400)}
            style={styles.cardWrapper}
        >
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => router.push({
                    pathname: '/recipe',
                    params: {
                        food: JSON.stringify(item.foodData),
                        category: item.category
                    }
                })}
            >
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardOverlay}>
                    <View style={[styles.categoryBadge, { backgroundColor: palette.accent }]}>
                        <Text style={styles.categoryText}>{item.category || 'Recipe'}</Text>
                    </View>
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.cardMeta}>
                        <Clock size={12} color="#999" />
                        <Text style={styles.cardDate}>
                            {new Date(item.timestamp).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
                <View style={styles.arrowContainer}>
                    <ChevronRight size={16} color="#CCC" />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function HistoryPage() {
    const router = useRouter();
    const { history, clearAllHistory, loading } = useHistory();

    const handleClear = () => {
        if (history.length === 0) return;
        clearAllHistory();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recent Views</Text>
                <TouchableOpacity
                    onPress={handleClear}
                    style={styles.clearBtn}
                    disabled={history.length === 0}
                >
                    <Trash2 size={24} color={history.length > 0 ? '#EE4444' : '#DDD'} />
                </TouchableOpacity>
            </View>

            {history.length > 0 ? (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.timestamp.toString()}
                    renderItem={({ item, index }) => <HistoryItemCard item={item} index={index} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <Clock size={40} color="#DDD" />
                    </View>
                    <Text style={styles.emptyTitle}>No History Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Your recently viewed recipes will appear here. Start exploring!
                    </Text>
                    <TouchableOpacity
                        style={styles.exploreBtn}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <Text style={styles.exploreBtnText}>Explore Recipes</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

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
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 22,
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
    },
    clearBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    cardWrapper: {
        marginBottom: 12,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        height: 100,
        alignItems: 'center',
    },
    cardImage: {
        width: 100,
        height: 100,
        backgroundColor: '#F8F9FA',
    },
    cardOverlay: {
        position: 'absolute',
        top: 8,
        left: 8,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    categoryText: {
        color: '#FFFFFF',
        fontFamily: AppFonts.bold,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardContent: {
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    cardTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 16,
        color: AppColors.navy,
        marginBottom: 6,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardDate: {
        fontFamily: AppFonts.medium,
        fontSize: 12,
        color: '#94A3B8',
    },
    arrowContainer: {
        paddingRight: 16,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    emptyTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontFamily: AppFonts.medium,
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 30,
    },
    exploreBtn: {
        backgroundColor: AppColors.primary,
        paddingHorizontal: 30,
        paddingVertical: 14,
        borderRadius: 15,
    },
    exploreBtnText: {
        color: '#FFFFFF',
        fontFamily: AppFonts.bold,
        fontSize: 14,
    },
});
