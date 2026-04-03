import React, { memo, FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SharedRecipeImage from '@/components/ui/SharedRecipeImage';
import { Clock, Soup, ChefHat } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import CountryFlag from 'react-native-country-flag';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { AppFonts } from '@/constants/theme';
import { AppColors } from '@/constants/colors';
import { ChimDooItem } from '@/types/recipe';
import { globeCountries } from '@/config/home';

interface GridRecipeCardProps {
    item: ChimDooItem;
    index: number;
    onPress: (item: ChimDooItem) => void;
}

const GridRecipeCard: FC<GridRecipeCardProps> = memo(({ item, index, onPress }) => {
    const countryInfo = globeCountries.find(
        (c) => c.name.toLowerCase() === item.category?.toLowerCase()
    );

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 12, stiffness: 200 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    };

    const delay = (index % 12) * 80;

    return (
        <Animated.View entering={FadeInUp.delay(delay).duration(400).springify()} style={{ flex: 1 }}>
            <Animated.View style={[styles.cardContainer, animatedStyle]}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={0.9}
                    onPress={() => onPress(item)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <View style={styles.imageWrapper}>
                        <SharedRecipeImage
                            source={{ uri: item.image }}
                            style={styles.image}
                            resizeMode="cover"
                            sharedTransitionTag={`recipe-img-${item.id}`}
                        />

                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)']}
                            style={styles.overlayGradient}
                        />

                        {item.category && (
                            <View style={styles.badgeTopLeft}>
                                {countryInfo?.isoCode && (
                                    <CountryFlag
                                        isoCode={countryInfo.isoCode}
                                        size={10}
                                        style={styles.badgeFlag}
                                    />
                                )}
                                <Text style={styles.badgeText}>
                                    {item.category.toUpperCase()}
                                </Text>
                            </View>
                        )}

                        <BlurView intensity={40} tint="dark" style={styles.contentWrapper}>
                            <Text style={styles.title} numberOfLines={2}>
                                {item.name}
                            </Text>

                            <View style={styles.metaRow}>
                                {item.prepTime ? (
                                    <View style={styles.metaItem}>
                                        <Clock size={12} color="#F3F4F6" />
                                        <Text style={styles.metaText}>{item.prepTime}</Text>
                                    </View>
                                ) : null}

                                {item.taste && item.taste.length > 0 ? (
                                    <View style={styles.metaItem}>
                                        <Soup size={12} color="#F3F4F6" />
                                        <Text style={styles.metaText}>{item.taste[0]}</Text>
                                    </View>
                                ) : null}
                            </View>
                        </BlurView>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
});

export default GridRecipeCard;

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        marginBottom: 16,
        marginHorizontal: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 0.85,
        backgroundColor: '#F3F4F6',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlayGradient: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
    },
    badgeTopLeft: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        zIndex: 2,
    },
    badgeFlag: {
        borderRadius: 2,
    },
    badgeText: {
        fontSize: 9,
        fontFamily: AppFonts.bold,
        color: '#111827',
        letterSpacing: 0.8,
    },
    contentWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        paddingTop: 16,
        overflow: 'hidden',
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 16,
        color: '#FFFFFF',
        lineHeight: 20,
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 12,
        color: '#F3F4F6',
    },
});
