import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated, PanResponder } from 'react-native';
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
    const translateY = useRef(new Animated.Value(-120)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const theme = toastThemes[type];
    const IconComponent = theme.icon;

    const hideAnimation = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -120,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => onHide());
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponderCapture: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
            },
            onPanResponderRelease: (_, gestureState) => {
                if (Math.abs(gestureState.dx) > 30 || gestureState.dy < -20) {
                    if (timerRef.current) clearTimeout(timerRef.current);

                    Animated.parallel([
                        Animated.timing(translateY, {
                            toValue: -150,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                    ]).start(() => onHide());
                }
            },
        })
    ).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 170,
                    friction: 20,
                    restDisplacementThreshold: 0.5,
                    restSpeedThreshold: 0.5,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true,
                }),
            ]).start();

            timerRef.current = setTimeout(() => {
                hideAnimation();
            }, duration);

            return () => {
                if (timerRef.current) clearTimeout(timerRef.current);
            };
        } else {
            translateY.setValue(-120);
            opacity.setValue(0);
        }
    }, [visible, duration]);

    if (!visible) return null;

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.container,
                {
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                    transform: [{ translateY }],
                    opacity,
                },
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
