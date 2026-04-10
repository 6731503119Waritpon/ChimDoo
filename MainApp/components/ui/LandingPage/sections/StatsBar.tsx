import React from 'react';
import { View, Text } from 'react-native';
import { Globe, Users, BookOpen } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AppColors } from '@/constants/colors';
import { AnimatedCounter } from '../shared';

const STATS = [
    { target: 190, suffix: '+', label: 'COUNTRIES', icon: Globe,    color: AppColors.navy,    bg: 'rgba(29,53,87,0.06)' },
    { target: 500, suffix: 'K+', label: 'FOODIES',   icon: Users,    color: AppColors.primary, bg: 'rgba(230,57,70,0.06)' },
    { target: 1,   suffix: 'M+', label: 'RECIPES',   icon: BookOpen, color: AppColors.orange,  bg: 'rgba(249,115,22,0.06)' },
];

import { StatsBarProps } from '@/types/landingPage';

export const StatsBar = ({ isDesktop, styles }: StatsBarProps) => (
    <Animated.View entering={FadeInUp.duration(800)} style={styles.statsBar}>
        {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
                <React.Fragment key={i}>
                    <View style={styles.statItem}>
                        <View style={[styles.statIconBox, { backgroundColor: stat.bg }]}>
                            <Icon size={22} color={stat.color} />
                        </View>
                        <AnimatedCounter target={stat.target} suffix={stat.suffix} style={styles.statValue} />
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                    {i < STATS.length - 1 && <View style={styles.statDivider} />}
                </React.Fragment>
            );
        })}
    </Animated.View>
);
