import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileText } from 'lucide-react-native';
import { usePrivacyPolicy } from '../../../hooks/usePrivacyPolicy';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

export default function PrivacyPolicyScreen() {
    const router = useRouter();
    const { data, loading, error } = usePrivacyPolicy();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ChevronLeft size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy & Terms</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.banner}>
                <View style={styles.bannerIconCircle}>
                    <FileText size={36} color={AppColors.primary} />
                </View>
                <Text style={styles.bannerTitle}>Privacy Policy &{'\n'}Terms of Service</Text>
                <Text style={styles.bannerSub}>
                    {data?.lastUpdated ? `Last updated: ${data.lastUpdated}` : ' '}
                </Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={AppColors.primary} />
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>Failed to load content</Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {(data?.sections ?? []).map((section, index) => (
                        <View key={index} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Text style={styles.sectionContent}>{section.content}</Text>
                        </View>
                    ))}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>© 2026 ChimDoo. All rights reserved.</Text>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppColors.backgroundLight },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: AppColors.navy,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 20,
        color: '#fff',
    },
    banner: {
        alignItems: 'center',
        backgroundColor: AppColors.navy,
        paddingBottom: 32,
        paddingHorizontal: 32,
    },
    bannerIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    bannerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 6,
        lineHeight: 26,
    },
    bannerSub: {
        fontFamily: AppFonts.regular,
        fontSize: 13,
        color: 'rgba(255,255,255,0.55)',
    },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    errorText: {
        fontFamily: AppFonts.medium,
        fontSize: 14,
        color: AppColors.primary,
    },
    scrollContent: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 60 },
    section: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        shadowColor: AppColors.navy,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderLeftWidth: 3,
        borderLeftColor: AppColors.primary,
    },
    sectionTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 15,
        color: AppColors.navy,
        marginBottom: 10,
    },
    sectionContent: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
    },
    footer: { alignItems: 'center', paddingTop: 8, paddingBottom: 16 },
    footerText: {
        fontFamily: AppFonts.regular,
        fontSize: 13,
        color: '#aaa',
    },
});
