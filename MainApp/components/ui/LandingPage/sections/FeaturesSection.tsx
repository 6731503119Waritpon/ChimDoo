import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, Zap, Users } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AppColors } from '@/constants/colors';
import { SectionHeader, DeviceMockup } from '../shared';

const FEATURES = [
    {
        icon: MessageCircle,
        iconColor: AppColors.primary,
        iconBg: 'rgba(230,57,70,0.08)',
        title: 'Vibrant Foodie Community',
        desc: 'Join a thriving community where every dish tells a story. Share your latest creations, exchange secret tips, and get inspired by what the world is cooking right now.',
        image: require('@/assets/images/SocialCommunity.jpg'),
        imageLabel: 'Community',
    },
    {
        icon: Zap,
        iconColor: AppColors.orange,
        iconBg: 'rgba(249,115,22,0.08)',
        title: 'Expert Sous-Chef',
        desc: 'Get real-time advice, instant ingredient substitutions, and professional culinary guidance — all powered by advanced AI that understands flavors.',
        image: require('@/assets/images/AIAssistant.jpg'),
        imageLabel: 'AI Assistant',
        reverse: true,
    },
    {
        icon: Users,
        iconColor: AppColors.info,
        iconBg: 'rgba(59,130,246,0.08)',
        title: 'Discover Global Recipes',
        desc: 'Explore authentic dishes from 190+ countries. From Thai street food to French pastry — every recipe is curated by real chefs and local food experts.',
        image: require('@/assets/images/CountryDiscovery.jpg'),
        imageLabel: 'Country Discovery',
    },
];

import { FeaturesSectionProps } from '@/types/landingPage';

export const FeaturesSection = ({ isDesktop, isMobile, styles }: FeaturesSectionProps) => (
    <View style={styles.featuresSection}>
        <LinearGradient
            colors={['#FFF8F0', '#FFFFFF', '#FFF5EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuresBackground}
        />

        <SectionHeader
            preTitle="Innovation"
            title="Beyond Simple Cooking"
            subtitle="We push the boundaries of what a food app can do with cutting-edge tech."
            styles={styles}
        />

        {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
                <Animated.View
                    key={i}
                    entering={FadeInUp.delay(200 + i * 200).duration(800)}
                    style={[styles.featureRow, feat.reverse && styles.featureRowReverse]}
                >
                    <View style={styles.featureImageCol}>
                        <DeviceMockup
                            scale={isDesktop ? 0.85 : 0.75}
                            source={feat.image}
                            label={feat.imageLabel}
                            styles={styles}
                        />
                    </View>
                    <View style={styles.featureTextCol}>
                        <View style={[styles.featureIconBox, { backgroundColor: feat.iconBg }]}>
                            <Icon size={28} color={feat.iconColor} />
                        </View>
                        <Text style={styles.featureTitle}>{feat.title}</Text>
                        <Text style={styles.featureDesc}>{feat.desc}</Text>
                    </View>
                </Animated.View>
            );
        })}
    </View>
);
