import { Pressable, StyleSheet, Text } from "react-native"
import React, { useEffect } from "react"
import { icon } from "@/constants/icon"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { AppFonts } from "@/constants/theme"

interface TabBarButtonProps {
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    label: string;
    routeName: string;
    color: string;
}

const TabBarButton = ({ onPress, onLongPress, isFocused, label, routeName, color }: TabBarButtonProps) => {
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0, {
            damping: 24,
            stiffness: 160,
            overshootClamping: true,
        });
    }, [scale, isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.15], 'clamp');
        const top = interpolate(scale.value, [0, 1], [0, 7], 'clamp');
        return {
            transform: [{ scale: scaleValue }],
            top,
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0], 'clamp');
        return {
            opacity,
        };
    });

    const IconComponent = icon[routeName as keyof typeof icon];

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
        >
            <Animated.View style={animatedIconStyle}>
                {IconComponent ? IconComponent({
                    color: isFocused ? "#FFF" : "#555",
                    size: 22,
                }) : null}
            </Animated.View>
            <Animated.Text style={[
                styles.label,
                { color: isFocused ? "#FFF" : "#555" },
                animatedTextStyle,
            ]}>
                {label}
            </Animated.Text>
        </Pressable>
    )
}

export default TabBarButton

const styles = StyleSheet.create({
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        paddingVertical: 2,
    },
    label: {
        fontFamily: AppFonts.semiBold,
        fontSize: 11,
    },
})
