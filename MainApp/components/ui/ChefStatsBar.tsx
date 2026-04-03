import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UtensilsCrossed, Globe, Trophy } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

interface ChefStatsBarProps {
    totalDishes: number;
    totalCountries: number;
}

const ChefStatsBar: FC<ChefStatsBarProps> = ({ totalDishes, totalCountries }) => {
    const getRank = (count: number) => {
        if (count >= 100) return 'Master';
        if (count >= 50) return 'Traveler';
        if (count >= 10) return 'Scout';
        return 'Newbie';
    };

    return (
        <Animated.View
            entering={FadeInUp.duration(600).delay(200).springify()}
            style={styles.wrapper}
        >
            <BlurView intensity={25} tint="light" style={styles.container}>
                <View style={styles.statItem}>
                    <View style={[styles.iconBox, { backgroundColor: 'rgba(230, 57, 70, 0.12)' }]}>
                        <UtensilsCrossed size={16} color={AppColors.primary} />
                    </View>
                    <View style={styles.statTextContainer}>
                        <Text style={styles.statValue}>{totalDishes}</Text>
                        <Text style={styles.statLabel} numberOfLines={1}>DISHES</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statItem}>
                    <View style={[styles.iconBox, { backgroundColor: 'rgba(29, 53, 87, 0.1)' }]}>
                        <Globe size={16} color={AppColors.navy} />
                    </View>
                    <View style={styles.statTextContainer}>
                        <Text style={styles.statValue}>{totalCountries}</Text>
                        <Text style={styles.statLabel} numberOfLines={1}>PLACES</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statItem}>
                    <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 191, 4, 0.12)' }]}>
                        <Trophy size={16} color={AppColors.gold} />
                    </View>
                    <View style={styles.statTextContainer}>
                        <Text style={styles.statValue} numberOfLines={1}>{getRank(totalDishes)}</Text>
                        <Text style={styles.statLabel} numberOfLines={1}>RANK</Text>
                    </View>
                </View>
            </BlurView>
        </Animated.View>
    );
};

export default ChefStatsBar;

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 22,
        overflow: 'hidden',
        shadowColor: '#1D3557',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    container: {
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        borderTopWidth: 1,
        borderLeftWidth: 1,
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    statTextContainer: {
        flexShrink: 1,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontFamily: AppFonts.bold,
        fontSize: 14,
        color: AppColors.navy,
    },
    statLabel: {
        fontFamily: AppFonts.bold,
        fontSize: 9,
        color: '#999',
        letterSpacing: 0.5,
        marginTop: -1,
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
});
