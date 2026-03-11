import React, { useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    Image,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Flame } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CountryFlag from 'react-native-country-flag';

import { useCountryData } from '@/hooks/useCountryData';
import { FoodItem } from '@/types/recipe';
import { globeCountries } from '@/config/home';

const PopularFoodCard = ({ item, onPress, badgeLabel = 'Popular' }: { item: any; onPress: () => void; badgeLabel?: string }) => (
    <TouchableOpacity
        style={styles.largeCard}
        activeOpacity={0.9}
        onPress={onPress}
    >
        <Image source={{ uri: item.image }} style={styles.largeCardImage} />
        <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.largeCardOverlay}
        />

        <View style={styles.largeCardContent}>
            <View style={styles.largeCardBadge}>
                <Text style={styles.largeCardBadgeText}>{badgeLabel}</Text>
            </View>

            <Text style={styles.largeCardTitle}>{item.name}</Text>
            <Text style={styles.largeCardDesc} numberOfLines={2}>
                {item.description}
            </Text>

            <View style={styles.largeCardMeta}>
                <View style={styles.metaChip}>
                    <Clock size={12} color="#fff" />
                    <Text style={styles.metaChipText}>{item.prepTime}</Text>
                </View>
                <View style={styles.metaChip}>
                    <Flame size={12} color="#fff" />
                    <Text style={styles.metaChipText}>{item.taste}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

const NormalFoodItem = ({ item, onPress }: { item: any; onPress: () => void }) => (
    <TouchableOpacity
        style={styles.smallCard}
        activeOpacity={0.7}
        onPress={onPress}
    >
        <Image
            source={{ uri: item.image }}
            style={styles.smallCardImage}
        />
        <View style={styles.smallCardInfo}>
            <Text style={styles.smallCardName}>{item.name}</Text>
            <Text style={styles.smallCardDesc} numberOfLines={2}>
                {item.description}
            </Text>
        </View>
    </TouchableOpacity>
);

export default function CountryPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data, loading, error } = useCountryData(id ?? '');
    const isoCode = globeCountries.find((c) => c.id === id)?.isoCode ?? '';

    const { popularFoods, recommendFoods, normalFoods } = useMemo(() => {
        if (!data?.foods) return { popularFoods: [], recommendFoods: [], normalFoods: [] };
        return {
            popularFoods: data.foods.slice(0, 2),
            recommendFoods: data.foods.slice(2, 4),
            normalFoods: data.foods.slice(4),
        };
    }, [data]);

    const handleFoodPress = (food: any) => {
        router.push({
            pathname: '/recipe',
            params: { food: JSON.stringify(food), category: data?.name || '' }
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#E63946" />
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Country not found</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerBackBtn}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={22} color="#1D3557" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    {isoCode ? (
                        <CountryFlag isoCode={isoCode} size={28} style={{ borderRadius: 6, marginRight: 4 }} />
                    ) : (
                        <Text style={styles.headerFlag}>{data.flag}</Text>
                    )}
                    <Text style={styles.headerTitle}>{data.name}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {popularFoods.length > 0 && (
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>POPULAR DISHES</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
                        >
                            {popularFoods.map((food, index) => (
                                <PopularFoodCard
                                    key={`pop-${index}`}
                                    item={food}
                                    onPress={() => handleFoodPress(food)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {recommendFoods.length > 0 && (
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>RECOMMEND DISHES</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
                        >
                            {recommendFoods.map((food, index) => (
                                <PopularFoodCard
                                    key={`rec-${index}`}
                                    item={food}
                                    onPress={() => handleFoodPress(food)}
                                    badgeLabel="Recommend"
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {normalFoods.length > 0 && (
                    <View style={[styles.sectionContainer, { paddingHorizontal: 20 }]}>
                        <Text style={styles.sectionTitle}>MORE TO EXPLORE</Text>
                        {normalFoods.map((food, index) => (
                            <NormalFoodItem
                                key={`norm-${index}`}
                                item={food}
                                onPress={() => handleFoodPress(food)}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 44,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerBackBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F2F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerFlag: {
        fontSize: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1D3557',
    },

    scrollContent: {
        paddingBottom: 100,
        paddingTop: 20,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#889',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
        marginLeft: 20,
    },
    largeCard: {
        width: width * 0.8,
        height: 220,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    largeCardImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    largeCardOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    largeCardContent: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 20,
    },
    largeCardBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#E63946',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 8,
    },
    largeCardBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    largeCardTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    largeCardDesc: {
        fontSize: 13,
        color: '#eee',
        marginBottom: 10,
    },
    largeCardMeta: {
        flexDirection: 'row',
        gap: 8,
    },
    metaChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    metaChipText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
    smallCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        gap: 16,
    },
    smallCardImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#f0f0f0',
    },
    smallCardInfo: {
        flex: 1,
    },
    smallCardName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1D3557',
        marginBottom: 4,
    },
    smallCardDesc: {
        fontSize: 13,
        color: '#777',
        lineHeight: 18,
    },

    errorText: {
        fontSize: 18,
        color: '#777',
        marginBottom: 16,
    },
    backBtn: {
        backgroundColor: '#E63946',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    backBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
});