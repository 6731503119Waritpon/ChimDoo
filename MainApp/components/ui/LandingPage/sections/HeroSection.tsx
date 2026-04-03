import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Download, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { AppColors } from '@/constants/colors';
import { DeviceMockup } from '../shared';

interface HeroSectionProps {
    isDesktop: boolean;
    isMobile: boolean;
    onEnter: () => void;
    styles: any;
}

export const HeroSection = ({ isDesktop, isMobile, onEnter, styles }: HeroSectionProps) => (
    <View style={styles.heroSection}>
        <LinearGradient
            colors={[AppColors.navy, '#1e293b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBackground}
        />
        <View style={[styles.meshGradient, { top: -200, right: -200, backgroundColor: AppColors.primary, opacity: 0.15 }]} />
        <View style={[styles.meshGradient, { bottom: -200, left: -200, backgroundColor: AppColors.info, opacity: 0.1 }]} />

        <View style={[styles.heroContent, isDesktop && styles.heroContentDesktop]}>
            <Animated.View
                entering={FadeInLeft.duration(1000)}
                style={styles.heroTextContainer}
            >
                <View style={styles.heroBadge}>
                    <Sparkles size={14} color={AppColors.orange} />
                    <Text style={styles.heroBadgeText}>VERSION 1.0 IS HERE</Text>
                </View>

                <Text style={styles.heroTitle}>
                    Discover the World,{' '}
                    <Text style={{ color: AppColors.primary }}>One Dish</Text> at a Time.
                </Text>

                <Text style={[styles.heroSubtitle, isMobile && { fontSize: 16, lineHeight: 24 }]}>
                    ChimDoo brings global culinary traditions straight to your kitchen. 
                    Uncover secret recipes and expert techniques from the world's most vibrant food cultures.
                </Text>

                <View style={styles.heroActions}>
                    <TouchableOpacity
                        onPress={onEnter}
                        style={styles.heroPrimaryBtn}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.heroPrimaryBtnText}>Start Your Journey</Text>
                        <ChevronRight size={20} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.platformBadges}>
                        <Download size={18} color="rgba(255,255,255,0.4)" />
                        <Text style={styles.platformText}>Available on iOS and Android</Text>
                    </View>
                </View>
            </Animated.View>

            {isDesktop ? (
                <View style={styles.heroVisualContainer}>
                    <Animated.View
                        entering={FadeInRight.delay(400).duration(1200)}
                        style={styles.heroMockupSecondary}
                    >
                        <DeviceMockup scale={0.85} shadow={false} source={require('@/assets/images/Front2.jpg')} styles={styles} />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInRight.delay(200).duration(1200)}
                        style={styles.heroMockupPrimary}
                    >
                        <DeviceMockup scale={1.0} source={require('@/assets/images/Front1.jpg')} styles={styles} />
                    </Animated.View>
                </View>
            ) : (
                <Animated.View
                    entering={FadeInUp.delay(400).duration(1000)}
                    style={styles.heroVisualMobile}
                >
                    <DeviceMockup scale={0.9} source={require('@/assets/images/Front1.jpg')} styles={styles} />
                </Animated.View>
            )}
        </View>
    </View>
);
