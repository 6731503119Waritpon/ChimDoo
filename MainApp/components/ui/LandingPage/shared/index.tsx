import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Smartphone } from 'lucide-react-native';
import { Image } from 'react-native';

export const GlassCard = ({ children, style, styles }: { children: ReactNode, style?: ViewStyle, styles: any }) => (
  <View style={[styles.glassCard, style]}>
    <View style={styles.glassBackground} />
    <View style={styles.glassBorder} />
    {children}
  </View>
);

import Animated, { FadeInUp } from 'react-native-reanimated';

export const SectionHeader = ({ preTitle, title, subtitle, light = false, styles }: { preTitle: string, title: string, subtitle?: string, light?: boolean, styles: any }) => (
  <Animated.View entering={FadeInUp.delay(200).duration(1000)} style={styles.sectionHeader}>
    <View style={styles.preTitleBadge}>
      <Text style={styles.preTitleText}>{preTitle}</Text>
    </View>
    <Text style={[styles.sectionTitle, light && { color: '#fff' }]}>{title}</Text>
    {subtitle && <Text style={[styles.sectionSubtitle, light && { color: 'rgba(255,255,255,0.6)' }]}>{subtitle}</Text>}
  </Animated.View>
);

export const DeviceMockup = ({ children, label, scale = 1, shadow = true, source, styles }: { children?: ReactNode, label?: string, scale?: number, shadow?: boolean, source?: any, styles: any }) => (
  <View style={[styles.mockupWrapper, { transform: [{ scale }] }]}>
    <View style={styles.deviceContainer}>
      <View style={styles.deviceFrame}>
        <View style={styles.deviceNotch} />
        <View style={styles.deviceScreen}>
          {source ? (
            <Image 
              source={source} 
              style={styles.deviceScreenImage}
              resizeMode="cover"
            />
          ) : children || (
            <LinearGradient
              colors={['#1e293b', '#0f172a']}
              style={styles.devicePlaceholder}
            >
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
