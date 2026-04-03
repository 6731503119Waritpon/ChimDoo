import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Platform, Alert, ActivityIndicator, Dimensions,
} from 'react-native';
import SharedRecipeImage from '@/components/ui/SharedRecipeImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
    ArrowLeft, Clock, Soup, HandPlatter,
    CookingPot, ChefHat, Check, Star,
    Plus, Minus, Play, UtensilsCrossed
} from 'lucide-react-native';
import Animated, {
    useSharedValue, useAnimatedStyle, useAnimatedScrollHandler,
    interpolate, Extrapolation, FadeInDown, FadeIn
} from 'react-native-reanimated';

import { FoodItem } from '@/types/recipe';
import { useChimDoo } from '@/hooks/useChimDoo';
import { useCommunity } from '@/hooks/useCommunity';
import { useToast } from '@/components/ui/ToastProvider';
import { addToViewingHistory } from '@/services/history';
import ChimDooRequiredModal from '@/components/modals/ChimDooRequiredModal';
import ReviewModal from '@/components/modals/ReviewModal';
import CookingModeModal from '@/components/modals/CookingModeModal';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { getPalette } from '@/utils/paletteEngine';

const { width } = Dimensions.get('window');
const HERO_H = 400;
const HEADER_MIN_H = Platform.OS === 'ios' ? 100 : 80;
const IOS = Platform.OS === 'ios';

export default function RecipePage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const toast = useToast();

    const food: FoodItem = params.food ? JSON.parse(params.food as string) : null;
    const category = (params.category as string) || '';
    const palette = useMemo(() => getPalette(category, food?.name), [category, food]);

    const { isChimDoo, loading, toggleChimDoo, isLoggedIn } = useChimDoo(food?.name);
    const { addReview, hasReviewed } = useCommunity();

    const [servings, setServings] = useState(4);
    const [isExpanded, setIsExpanded] = useState(false);
    const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
    const [showChimDooRequired, setShowChimDooRequired] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showCookingMode, setShowCookingMode] = useState(false);

    const scrollY = useSharedValue(0);

    useEffect(() => {
        if (food && category) {
            addToViewingHistory(food, category);
        }
    }, [food, category]);

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const headerStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [HERO_H - 150, HERO_H - 100], [0, 1], Extrapolation.CLAMP);
        return { opacity, backgroundColor: 'rgba(255,255,255,0.95)' };
    });

    const heroImageStyle = useAnimatedStyle(() => {
        const scale = interpolate(scrollY.value, [-100, 0], [1.3, 1], Extrapolation.CLAMP);
        const translateY = interpolate(scrollY.value, [0, HERO_H], [0, -HERO_H / 2], Extrapolation.CLAMP);
        return { transform: [{ scale }, { translateY }] };
    });

    const titleStyle = useAnimatedStyle(() => {
        const translateY = interpolate(scrollY.value, [0, HERO_H - 100], [0, -40], Extrapolation.CLAMP);
        const scale = interpolate(scrollY.value, [0, HERO_H - 100], [1, 0.8], Extrapolation.CLAMP);
        const opacity = interpolate(scrollY.value, [HERO_H - 120, HERO_H - 80], [1, 0], Extrapolation.CLAMP);
        return { transform: [{ translateY }, { scale }], opacity };
    });

    const handleChimDoo = async () => {
        if (!isLoggedIn) {
            Alert.alert('Login Required', 'Please log in to save recipes!', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log In', onPress: () => router.push('/auth/login') },
            ]);
            return;
        }
        if (!food) return;
        try {
            const saved = await toggleChimDoo(food, category);
            if (saved) toast.success('Chim Doo!', `${food.name} added to your list!`);
        } catch {
            toast.error('Error', 'Something went wrong.');
        }
    };

    const handleReviewPress = () => {
        if (!isLoggedIn) { router.push('/auth/login'); return; }
        if (!isChimDoo) { setShowChimDooRequired(true); return; }
        if (food && hasReviewed(food.name)) {
            toast.info('Already Reviewed', 'Check community feed!');
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

    const parseAmount = (text: string) => {
        const match = text.match(/([0-9./]+)/);
        if (!match) return { num: null, rest: text };
        const numStr = match[0];
        let num = 0;
        if (numStr.includes('/')) {
            const [n, d] = numStr.split('/').map(Number);
            num = n / d;
        } else {
            num = Number(numStr);
        }
        return { num, rest: text.replace(numStr, '').trim() };
    };

    return (
        <View style={styles.root}>
            <Animated.View style={[styles.stickyHeader, headerStyle]}>
                <Text style={styles.headerTitleText} numberOfLines={1}>{food.name}</Text>
            </Animated.View>
            <TouchableOpacity style={styles.back} onPress={() => router.back()} activeOpacity={0.7}>
                <BlurView intensity={20} tint="dark" style={styles.backBlur}>
                    <ArrowLeft size={22} color="#fff" />
                </BlurView>
            </TouchableOpacity>

            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                bounces={true}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                <View style={styles.hero}>
                    <Animated.View style={[styles.heroImgWrapper, heroImageStyle]}>
                        <SharedRecipeImage
                            source={{ uri: food.image }}
                            style={styles.heroImg}
                            resizeMode="cover"
                            sharedTransitionTag={`recipe-img-${food.name}`}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                            style={StyleSheet.absoluteFillObject}
                        />
                    </Animated.View>

                    <Animated.View style={[styles.heroContent, titleStyle]}>
                        <View style={styles.badgeRow}>
                            <View style={[styles.catBadge, { backgroundColor: palette.accent }]}>
                                <Text style={styles.catBadgeText}>{category || 'Recipe'}</Text>
                            </View>
                        </View>
                        <Text style={styles.heroTitle}>{food.name}</Text>

                        <View style={styles.pillRow}>
                            <BlurView intensity={20} tint="light" style={styles.statPill}>
                                <Clock size={16} color="#fff" />
                                <Text style={styles.statText}>{food.prepTime}</Text>
                            </BlurView>
                            <BlurView intensity={20} tint="light" style={styles.statPill}>
                                <Soup size={16} color="#fff" />
                                <Text style={styles.statText}>{Array.isArray(food.taste) ? food.taste.join(', ') : food.taste}</Text>
                            </BlurView>
                        </View>
                    </Animated.View>
                </View>

                <View style={styles.content}>
                    <Animated.View entering={FadeInDown.delay(100)}>
                        <Text 
                            style={styles.desc} 
                            numberOfLines={isExpanded ? undefined : 4}
                        >
                            {food.description}
                        </Text>
                        {(food.description || '').length > 100 && (
                            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                                <Text style={[styles.showMore, { color: palette.primary }]}>
                                    {isExpanded ? 'Show less' : 'Show more'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
                        <View style={styles.sectionHead}>
                            <View style={styles.sectionTitleRow}>
                                <CookingPot size={20} color={palette.primary} />
                                <Text style={styles.sectionTitle}>INGREDIENTS</Text>
                            </View>
                            <View style={[styles.scaler, { borderColor: '#E5E7EB' }]}>
                                <TouchableOpacity onPress={() => setServings(Math.max(1, servings - 1))} style={styles.scaleBtn}>
                                    <Minus size={14} color={AppColors.navy} />
                                </TouchableOpacity>
                                <Text style={styles.scaleVal}>{servings}P</Text>
                                <TouchableOpacity onPress={() => setServings(servings + 1)} style={styles.scaleBtn}>
                                    <Plus size={14} color={AppColors.navy} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {food.ingredients?.map((item, i) => {
                            const { num, rest } = parseAmount(item);
                            const scaledNum = num ? (num * (servings / 4)).toFixed(1).replace(/\.0$/, '') : '';
                            const isChecked = checkedIngredients[i];

                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.ingRow, isChecked && { opacity: 0.5 }]}
                                    activeOpacity={0.7}
                                    onPress={() => setCheckedIngredients(prev => ({ ...prev, [i]: !prev[i] }))}
                                >
                                    <View style={[styles.check, isChecked && { backgroundColor: palette.accent, borderColor: palette.accent }]}>
                                        {isChecked && <Check size={12} color="#fff" />}
                                    </View>
                                    <Text style={[styles.ingText, isChecked && styles.ingTextChecked]}>
                                        {scaledNum} {rest}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
                        <View style={styles.sectionHead}>
                            <View style={styles.sectionTitleRow}>
                                <ChefHat size={20} color={palette.primary} />
                                <Text style={styles.sectionTitle}>INSTRUCTIONS</Text>
                            </View>
                            <TouchableOpacity style={styles.playBtn} onPress={() => setShowCookingMode(true)}>
                                <LinearGradient colors={palette.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.playGrad}>
                                    <Play size={14} color="#fff" />
                                    <Text style={styles.playTxt}>Start Cooking</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {food.instructions?.slice(0, 2).map((step, i) => (
                            <View key={i} style={styles.stepPreview}>
                                <View style={[styles.stepNum, { backgroundColor: palette.secondary }]}>
                                    <Text style={[styles.stepNumTxt, { color: palette.primary }]}>{i + 1}</Text>
                                </View>
                                <Text style={styles.stepPreviewTxt} numberOfLines={2}>{step}</Text>
                            </View>
                        ))}
                        {food.instructions && food.instructions.length > 2 && (
                            <TouchableOpacity onPress={() => setShowCookingMode(true)}>
                                <Text style={[styles.moreSteps, { color: palette.primary }]}>+ {food.instructions.length - 2} more steps</Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </View>
            </Animated.ScrollView>

            <View style={styles.footer}>
                <BlurView intensity={80} tint="light" style={styles.footerBlur}>
                    <TouchableOpacity
                        style={[styles.mainBtn, isChimDoo && { backgroundColor: '#F3F4F6' }]}
                        onPress={handleChimDoo}
                        disabled={loading}
                    >
                        {isChimDoo ? (
                            <View style={styles.btnIn}>
                                <Check size={20} color={palette.primary} />
                                <Text style={[styles.btnTxt, { color: AppColors.navy }]}>Tasted!</Text>
                            </View>
                        ) : (
                            <LinearGradient colors={palette.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btnIn}>
                                <UtensilsCrossed size={20} color="#fff" />
                                <Text style={[styles.btnTxt, { color: '#fff' }]}>Chim Doo</Text>
                            </LinearGradient>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.revBtn} onPress={handleReviewPress}>
                        <Star
                            size={20}
                            color={palette.primary}
                            fill={hasReviewed(food.name) ? palette.primary : "transparent"}
                        />
                    </TouchableOpacity>
                </BlurView>
            </View>

            <ChimDooRequiredModal visible={showChimDooRequired} onClose={() => setShowChimDooRequired(false)} />
            <ReviewModal
                visible={showReviewModal}
                foodName={food.name}
                onClose={() => setShowReviewModal(false)}
                onSubmit={handleSubmitReview}
            />
            <CookingModeModal
                visible={showCookingMode}
                onClose={() => setShowCookingMode(false)}
                steps={food.instructions || []}
                foodName={food.name}
                foodImage={food.image}
                palette={palette}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#fff' },
    back: { position: 'absolute', top: IOS ? 54 : 42, left: 20, zIndex: 40 },
    backBlur: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)' },

    stickyHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_MIN_H, zIndex: 30, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    headerTitleText: { fontFamily: AppFonts.bold, fontSize: 17, color: AppColors.navy, width: '60%', textAlign: 'center' },

    hero: { height: HERO_H, justifyContent: 'flex-end' },
    heroImgWrapper: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
    heroImg: { width: '100%', height: '100%' },
    heroContent: { padding: 24, paddingBottom: 40 },
    badgeRow: { marginBottom: 12 },
    catBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
    catBadgeText: { color: '#fff', fontSize: 12, fontFamily: AppFonts.bold, textTransform: 'uppercase' },
    heroTitle: { color: '#fff', fontSize: 36, fontFamily: AppFonts.bold, marginBottom: 16, letterSpacing: -1 },
    pillRow: { flexDirection: 'row', gap: 10 },
    statPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)' },
    statText: { color: '#fff', fontSize: 13, fontFamily: AppFonts.medium },

    content: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, padding: 28 },
    desc: { fontSize: 16, color: '#6B7280', fontFamily: AppFonts.regular, lineHeight: 26, marginBottom: 16 },
    showMore: { fontFamily: AppFonts.bold, fontSize: 14, marginBottom: 32 },

    section: { marginBottom: 32 },
    sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionTitle: { fontSize: 14, fontFamily: AppFonts.bold, color: AppColors.navy, letterSpacing: 1.5 },

    scaler: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 4, borderWidth: 1 },
    scaleBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
    scaleVal: { paddingHorizontal: 12, fontSize: 14, fontFamily: AppFonts.bold, color: AppColors.navy },

    ingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
    check: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
    ingText: { fontSize: 15, fontFamily: AppFonts.medium, color: AppColors.navy, flex: 1 },
    ingTextChecked: { textDecorationLine: 'line-through', color: '#9CA3AF', opacity: 0.6 },

    playBtn: { borderRadius: 12, overflow: 'hidden' },
    playGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
    playTxt: { color: '#fff', fontSize: 12, fontFamily: AppFonts.bold, letterSpacing: 0.5 },

    stepPreview: { flexDirection: 'row', gap: 16, marginBottom: 18 },
    stepNum: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#eee' },
    stepNumTxt: { fontSize: 13, fontFamily: AppFonts.bold },
    stepPreviewTxt: { flex: 1, fontSize: 15, color: '#4B5563', fontFamily: AppFonts.regular, lineHeight: 22 },
    moreSteps: { fontFamily: AppFonts.bold, fontSize: 14, marginLeft: 44 },

    footer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
    footerBlur: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 16, paddingBottom: IOS ? 34 : 20, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: 'rgba(255,255,255,0.9)' },
    mainBtn: { flex: 1, borderRadius: 24, overflow: 'hidden' },
    btnIn: { height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    btnTxt: { fontSize: 17, fontFamily: AppFonts.bold, letterSpacing: 1 },
    revBtn: { width: 62, height: 62, borderRadius: 24, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#F1F5F9' },
});