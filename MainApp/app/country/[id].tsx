import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { useCountryData } from '@/hooks/useCountryData';

export default function CountryPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data, loading, error } = useCountryData(id ?? '');

    const handleFoodPress = (food: any) => {
        router.push({
            pathname: '/recipe',
            params: { food: JSON.stringify(food) }
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#E63946" />
                <Text style={{ marginTop: 10, color: '#666' }}>Loading yummy foods...</Text>
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>{error || 'Country not found'}</Text>
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
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={22} color="#1D3557" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerFlag}>{data.flag}</Text>
                    <Text style={styles.headerTitle}>{data.name}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>POPULAR DISHES</Text>

                {data.foods.map((food, index) => (
                    <TouchableOpacity key={index} style={styles.foodCard} activeOpacity={0.7} onPress={() => handleFoodPress(food)}>
                        <Image
                            source={{ uri: food.image }}
                            style={styles.foodImage}
                        />
                        <View style={styles.foodInfo}>
                            <Text style={styles.foodName}>{food.name}</Text>
                            <Text style={styles.foodDesc} numberOfLines={2}>
                                {food.description}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

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
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e5e5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    headerBackBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerFlag: {
        fontSize: 28,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1D3557',
    },

    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 16,
        marginLeft: 4,
    },

    foodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        gap: 16,
    },
    foodImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
    },
    foodInfo: {
        flex: 1,
    },
    foodName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1D3557',
        marginBottom: 4,
    },
    foodDesc: {
        fontSize: 13,
        color: '#777',
        lineHeight: 18,
    },

    errorCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#777',
        marginBottom: 16,
    },
    backBtn: {
        backgroundColor: '#E63946',
        borderRadius: 14,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    backBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});