import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { AppColors } from '@/constants/colors';

export const BouncingDots = () => {
    const dot1 = useSharedValue(0);
    const dot2 = useSharedValue(0);
    const dot3 = useSharedValue(0);

    useEffect(() => {
        const animate = (v: { value: number }, _delay: number) => {
            v.value = withRepeat(
                withSequence(
                    withTiming(-6, { duration: 400 }),
                    withTiming(0, { duration: 400 })
                ),
                -1,
                true
            );
        };
        animate(dot1, 0);
        setTimeout(() => animate(dot2, 0), 200);
        setTimeout(() => animate(dot3, 0), 400);
    }, []);

    const s1 = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }] }));
    const s2 = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }] }));
    const s3 = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }] }));

    return (
        <View style={styles.dotsWrapper}>
            <Animated.View style={[styles.dot, s1]} />
            <Animated.View style={[styles.dot, s2]} />
            <Animated.View style={[styles.dot, s3]} />
        </View>
    );
};

const styles = StyleSheet.create({
    dotsWrapper: { flexDirection: 'row', gap: 4, alignItems: 'center' },
    dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: AppColors.primary },
});
