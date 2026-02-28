import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    runOnJS,
    Easing,
} from 'react-native-reanimated';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    LucideIcon,
} from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastProps extends ToastConfig {
    visible: boolean;
    onHide: () => void;
}

const toastThemes: Record<
    ToastType,
    { bg: string; border: string; icon: LucideIcon; iconColor: string; titleColor: string }
> = {
    success: {
        bg: '#f0fdf4',
        border: '#bbf7d0',
        icon: CheckCircle,
        iconColor: '#16a34a',
        titleColor: '#15803d',
    },
    error: {
        bg: '#fef2f2',
        border: '#fecaca',
        icon: XCircle,
        iconColor: '#dc2626',
        titleColor: '#b91c1c',
    },
    warning: {
        bg: '#fffbeb',
        border: '#fde68a',
        icon: AlertTriangle,
        iconColor: '#d97706',
        titleColor: '#b45309',
    },
    info: {
        bg: '#eff6ff',
        border: '#bfdbfe',
        icon: Info,
        iconColor: '#2563eb',
        titleColor: '#1d4ed8',
    },
};

const Toast: React.FC<ToastProps> = ({
    type,
    title,
    message,
    duration = 3000,
    visible,
    onHide,
}) => {
    const translateY = useSharedValue(-120);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.9);

    const theme = toastThemes[type];
    const IconComponent = theme.icon;

    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(0, {
                duration: 400,
                easing: Easing.out(Easing.back(1.2)),
            });
            opacity.value = withTiming(1, { duration: 300 });
            scale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.1)) });

            translateY.value = withDelay(
                duration,
                withTiming(-120, { duration: 350, easing: Easing.in(Easing.ease) })
            );
            opacity.value = withDelay(
                duration,
                withTiming(0, { duration: 300 }, (finished) => {
                    if (finished) {
                        runOnJS(onHide)();
                    }
                })
            );
            scale.value = withDelay(
                duration,
                withTiming(0.9, { duration: 300 })
            );
        } else {
            translateY.value = -120;
            opacity.value = 0;
            scale.value = 0.9;
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { scale: scale.value },
        ],
        opacity: opacity.value,
    }));

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                },
                animatedStyle,
            ]}
        >
            <View style={styles.iconWrapper}>
                <IconComponent size={24} color={theme.iconColor} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: theme.titleColor }]}>
                    {title}
                </Text>
                {message ? (
                    <Text style={styles.message}>{message}</Text>
                ) : null}
            </View>
        </Animated.View>
    );
};

export default Toast;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 56 : 40,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 10,
        zIndex: 9999,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
    },
    message: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
        lineHeight: 18,
    },
});
