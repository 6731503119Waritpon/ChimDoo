import React from 'react';
import { View, Text } from 'react-native';
import { AppColors } from '@/constants/colors';

export const StatsBar = ({ isDesktop, styles }: { isDesktop: boolean, styles: any }) => (
    <View style={styles.statsBar}>
        <View style={styles.statItem}>
            <Text style={styles.statValue}>190+</Text>
            <Text style={styles.statLabel}>COUNTRIES</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
            <Text style={styles.statValue}>500K+</Text>
            <Text style={styles.statLabel}>FOODIES</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
            <Text style={styles.statValue}>1M+</Text>
            <Text style={styles.statLabel}>RECIPES</Text>
        </View>
    </View>
);
