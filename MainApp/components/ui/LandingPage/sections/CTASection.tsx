import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/colors';
import { DeviceMockup } from '../shared';

import { CTASectionProps } from '@/types/landingPage';

export const CTASection = ({ onEnter, styles }: CTASectionProps) => (
    <View style={styles.ctaSection}>
        <View style={styles.ctaContainer}>
            <LinearGradient
                colors={[AppColors.primary, '#F97316']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaBackground}
            />
            <Text style={styles.ctaTitle}>Ready to spice up your life?</Text>
            <Text style={styles.ctaSubtitle}>
                Join the future of global culinary discovery. Download ChimDoo today.
            </Text>
            <TouchableOpacity onPress={onEnter} style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Get Started for Free</Text>
            </TouchableOpacity>
            <View style={styles.ctaMockups}>
                <View style={{ transform: [{ rotate: '-15deg' }, { translateX: 40 }] }}>
                    <DeviceMockup scale={0.7} shadow={false} source={require('@/assets/images/Back2.jpg')} styles={styles} />
                </View>
                <View style={{ transform: [{ rotate: '15deg' }, { translateX: -40 }], zIndex: -1 }}>
                    <DeviceMockup scale={0.6} shadow={false} source={require('@/assets/images/Back1.jpg')} styles={styles} />
                </View>
            </View>
        </View>
    </View>
);
