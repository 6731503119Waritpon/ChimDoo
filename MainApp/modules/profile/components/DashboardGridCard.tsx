import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    FadeInDown
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LucideIcon } from 'lucide-react-native';
import { AppFonts } from '@/constants/theme';
import { AppColors } from '@/constants/colors';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

import { GridCardProps } from '@/types/menuProfile';

const DashboardGridCard: React.FC<GridCardProps> = ({
    label,
    value,
    icon: Icon,
    color,
    onPress,
    delay = 0
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(400)}
            style={styles.gridCardWrapper}
        >
            <AnimatedTouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                activeOpacity={1}
                style={[styles.gridCardInner, animatedStyle]}
            >
                <View style={styles.gridCard}>
                    <View style={[styles.badgeDot, { backgroundColor: color }]} />

                    <View style={styles.gridCardHeader}>
                        <Icon size={24} color={color} />
                    </View>

                    <View style={styles.gridCardFooter}>
                        <Text style={styles.gridCardLabel}>{label.toUpperCase()}</Text>
                        <Text style={styles.gridCardValue}>{value}</Text>
                    </View>
                </View>
            </AnimatedTouchableOpacity>
        </Animated.View>
    );
};

export default DashboardGridCard;

const styles = StyleSheet.create({
    gridCardWrapper: {
        width: '48.2%',
        borderRadius: 20,
    },
    gridCardInner: {
        flex: 1,
    },
    gridCard: {
        backgroundColor: AppColors.white,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: AppColors.borderSubtle,
        minHeight: 140,
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    gridCardHeader: {
        alignItems: 'flex-start',
    },
    badgeDot: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    gridCardFooter: {
        marginTop: 8,
    },
    gridCardLabel: {
        fontFamily: AppFonts.bold,
        fontSize: 11,
        color: AppColors.textPlaceholder,
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    gridCardValue: {
        fontFamily: AppFonts.bold,
        fontSize: 18,
        color: AppColors.navy,
    },
});
