import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';
import { AppColors } from '@/constants/colors';

interface RecipeSkeletonProps {
    viewMode: 'grid' | 'list';
}

const { width } = Dimensions.get('window');

export default function RecipeSkeleton({ viewMode }: RecipeSkeletonProps) {
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.8, { duration: 800 }),
                withTiming(0.4, { duration: 800 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    if (viewMode === 'grid') {
        return (
            <View style={styles.gridContainer}>
                {[1, 2, 3, 4].map((key) => (
                    <Animated.View key={key} style={[styles.gridCard, animatedStyle]}>
                        <View style={styles.gridImage} />
                        <View style={styles.gridContent}>
                            <View style={styles.textLineLong} />
                            <View style={styles.textLineShort} />
                        </View>
                    </Animated.View>
                ))}
            </View>
        );
    }

    return (
        <View style={styles.listContainer}>
            {[1, 2, 3].map((key) => (
                <Animated.View key={key} style={[styles.listCard, animatedStyle]}>
                    <View style={styles.listImage} />
                    <View style={styles.listContent}>
                        <View style={styles.textLineLong} />
                        <View style={styles.textLineShort} />
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    gridCard: {
        width: (width - 64) / 2,
        marginHorizontal: 8,
        marginBottom: 16,
        backgroundColor: AppColors.white,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: AppColors.borderSubtle,
    },
    gridImage: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: AppColors.borderSubtle,
    },
    gridContent: {
        padding: 12,
        paddingBottom: 16,
        gap: 8,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    listCard: {
        flexDirection: 'row',
        height: 100,
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    listImage: {
        width: 100,
        height: 100,
        backgroundColor: '#E5E7EB',
    },
    listContent: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        gap: 12,
    },
    textLineLong: {
        height: 14,
        width: '80%',
        backgroundColor: '#E5E7EB',
        borderRadius: 6,
    },
    textLineShort: {
        height: 12,
        width: '50%',
        backgroundColor: AppColors.backgroundLight,
        borderRadius: 6,
    },
});
