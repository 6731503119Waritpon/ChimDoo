import { Pressable, StyleSheet, Text, View } from "react-native"
import React, { useEffect } from "react"
import { icon } from "@/constants/icon"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

interface TabBarButtonProps {
    onPress: (props: any) => void;
    onLongPress: (props: any) => void;
    isFocused: boolean;
    label: any;
    routeName: string;
    color: string;
}

const TabBarButton = ({ onPress, onLongPress, isFocused, label, routeName, color }: TabBarButtonProps) => {
    const scale = useSharedValue(0);
    useEffect(() => {
        scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused),
            { duration: 350 }
    }, [scale, isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2])
        const top = interpolate(scale.value, [0, 1], [0, 9])
        return {
            transform: [{ scale: scaleValue }],
            top
        }
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 1])
        return {
            opacity
        }
    });

    const IconComponent = (icon as any)[routeName];

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
        >
            <Animated.View style={animatedIconStyle}>
                {IconComponent ? IconComponent({
                    color: isFocused ? "#FFF" : "#222",
                }) : null}
            </Animated.View >
            <Animated.Text style={[{ color: isFocused ? "#FFF" : "#222" }, animatedTextStyle]}>
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
        gap: 5
    },
})