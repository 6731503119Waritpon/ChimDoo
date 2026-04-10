import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { LandingStyleParams } from './Shared.styles';
import { HeroStyles } from '@/types/landingPage';

export const getHeroStyles = ({ isDesktop, isMobile, initialHeight }: LandingStyleParams): HeroStyles => ({
    heroSection: {
        paddingTop: isMobile ? 120 : 160,
        paddingBottom: isMobile ? 60 : 100,
        paddingHorizontal: isDesktop ? 80 : 24,
        minHeight: initialHeight > 800 ? 800 : initialHeight,
        overflow: 'hidden',
        position: 'relative',
    },
    heroBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    meshGradient: {
        position: 'absolute',
        width: 800,
        height: 800,
        borderRadius: 400,
    },
    heroContent: {
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
        zIndex: 10,
    },
    heroContentDesktop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    heroTextContainer: {
        flex: 1.2,
        alignItems: isDesktop ? 'flex-start' : 'center',
    },
    heroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(249, 115, 22, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 50,
        marginBottom: 32,
        gap: 8,
    },
    heroBadgeText: {
        color: AppColors.primary,
        fontFamily: AppFonts.bold,
        fontSize: 12,
        letterSpacing: 1.5,
    },
    heroTitle: {
        fontFamily: AppFonts.bold,
        fontSize: isDesktop ? 72 : 48,
        color: '#fff',
        lineHeight: isDesktop ? 82 : 56,
        marginBottom: 24,
        textAlign: isDesktop ? 'left' : 'center',
        letterSpacing: -1,
    },
    heroSubtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 20,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 32,
        marginBottom: 48,
        maxWidth: 600,
        textAlign: isDesktop ? 'left' : 'center',
    },
    heroActions: {
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        gap: 32,
    },
    heroPrimaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.primary,
        paddingHorizontal: 36,
        paddingVertical: 20,
        borderRadius: 100,
        shadowColor: AppColors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
    },
    heroPrimaryBtnText: {
        color: '#fff',
        fontFamily: AppFonts.bold,
        fontSize: 18,
        marginRight: 10,
    },
    platformBadges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    platformText: {
        color: 'rgba(255,255,255,0.4)',
        fontFamily: AppFonts.medium,
        fontSize: 14,
    },
    heroVisualContainer: {
        flex: 1,
        height: 600,
        position: 'relative',
    },
    heroVisualMobile: {
        marginTop: 60,
        alignItems: 'center',
    },
    heroMockupPrimary: {
        position: 'absolute',
        top: -20,
        right: -10,
        zIndex: 2,
    },
    heroMockupSecondary: {
        position: 'absolute',
        top: 50,
        right: 250,
        zIndex: 1,
        opacity: 0.6,
    },
});
