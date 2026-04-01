import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SkeletonProps {
    width: DimensionValue;
    height: DimensionValue;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const Skeleton = ({ width, height, borderRadius = 4, style }: SkeletonProps) => {
    const shimmerAnimatedValue = new Animated.Value(0);

    useEffect(() => {
        const startAnimation = () => {
            shimmerAnimatedValue.setValue(0);
            Animated.timing(shimmerAnimatedValue, {
                toValue: 1,
                duration: 1200,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => startAnimation());
        };

        startAnimation();
    }, []);

    const translateX = shimmerAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200],
    });

    return (
        <View
            style={[
                styles.skeletonContainer,
                { width, height, borderRadius },
                style,
            ]}
        >
            <AnimatedLinearGradient
                colors={['#ebebeb', '#f5f5f5', '#ebebeb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    StyleSheet.absoluteFill,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    skeletonContainer: {
        backgroundColor: '#ebebeb',
        overflow: 'hidden',
    },
});

export default Skeleton;
