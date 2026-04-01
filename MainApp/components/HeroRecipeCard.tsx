import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SharedRecipeImage from './SharedRecipeImage';
import { Clock, Soup, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import CountryFlag from 'react-native-country-flag';
import { AppFonts } from '@/constants/theme';
import { AppColors } from '@/constants/colors';
import { ChimDooItem } from '@/hooks/useChimDoo';
import { globeCountries } from '@/config/home';

interface HeroRecipeCardProps {
    item: ChimDooItem;
    onPress: (item: ChimDooItem) => void;
}

const HeroRecipeCard: React.FC<HeroRecipeCardProps> = ({ item, onPress }) => {
    const scale = useSharedValue(1);

    const countryInfo = globeCountries.find(
        (c) => c.name.toLowerCase() === item.category?.toLowerCase()
    );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.97, { damping: 12, stiffness: 200 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    };

    return (
        <Animated.View entering={FadeInDown.duration(600).delay(100).springify()}>
            <Animated.View style={[styles.container, animatedStyle]}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={0.9}
                    onPress={() => onPress(item)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <SharedRecipeImage
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="cover"
                        sharedTransitionTag={`recipe-img-${item.id}`}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.2)', 'transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.95)']}
                        locations={[0, 0.3, 0.6, 1]}
                        style={styles.gradient}
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

                    <View style={styles.content}>
                        <View style={styles.featuredLabel}>
                            <Text style={styles.featuredText}>RECENTLY EXPLORED</Text>
                        </View>
                        <Text style={styles.title} numberOfLines={2}>
                            {item.name}
                        </Text>

                        <View style={styles.metaRow}>
                            {item.prepTime ? (
                                <View style={styles.metaItem}>
                                    <Clock size={14} color="#F3F4F6" />
                                    <Text style={styles.metaText}>{item.prepTime}</Text>
                                </View>
                            ) : null}

                            {item.taste && item.taste.length > 0 ? (
                                <View style={styles.metaItem}>
                                    <Soup size={14} color="#F3F4F6" />
                                    <Text style={styles.metaText}>{item.taste[0]}</Text>
                                </View>
                            ) : null}

                            <View style={styles.exploreBtn}>
                                <Text style={styles.exploreBtnText}>Lasted</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

export default HeroRecipeCard;

const styles = StyleSheet.create({
    container: {
        height: 250,
        marginHorizontal: 18,
        marginVertical: 10,
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    badgeTopLeft: {
        position: 'absolute',
        top: 18,
        left: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    badgeFlag: {
        borderRadius: 2,
    },
    badgeText: {
        fontSize: 10,
        fontFamily: AppFonts.bold,
        color: '#111827',
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 24,
    },
    featuredLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.primary,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: AppColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    featuredText: {
        color: '#FFF',
        fontFamily: AppFonts.bold,
        fontSize: 9,
        letterSpacing: 1,
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 32,
        color: '#FFFFFF',
        lineHeight: 38,
        marginBottom: 14,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginRight: 16,
    },
    metaText: {
        fontFamily: AppFonts.bold,
        fontSize: 14,
        color: '#F3F4F6',
    },
    exploreBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    exploreBtnText: {
        color: '#FFF',
        fontFamily: AppFonts.bold,
        fontSize: 12,
    },
});
