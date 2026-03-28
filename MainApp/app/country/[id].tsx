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
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CountryFlag from 'react-native-country-flag';

import { useCountryData } from '@/hooks/useCountryData';
import { FoodItem } from '@/types/recipe';
import { globeCountries } from '@/config/home';
import { AppColors } from '@/constants/colors';
import PopularFoodCard from '@/components/PopularFoodCard';
import NormalFoodItem from '@/components/NormalFoodItem';

const { width } = Dimensions.get('window');

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
                <ActivityIndicator size="large" color={AppColors.primary} />
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
                <View style={styles.contentWrapper}>
                    <View style={styles.headerInner}>
                        <TouchableOpacity
                            style={styles.headerBackBtn}
                            onPress={() => router.back()}
                        >
                            <ArrowLeft size={22} color={AppColors.navy} />
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
                </View>
            </View>

            <ScrollView
                style={styles.flex1}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentWrapper}>
                    {popularFoods.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>POPULAR DISHES</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={Platform.OS === 'web'}
                                contentContainerStyle={styles.horizontalScrollContent}
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
                                showsHorizontalScrollIndicator={Platform.OS === 'web'}
                                contentContainerStyle={styles.horizontalScrollContent}
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
                </View>
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingTop: Platform.OS === 'ios' ? 60 : 44,
        paddingBottom: 16,
    },
    headerInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
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
        color: AppColors.navy,
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 800,
        alignSelf: 'center',
    },
    flex1: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
        paddingTop: 20,
    },
    horizontalScrollContent: {
        paddingHorizontal: 20,
        gap: 16,
        paddingRight: 40,
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
    errorText: {
        fontSize: 18,
        color: '#777',
        marginBottom: 16,
    },
    backBtn: {
        backgroundColor: AppColors.primary,
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    backBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
});