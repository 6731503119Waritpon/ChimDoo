import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { LandingStyleParams } from './Shared.styles';
import { TestimonialsStyles } from '@/types/landingPage';

export const getTestimonialsStyles = ({ isDesktop, isTablet }: LandingStyleParams): TestimonialsStyles => ({
    testimonialsSection: {
        paddingVertical: 120,
        backgroundColor: '#fff',
        position: 'relative',
    },
    testimonialsBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(249, 115, 22, 0.02)',
    },
    testimonialsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: isDesktop ? 60 : 24,
        gap: 24,
    },
    testimonialCard: {
        width: isDesktop ? '31.5%' : isTablet ? '47%' : '100%',
        padding: 32,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
    },
    testimonialHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 16,
    },
    testimonialAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f1f5f9',
    },
    testimonialInfo: {
        flex: 1,
    },
    testimonialName: {
        fontFamily: AppFonts.bold,
        fontSize: 18,
        color: AppColors.navy,
        marginBottom: 4,
    },
    testimonialHandle: {
        fontFamily: AppFonts.medium,
        fontSize: 14,
        color: AppColors.textSecondary,
        opacity: 0.8,
    },
    testimonialStars: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 20,
    },
    testimonialQuote: {
        fontFamily: AppFonts.regular,
        fontSize: 16,
        lineHeight: 26,
        color: AppColors.textDark,
        opacity: 0.9,
        fontStyle: 'italic',
    },
});
