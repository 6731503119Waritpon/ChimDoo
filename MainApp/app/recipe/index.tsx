import React, { useRef, useEffect, useState } from 'react';
import {
    View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,
    Platform, Alert, ActivityIndicator, Animated, Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ArrowLeft, Clock, Flame, Utensils, UtensilsCrossed, Check, Star, ChefHat, CookingPot } from 'lucide-react-native';
import { FoodItem } from '@/types/recipe';
import { useChimDoo } from '@/hooks/useChimDoo';
import { useCommunity } from '@/hooks/useCommunity';
import { useToast } from '@/components/ToastProvider';
import ChimDooRequiredModal from '@/components/ChimDooRequiredModal';
import ReviewModal from '@/components/ReviewModal';
import { AppColors } from '@/constants/colors';

const HERO_H = 340;
const RADIUS = 28;
const IOS = Platform.OS === 'ios';

function MetaCard({ icon, value, label }: { icon: React.ReactNode; value?: string; label: string }) {
    return (
        <View style={s.metaCard}>
            <View style={s.metaIconBg}>{icon}</View>
            <Text style={s.metaValue} numberOfLines={1}>{value || '—'}</Text>
            <Text style={s.metaLabel}>{label}</Text>
        </View>
    );
}

function IngredientRow({ text, alt }: { text: string; alt: boolean }) {
    return (
        <View style={[s.ingredientRow, alt && s.ingredientRowAlt]}>
            <View style={s.bullet}><View style={s.bulletInner} /></View>
            <Text style={s.ingredientText}>{text}</Text>
        </View>
    );
}

function StepItem({ index, text, isLast }: { index: number; text: string; isLast: boolean }) {
    return (
        <View style={s.step}>
            {!isLast && <View style={s.stepLine} />}
            <LinearGradient colors={[AppColors.primary, '#C62828']} style={s.stepBadge}>
                <Text style={s.stepNum}>{index + 1}</Text>
            </LinearGradient>
            <View style={s.stepCard}>
                <Text style={s.stepText}>{text}</Text>
            </View>
        </View>
    );
}

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

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    const requireLogin = (msg: string, cb: () => void) => {
        if (isLoggedIn) return false;
        Alert.alert('Login Required', msg, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log In', onPress: cb },
        ]);
        return true;
    };

    const handleChimDoo = async () => {
        if (requireLogin('Please log in to save your Chim Doo recipes!', () => router.push('/auth/login'))) return;
        if (!food) return;
        try {
            const saved = await toggleChimDoo(food, category);
            if (saved) toast.success('Chim Doo!', `${food.name} has been added to your list!`);
        } catch {
            toast.error('Error', 'Something went wrong. Please try again.');
        }
    };

    const handleReviewPress = () => {
        if (requireLogin('Please log in to write a review!', () => router.push('/auth/login'))) return;
        if (!isChimDoo) { setShowChimDooRequired(true); return; }
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
        } catch (err) {
            toast.error('Error', 'Failed to post review. Please try again.');
            throw err;
        }
    };

    if (!food) return null;

    const tasteDisplay = Array.isArray(food.taste) ? food.taste.join(', ') : food.taste;
    const ingredientCount = food.ingredients?.length || 0;

    return (
        <View style={s.root}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View style={s.hero}>
                    <Image source={{ uri: food.image }} style={s.heroImg} resizeMode="cover" />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.7)']}
                        locations={[0, 0.4, 1]}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <Text style={s.heroTitle}>{food.name}</Text>
                </View>
                <Animated.View style={[s.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={s.desc}>{food.description}</Text>

                    <View style={s.metaRow}>
                        <MetaCard icon={<Clock size={20} color={AppColors.primary} />} value={food.prepTime} label="Time" />
                        <MetaCard icon={<Flame size={20} color={AppColors.warning} />} value={tasteDisplay} label="Taste" />
                        <MetaCard icon={<Utensils size={20} color={AppColors.navy} />} value={food.servings} label="Serving" />
                    </View>
                    <View style={s.section}>
                        <View style={s.sectionHead}>
                            <View style={s.sectionTitleRow}>
                                <CookingPot size={22} color={AppColors.navy} />
                                <Text style={s.sectionTitle}>Ingredients</Text>
                            </View>
                            {ingredientCount > 0 && (
                                <View style={s.badge}><Text style={s.badgeText}>{ingredientCount}</Text></View>
                            )}
                        </View>
                        {food.ingredients?.map((item, i) => (
                            <IngredientRow key={i} text={item} alt={i % 2 === 0} />
                        )) || <Text style={s.empty}>No ingredients info</Text>}
                    </View>
                    <View style={s.section}>
                        <View style={s.sectionHead}>
                            <View style={s.sectionTitleRow}>
                                <ChefHat size={22} color={AppColors.navy} />
                                <Text style={s.sectionTitle}>Instructions</Text>
                            </View>
                        </View>
                        {food.instructions?.map((step, i) => (
                            <StepItem key={i} index={i} text={step} isLast={i === (food.instructions!.length - 1)} />
                        )) || <Text style={s.empty}>No instructions info</Text>}
                    </View>

                    <View style={{ height: 100 }} />
                </Animated.View>
            </ScrollView>

            <TouchableOpacity style={s.back} onPress={() => router.back()} activeOpacity={0.7}>
                <BlurView intensity={30} tint="dark" style={s.backBlur}>
                    <ArrowLeft size={22} color="#fff" />
                </BlurView>
            </TouchableOpacity>

            <View style={s.bar}>
                <BlurView intensity={80} tint="light" style={s.barBlur}>
                    <TouchableOpacity
                        style={[s.chimBtn, isChimDoo && s.chimBtnDone]}
                        onPress={handleChimDoo} activeOpacity={0.7} disabled={loading}
                    >
                        <LinearGradient
                            colors={isChimDoo ? ['#f0f0f0', '#e0e0e0'] : [AppColors.primary, '#C62828']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.btnGrad}
                        >
                            {loading ? <ActivityIndicator size="small" color="#fff" /> : isChimDoo ? (
                                <><Check size={20} color={AppColors.navy} /><Text style={s.chimTxtDone}>Tasted!</Text></>
                            ) : (
                                <><UtensilsCrossed size={20} color="#fff" /><Text style={s.chimTxt}>Chim Doo</Text></>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={s.revBtn} onPress={handleReviewPress} activeOpacity={0.7}>
                        <LinearGradient
                            colors={[AppColors.navy, '#0D253F']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.btnGrad}
                        >
                            <Star size={18} color="#FFD700" /><Text style={s.revTxt}>Review</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </BlurView>
            </View>

            <ChimDooRequiredModal visible={showChimDooRequired} onClose={() => setShowChimDooRequired(false)} />
            <ReviewModal visible={showReviewModal} foodName={food.name} onClose={() => setShowReviewModal(false)} onSubmit={handleSubmitReview} />
        </View>
    );
}

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: AppColors.backgroundLight },

    hero: { height: HERO_H, position: 'relative' },
    heroImg: { width: '100%', height: '100%' },
    heroTitle: {
        position: 'absolute', bottom: 46, left: 24, right: 24,
        fontSize: 34, fontWeight: '800', color: '#fff', letterSpacing: -0.5,
        textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 12,
    },
    back: {
        position: 'absolute', top: IOS ? 54 : 42, left: 20, zIndex: 20,
        borderRadius: 22, overflow: 'hidden',
    },
    backBlur: {
        width: 44, height: 44, borderRadius: 22, overflow: 'hidden',
        justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)',
    },
    content: {
        backgroundColor: AppColors.backgroundLight,
        borderTopLeftRadius: RADIUS, borderTopRightRadius: RADIUS,
        marginTop: -RADIUS, paddingHorizontal: 22, paddingTop: 28,
    },
    desc: { fontSize: 16, color: AppColors.textMuted, lineHeight: 25, marginBottom: 22 },
    
    metaRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
    metaCard: {
        flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16, alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    },
    metaIconBg: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: 'rgba(29,53,87,0.08)', justifyContent: 'center', alignItems: 'center', marginBottom: 10,
    },
    metaValue: { fontSize: 13, fontWeight: '700', color: AppColors.textDark, textAlign: 'center', marginBottom: 3 },
    metaLabel: { fontSize: 12, color: AppColors.textLight, fontWeight: '500' },

    section: { marginBottom: 28 },
    sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sectionTitle: { fontSize: 22, fontWeight: '800', color: AppColors.navy, letterSpacing: -0.3 },
    badge: { backgroundColor: AppColors.primary, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, minWidth: 28, alignItems: 'center' },
    badgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },

    ingredientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, marginBottom: 4 },
    ingredientRowAlt: { backgroundColor: 'rgba(29,53,87,0.04)' },
    bullet: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: AppColors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    bulletInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: AppColors.primary },
    ingredientText: { flex: 1, fontSize: 15, color: AppColors.textDark, lineHeight: 22 },

    step: { flexDirection: 'row', marginBottom: 16, position: 'relative' },
    stepLine: { position: 'absolute', left: 17, top: 38, bottom: -16, width: 2.5, backgroundColor: 'rgba(230,57,70,0.15)', borderRadius: 2 },
    stepBadge: {
        width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center',
        marginRight: 14, marginTop: 2,
        shadowColor: AppColors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
    },
    stepNum: { color: '#fff', fontWeight: '800', fontSize: 15 },
    stepCard: {
        flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
    },
    stepText: { fontSize: 15, color: AppColors.textDark, lineHeight: 23 },

    empty: { color: AppColors.textLight, fontStyle: 'italic', fontSize: 14, paddingVertical: 8 },

    bar: { position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden' },
    barBlur: {
        flexDirection: 'row', gap: 12, alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 14, paddingBottom: IOS ? 34 : 22,
        borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.06)',
    },
    chimBtn: { flex: 1, borderRadius: 18, overflow: 'hidden', shadowColor: AppColors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
    chimBtnDone: { shadowColor: '#000', shadowOpacity: 0.08 },
    btnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, paddingHorizontal: 20, borderRadius: 18 },
    chimTxt: { color: '#fff', fontSize: 18, fontWeight: '800' },
    chimTxtDone: { color: AppColors.navy, fontSize: 18, fontWeight: '700' },
    revBtn: { borderRadius: 18, overflow: 'hidden', shadowColor: AppColors.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
    revTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});