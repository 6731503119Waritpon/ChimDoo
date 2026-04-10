import React, { ReactNode, useEffect, useState } from 'react';
import { View, ViewStyle, StyleSheet, Text, TextStyle, DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Smartphone } from 'lucide-react-native';
import { Image, ImageSourcePropType } from 'react-native';
import Animated, {
    useSharedValue, useAnimatedStyle,
    withRepeat, withSequence, withTiming, withDelay,
    Easing, FadeInUp,
} from 'react-native-reanimated';

import { SharedStyles, ParticleConfig } from '@/types/landingPage';

export const GlassCard = ({ children, style, styles }: { children: ReactNode; style?: ViewStyle; styles: SharedStyles }) => (
    <View style={[styles.glassCard, style]}>
        <View style={styles.glassBackground} />
        <View style={styles.glassBorder} />
        {children}
    </View>
);

export const SectionHeader = ({
    preTitle, title, subtitle, light = false, styles,
}: {
    preTitle: string; title: string; subtitle?: string; light?: boolean; styles: SharedStyles;
}) => (
    <Animated.View entering={FadeInUp.delay(200).duration(1000)} style={styles.sectionHeader}>
        <View style={styles.preTitleBadge}>
            <Text style={styles.preTitleText}>{preTitle}</Text>
        </View>
        <Text style={[styles.sectionTitle, light && { color: '#fff' }]}>{title}</Text>
        {subtitle && (
            <Text style={[styles.sectionSubtitle, light && { color: 'rgba(255,255,255,0.6)' }]}>
                {subtitle}
            </Text>
        )}
    </Animated.View>
);

export const DeviceMockup = ({
    children, label, scale = 1, shadow = true, source, styles,
}: {
    children?: ReactNode; label?: string; scale?: number; shadow?: boolean; source?: ImageSourcePropType; styles: SharedStyles;
}) => (
    <View style={[styles.mockupWrapper, { transform: [{ scale }] }]}>
        <View style={styles.deviceContainer}>
            <View style={styles.deviceFrame}>
                <View style={styles.deviceNotch} />
                <View style={styles.deviceScreen}>
                    {source ? (
                        <Image source={source} style={styles.deviceScreenImage} resizeMode="cover" />
                    ) : children || (
                        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.devicePlaceholder}>
                            <Smartphone size={32} color="rgba(255,255,255,0.15)" />
                            <Text style={styles.devicePlaceholderText}>Screenshot</Text>
                        </LinearGradient>
                    )}
                </View>
                <View style={styles.deviceHomeBar} />
            </View>
            {shadow && <View style={styles.deviceShadow} />}
        </View>
        {label && <Text style={styles.deviceLabel}>{label}</Text>}
    </View>
);



const PARTICLE_CONFIGS: ParticleConfig[] = [
    { left: '8%', top: '20%', size: 4, duration: 8000, delay: 0 },
    { left: '22%', top: '65%', size: 6, duration: 10000, delay: 1200 },
    { left: '42%', top: '28%', size: 3, duration: 7500, delay: 2400 },
    { left: '60%', top: '72%', size: 5, duration: 9500, delay: 600 },
    { left: '78%', top: '38%', size: 4, duration: 11000, delay: 1800 },
    { left: '90%', top: '52%', size: 3, duration: 8500, delay: 3000 },
];

const FloatingParticle = ({ left, top, size, duration, delay }: ParticleConfig) => {
    const ty = useSharedValue(0);
    const op = useSharedValue(0.1);

    useEffect(() => {
        ty.value = withDelay(delay,
            withRepeat(withSequence(
                withTiming(-60, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
            ), -1)
        );
        op.value = withDelay(delay,
            withRepeat(withSequence(
                withTiming(0.4, { duration: duration / 2 }),
                withTiming(0.08, { duration: duration / 2 }),
            ), -1)
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateY: ty.value }],
        opacity: op.value,
    }));

    return (
        <Animated.View style={[{
            position: 'absolute',
            left: left,
            top: top,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#fff',
        }, style]} />
    );
};

export const FloatingParticles = () => (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {PARTICLE_CONFIGS.map((p, i) => <FloatingParticle key={i} {...p} />)}
    </View>
);

export const AnimatedCounter = ({
    target, suffix = '', style,
}: {
    target: number; suffix?: string; style?: TextStyle;
}) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const dur = 2000;
        let t0: number | null = null;
        let raf: number;
        const run = (ts: number) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(eased * target));
            if (p < 1) raf = requestAnimationFrame(run);
        };
        const timeout = setTimeout(() => { raf = requestAnimationFrame(run); }, 400);
        return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
    }, [target]);

    return <Text style={style}>{value.toLocaleString()}{suffix}</Text>;
};
