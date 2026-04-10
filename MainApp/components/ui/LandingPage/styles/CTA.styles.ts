import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { LandingStyleParams } from './Shared.styles';
import { CTAStyles } from '@/types/landingPage';

export const getCTAStyles = ({ isDesktop }: LandingStyleParams): CTAStyles => ({
    ctaSection: {
        paddingVertical: 120,
        paddingHorizontal: 24,
        backgroundColor: '#fff',
    },
    ctaContainer: {
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
        padding: isDesktop ? 100 : 40,
        alignItems: 'center',
        borderRadius: 40,
        overflow: 'hidden',
    },
    ctaBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    ctaTitle: {
        color: '#fff',
        fontFamily: AppFonts.bold,
        fontSize: isDesktop ? 56 : 32,
        textAlign: 'center',
        marginBottom: 24,
        zIndex: 1,
    },
    ctaSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontFamily: AppFonts.regular,
        fontSize: 20,
        textAlign: 'center',
        maxWidth: 600,
        marginBottom: 48,
        zIndex: 1,
    },
    ctaButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 40,
        paddingVertical: 20,
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        zIndex: 1,
    },
    ctaButtonText: {
        color: AppColors.primary,
        fontFamily: AppFonts.bold,
        fontSize: 18,
    },
    ctaMockups: {
        flexDirection: 'row',
        marginTop: 60,
        marginBottom: -100,
        zIndex: 1,
    },
});
