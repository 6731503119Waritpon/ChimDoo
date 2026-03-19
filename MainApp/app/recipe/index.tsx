import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Flame, Utensils, UtensilsCrossed, Check, Star } from 'lucide-react-native';
import { FoodItem, Taste } from '@/types/recipe';
import { useChimDoo } from '@/hooks/useChimDoo';
import { useCommunity } from '@/hooks/useCommunity';
import { useToast } from '@/components/ToastProvider';
import ChimDooRequiredModal from '@/components/ChimDooRequiredModal';
import ReviewModal from '@/components/ReviewModal';
import { AppColors } from '@/constants/colors';

export default function RecipePage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const toast = useToast();

    const food: FoodItem = params.food ? JSON.parse(params.food as string) : null;
    const category = (params.category as string) || '';

    const { isChimDoo, loading, toggleChimDoo, isLoggedIn } = useChimDoo(food?.name);
    const { addReview, hasReviewed } = useCommunity();

    const [showChimDooRequired, setShowChimDooRequired] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const handleChimDoo = async () => {
        if (!isLoggedIn) {
            Alert.alert(
                'Login Required',
                'Please log in to save your Chim Doo recipes!',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Log In', onPress: () => router.push('/auth/login') },
                ]
            );
            return;
        }

        if (!food) return;

        try {
            const saved = await toggleChimDoo(food, category);
            if (saved) {
                toast.success('Chim Doo!', `${food.name} has been added to your list!`);
            }
        } catch (err: any) {
            console.error('ChimDoo Error:', err);
            toast.error('Error', 'Something went wrong. Please try again.');
        }
    };

    const handleReviewPress = () => {
        if (!isLoggedIn) {
            Alert.alert(
                'Login Required',
                'Please log in to write a review!',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Log In', onPress: () => router.push('/auth/login') },
                ]
            );
            return;
        }

        if (!isChimDoo) {
            setShowChimDooRequired(true);
            return;
        }

        if (food && hasReviewed(food.name)) {
            toast.info('Already Reviewed', 'You already reviewed this dish!');
            router.push('/(tabs)/community');
            return;
        }

        setShowReviewModal(true);
    };

    const handleSubmitReview = async (imageUri: string, description: string) => {
        if (!food) return;
        try {
            await addReview(food.name, imageUri, description, category);
            toast.success('Review Posted!', 'Your review has been shared with the community!');
        } catch (err: any) {
            console.error('Review Error:', err);
            toast.error('Error', 'Failed to post review. Please try again.');
            throw err;
        }
    };

    if (!food) return null;

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: food.image }} style={styles.image} />
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.overlay} />
                <Text style={styles.title}>{food.name}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.description}>{food.description}</Text>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Clock size={20} color={AppColors.primary} />
                        <Text style={styles.metaText}>{food.prepTime}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Flame size={20} color={AppColors.primary} />
                        <Text style={styles.metaText}>{food.taste}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Utensils size={20} color={AppColors.primary} />
                        <Text style={styles.metaText}>{food.servings}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {food.ingredients?.map((item, index) => (
                        <View key={index} style={styles.ingredientRow}>
                            <View style={styles.bullet} />
                            <Text style={styles.ingredientText}>{item}</Text>
                        </View>
                    )) || <Text style={styles.emptyText}>No ingredients info</Text>}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {food.instructions?.map((step, index) => (
                        <View key={index} style={styles.stepContainer}>
                            <View style={styles.stepNumberBadge}>
                                <Text style={styles.stepNumber}>{index + 1}</Text>
                            </View>
                            <Text style={styles.stepText}>{step}</Text>
                        </View>
                    )) || <Text style={styles.emptyText}>No instructions info</Text>}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.bottomBar}>
                <View style={styles.bottomBarRow}>
                    <TouchableOpacity
                        style={[
                            styles.chimDooButton,
                            isChimDoo && styles.chimDooButtonDone,
                        ]}
                        onPress={handleChimDoo}
                        activeOpacity={0.7}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : isChimDoo ? (
                            <>
                                <Check size={22} color={AppColors.navy} />
                                <Text style={styles.chimDooTextDone}>Tasted!</Text>
                            </>
                        ) : (
                            <>
                                <UtensilsCrossed size={22} color="#fff" />
                                <Text style={styles.chimDooText}>Chim Doo</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={handleReviewPress}
                        activeOpacity={0.7}
                    >
                        <Star size={18} color="#fff" />
                        <Text style={styles.reviewButtonText}>Review</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ChimDooRequiredModal
                visible={showChimDooRequired}
                onClose={() => setShowChimDooRequired(false)}
            />

            <ReviewModal
                visible={showReviewModal}
                foodName={food.name}
                onClose={() => setShowReviewModal(false)}
                onSubmit={handleSubmitReview}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    imageContainer: { height: 300, position: 'relative' },
    image: { width: '100%', height: '100%' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 40,
        left: 20,
        zIndex: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    title: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    content: { padding: 20 },
    description: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
        marginBottom: 25,
    },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    metaText: { fontSize: 14, fontWeight: '600', color: '#333' },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: AppColors.navy, marginBottom: 15 },
    ingredientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: AppColors.primary, marginRight: 12 },
    ingredientText: { fontSize: 16, color: '#444' },
    stepContainer: { flexDirection: 'row', marginBottom: 20 },
    stepNumberBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: AppColors.navy,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    stepNumber: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    stepText: { flex: 1, fontSize: 16, color: '#444', lineHeight: 24 },
    emptyText: { color: '#999', fontStyle: 'italic' },

    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderTopWidth: 0.5,
        borderTopColor: '#e5e5e5',
    },
    bottomBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    chimDooButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: AppColors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        shadowColor: AppColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    chimDooButtonDone: {
        backgroundColor: '#e8e8e8',
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    chimDooText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    chimDooTextDone: {
        color: AppColors.navy,
        fontSize: 18,
        fontWeight: '700',
    },
    reviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: AppColors.navy,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        shadowColor: AppColors.navy,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    reviewButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});