import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SharedRecipeImage from './SharedRecipeImage';
import { Clock, Soup } from 'lucide-react-native';
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
        <Animated.View entering={FadeInDown.duration(500).springify()}>
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
                        colors={['transparent', 'rgba(0,0,0,0.85)']}
                        style={styles.gradient}
                    />

                    {item.category && (
                        <View style={styles.badgeTopLeft}>
                            {countryInfo?.isoCode && (
                                <CountryFlag
                                    isoCode={countryInfo.isoCode}
                                    size={12}
                                    style={styles.badgeFlag}
                                />
                            )}
                            <Text style={styles.badgeText}>
                                {item.category}
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
                                    <Clock size={12} color="#D1D5DB" />
                                    <Text style={styles.metaText}>{item.prepTime}</Text>
                                </View>
                            ) : null}

                            {item.taste && item.taste.length > 0 ? (
                                <View style={styles.metaItem}>
                                    <Soup size={12} color="#D1D5DB" />
                                    <Text style={styles.metaText}>{item.taste[0]}</Text>
                                </View>
                            ) : null}
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
        height: 220,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        shadowColor: '#1F2937',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        top: '30%',
    },
    badgeTopLeft: {
        position: 'absolute',
        top: 16,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.92)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 14,
    },
    badgeFlag: {
        borderRadius: 2,
    },
    badgeText: {
        fontSize: 11,
        fontFamily: AppFonts.bold,
        color: '#111827',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 20,
    },
    featuredLabel: {
        backgroundColor: 'rgba(16, 185, 129, 0.9)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8,
    },
    featuredText: {
        color: '#FFF',
        fontFamily: AppFonts.bold,
        fontSize: 9,
        letterSpacing: 1.5,
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 26,
        color: '#FFFFFF',
        lineHeight: 32,
        marginBottom: 10,
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
        fontFamily: AppFonts.medium,
        fontSize: 13,
        color: '#E5E7EB',
    },
});
