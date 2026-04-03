import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { Globe, Users } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

import { FeedTab, FeedTabBarProps } from '@/types/community';

export const FeedTabBar: React.FC<FeedTabBarProps> = ({ feedTab, setFeedTab }) => {
    const activeIndex = useSharedValue(feedTab === 'global' ? 0 : 1);

    useEffect(() => {
        activeIndex.value = withTiming(feedTab === 'global' ? 0 : 1, {
            duration: 300,
        });
    }, [feedTab]);

    const globalTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(activeIndex.value, [0, 1], [1, 0.45], 'clamp');
        const scale = interpolate(activeIndex.value, [0, 1], [1.1, 0.95], 'clamp');
        return { opacity, transform: [{ scale }] };
    });

    const friendsTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(activeIndex.value, [0, 1], [0.45, 1], 'clamp');
        const scale = interpolate(activeIndex.value, [0, 1], [0.95, 1.1], 'clamp');
        return { opacity, transform: [{ scale }] };
    });

    const indicatorStyle = useAnimatedStyle(() => {
        const left = interpolate(activeIndex.value, [0, 1], [0, 50], 'clamp');
        return {
            left: `${left + 15}%`,
            width: '25%',
        };
    });

    return (
        <View style={styles.liquidContainer}>
            <TouchableOpacity
                style={styles.liquidTab}
                onPress={() => setFeedTab('global')}
                activeOpacity={0.6}
            >
                <Animated.View style={[styles.tabInner, globalTextStyle]}>
                    <Globe
                        size={20}
                        color={AppColors.navy}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={styles.liquidText}>Global</Text>
                </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.liquidTab}
                onPress={() => setFeedTab('friends')}
                activeOpacity={0.6}
            >
                <Animated.View style={[styles.tabInner, friendsTextStyle]}>
                    <Users
                        size={20}
                        color={AppColors.navy}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={styles.liquidText}>Friends</Text>
                </Animated.View>
            </TouchableOpacity>

            <Animated.View style={[styles.liquidIndicator, indicatorStyle]} />
        </View>
    );
};

const styles = StyleSheet.create({
    liquidContainer: {
        flexDirection: 'row',
        marginHorizontal: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 24,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(29, 53, 87, 0.08)',
        marginBottom: 16,
        position: 'relative',
        height: 56,
        alignItems: 'center',
    },
    liquidTab: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    liquidText: {
        fontFamily: AppFonts.bold,
        fontSize: 15,
        color: AppColors.navy,
    },
    liquidIndicator: {
        position: 'absolute',
        bottom: 8,
        height: 4,
        backgroundColor: AppColors.primary,
        borderRadius: 2,
        shadowColor: AppColors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,
    },
});
