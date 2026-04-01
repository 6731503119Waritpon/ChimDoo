import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router, Stack } from 'expo-router';
import { ChevronLeft, Globe } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

const LanguageSettings = () => {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Language', headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Language</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.heroSection}>
                    <View style={styles.iconWrapper}>
                        <Globe size={44} color={AppColors.navy} />
                    </View>
                    <Text style={styles.heroTitle}>Language</Text>
                </View>

                <View style={styles.glassCard}>
                    <Text style={styles.cardText}>
                        Currently, ChimDoo is only available in English. We are working on adding more languages soon!
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerLabel}>Upcoming Support</Text>
                    <View style={styles.tagRow}>
                        <View style={styles.tag}><Text style={styles.tagText}>Thai</Text></View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default LanguageSettings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    heroTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 26,
        color: AppColors.navy,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        marginBottom: 40,
    },
    cardText: {
        fontFamily: AppFonts.medium,
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        alignItems: 'center',
    },
    footerLabel: {
        fontFamily: AppFonts.bold,
        fontSize: 11,
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 16,
    },
    tagRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    tag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    tagText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 13,
        color: '#64748B',
    },
});