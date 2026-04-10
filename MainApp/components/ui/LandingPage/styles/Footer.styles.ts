import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { LandingStyleParams } from './Shared.styles';
import { FooterStyles } from '@/types/landingPage';

export const getFooterStyles = ({ isDesktop, isMobile }: LandingStyleParams): FooterStyles => ({
    footer: {
        paddingTop: 100,
        paddingBottom: 40,
        backgroundColor: '#FAFBFC',
        paddingHorizontal: isDesktop ? 80 : 24,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    footerTop: {
        flexDirection: isDesktop ? 'row' : 'column',
        justifyContent: 'space-between',
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
        gap: 60,
        marginBottom: 80,
    },
    footerBrand: {
        flex: 1,
    },
    footerLogo: {
        width: 140,
        height: 40,
        marginBottom: 20,
    },
    footerTagline: {
        color: AppColors.textSecondary,
        fontFamily: AppFonts.medium,
        fontSize: 16,
    },
    footerLinks: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 40,
    },
    footerCol: {
        gap: 16,
    },
    footerColTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 12,
        color: AppColors.navy,
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    footerLink: {
        color: AppColors.textSecondary,
        fontFamily: AppFonts.medium,
        fontSize: 15,
    },
    footerBottom: {
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#e8ecf0',
        paddingTop: 40,
        alignItems: 'center',
    },
    footerCopy: {
        color: 'rgba(15, 23, 42, 0.4)',
        fontFamily: AppFonts.regular,
        fontSize: 14,
        textAlign: 'center',
    },
});
