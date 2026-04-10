import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { SharedStyles } from '@/types/landingPage';

export interface LandingStyleParams {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    initialHeight: number;
    scrollY: number;
}

export type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

export const getSharedStyles = ({ isDesktop }: LandingStyleParams): SharedStyles => ({
    sectionHeader: {
        alignItems: 'center',
        marginBottom: 80,
        paddingHorizontal: 24,
    },
    preTitleBadge: {
        backgroundColor: 'rgba(249, 115, 22, 0.05)',
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 6,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(249, 115, 22, 0.1)',
    },
    preTitleText: {
        color: AppColors.primary,
        fontFamily: AppFonts.bold,
        fontSize: 12,
        letterSpacing: 2,
    },
    sectionTitle: {
        fontFamily: AppFonts.bold,
        fontSize: isDesktop ? 48 : 36,
        color: AppColors.navy,
        textAlign: 'center',
        maxWidth: 800,
        lineHeight: isDesktop ? 58 : 44,
    },
    sectionSubtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 18,
        color: AppColors.textSecondary,
        textAlign: 'center',
        maxWidth: 700,
        marginTop: 20,
        lineHeight: 30,
    },
    glassCard: {
        borderRadius: 32,
        overflow: 'hidden',
        position: 'relative',
    },
    glassBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    glassBorder: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 32,
    },
    mockupWrapper: {
        alignItems: 'center',
    },
    deviceContainer: {
        width: 320,
        height: 650,
        position: 'relative',
    },
    deviceFrame: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        borderRadius: 44,
        padding: 12,
        borderWidth: 8,
        borderColor: '#1e293b',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 40,
    },
    deviceNotch: {
        position: 'absolute',
        top: 25,
        left: '50%',
        transform: [{ translateX: -40 }],
        width: 80,
        height: 25,
        backgroundColor: '#000',
        borderRadius: 15,
        zIndex: 10,
    },
    deviceScreen: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        borderRadius: 34,
        overflow: 'hidden',
    },
    deviceScreenImage: {
        width: '100%',
        height: '100%',
    },
    devicePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    devicePlaceholderText: {
        color: 'rgba(255,255,255,0.2)',
        fontFamily: AppFonts.bold,
        fontSize: 16,
        marginTop: 12,
    },
    deviceHomeBar: {
        position: 'absolute',
        bottom: 25,
        left: '50%',
        transform: [{ translateX: -40 }],
        width: 80,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
    },
    deviceShadow: {
        position: 'absolute',
        bottom: -30,
        left: '10%',
        width: '80%',
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 100,
        zIndex: -1,
    },
    deviceLabel: {
        marginTop: 24,
        fontFamily: AppFonts.bold,
        fontSize: 16,
        color: AppColors.navy,
        opacity: 0.8,
    },
});
