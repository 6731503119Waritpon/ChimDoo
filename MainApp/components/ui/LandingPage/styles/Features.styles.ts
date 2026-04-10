import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { LandingStyleParams } from './Shared.styles';
import { FeaturesStyles } from '@/types/landingPage';

export const getFeaturesStyles = ({ isDesktop }: LandingStyleParams): FeaturesStyles => ({
    featuresSection: {
        paddingVertical: 120,
        position: 'relative',
        overflow: 'hidden',
    },
    featuresBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    featureRow: {
        flexDirection: isDesktop ? 'row' : 'column',
        alignItems: 'center',
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: isDesktop ? 60 : 24,
        gap: isDesktop ? 80 : 40,
        marginBottom: isDesktop ? 120 : 80,
    },
    featureRowReverse: {
        flexDirection: isDesktop ? 'row-reverse' : 'column',
    },
    featureImageCol: {
        flex: 1,
        alignItems: 'center',
    },
    featureTextCol: {
        flex: 1,
    },
    featureIconBox: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    featureTitle: {
        color: AppColors.navy,
        fontFamily: AppFonts.bold,
        fontSize: isDesktop ? 36 : 28,
        marginBottom: 16,
        lineHeight: isDesktop ? 44 : 36,
    },
    featureDesc: {
        color: AppColors.textSecondary,
        fontFamily: AppFonts.regular,
        fontSize: 18,
        lineHeight: 30,
    },
});
