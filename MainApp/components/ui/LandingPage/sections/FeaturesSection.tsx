import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, Zap, Users } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { SectionHeader, GlassCard, DeviceMockup } from '../shared';

interface FeaturesSectionProps {
    isDesktop: boolean;
    styles: any;
}

export const FeaturesSection = ({ isDesktop, styles }: FeaturesSectionProps) => (
    <View style={styles.featuresSection}>
        <LinearGradient
            colors={['#0f172a', '#1e293b']}
            style={styles.featuresBackground}
        />
        <SectionHeader
            light
            preTitle="Innovation"
            title="Beyond Simple Cooking"
            subtitle="We push the boundaries of what a food app can do with cutting-edge tech."
            styles={styles}
        />

        <View style={[styles.bentoGrid, isDesktop && styles.bentoGridDesktop]}>
            <GlassCard style={styles.bentoCardLarge} styles={styles}>
                <View style={styles.bentoCardContent}>
                    <View style={styles.bentoIconBox}>
                        <MessageCircle size={32} color={AppColors.primary} />
                    </View>
                    <Text style={styles.bentoTitle}>Vibrant Foodie Community</Text>
                    <Text style={styles.bentoDesc}>
                        Join a thriving community where every dish tells a story. Share your 
                        latest creations, exchange secret tips, and get inspired by what the 
                        world is cooking right now.
                    </Text>
                </View>
                {isDesktop && (
                    <View style={styles.bentoVisual}>
                        <DeviceMockup scale={0.7} label="Social Hub" shadow={false} source={require('@/assets/images/Comment.jpg')} styles={styles} />
                    </View>
                )}
            </GlassCard>

            <View style={styles.bentoRightCol}>
                <GlassCard style={styles.bentoCardSmall} styles={styles}>
                    <View style={styles.bentoIconBox}>
                        <Zap size={24} color={AppColors.orange} />
                    </View>
                    <Text style={styles.bentoTitleSmall}>Expert Sous-Chef</Text>
                    <Text style={styles.bentoDescSmall}>
                        Get real-time advice, instant ingredient substitutions, and professional culinary guidance.
                    </Text>
                </GlassCard>

                <GlassCard style={styles.bentoCardSmall} styles={styles}>
                    <View style={styles.bentoIconBox}>
                        <Users size={24} color={AppColors.info} />
                    </View>
                    <Text style={styles.bentoTitleSmall}>Foodie Social</Text>
                    <Text style={styles.bentoDescSmall}>
                        Join a global community of amateur and professional chefs.
                    </Text>
                </GlassCard>
            </View>
        </View>
    </View>
);
