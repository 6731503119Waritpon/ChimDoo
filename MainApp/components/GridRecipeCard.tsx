import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SharedRecipeImage from './SharedRecipeImage';
import { Clock, Soup } from 'lucide-react-native';
import CountryFlag from 'react-native-country-flag';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { AppFonts } from '@/constants/theme';
import { ChimDooItem } from '@/hooks/useChimDoo';
import { globeCountries } from '@/config/home';

interface GridRecipeCardProps {
    item: ChimDooItem;
    index: number;
    onPress: (item: ChimDooItem) => void;
}

const GridRecipeCard: React.FC<GridRecipeCardProps> = ({ item, index, onPress }) => {
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

                        {item.category && (
                            <View style={styles.badgeTopRight}>
                                {countryInfo?.isoCode && (
                                    <CountryFlag
                                        isoCode={countryInfo.isoCode}
                                        size={10}
                                        style={styles.badgeFlag}
                                    />
                                )}
                                <Text style={styles.badgeText}>
                                    {item.category}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.contentWrapper}>
                        <Text style={styles.title} numberOfLines={2}>
                            {item.name}
                        </Text>

                        <View style={styles.metaRow}>
                            {item.prepTime ? (
                                <View style={styles.metaItem}>
                                    <Clock size={12} color="#9095A0" />
                                    <Text style={styles.metaText}>{item.prepTime}</Text>
                                </View>
                            ) : null}

                            {item.taste && item.taste.length > 0 ? (
                                <View style={styles.metaItem}>
                                    <Soup size={12} color="#9095A0" />
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

export default GridRecipeCard;

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 16,
        marginHorizontal: 8,
        shadowColor: '#1F2937',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#F3F4F6',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badgeTopRight: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.92)',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    badgeFlag: {
        borderRadius: 2,
    },
    badgeText: {
        fontSize: 10,
        fontFamily: AppFonts.bold,
        color: '#374151',
    },
    contentWrapper: {
        padding: 12,
        paddingBottom: 16,
    },
    title: {
        fontFamily: AppFonts.semiBold,
        fontSize: 15,
        color: '#111827',
        lineHeight: 20,
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontFamily: AppFonts.medium,
        fontSize: 12,
        color: '#6B7280',
    },
});
