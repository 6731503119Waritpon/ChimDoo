import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { LandingStyleParams } from './Shared.styles';
import { LayoutStyles } from '@/types/landingPage';

export const getLayoutStyles = ({ isDesktop, isMobile }: LandingStyleParams): LayoutStyles => ({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        zIndex: 1000,
        justifyContent: 'center',
        paddingHorizontal: isDesktop ? 60 : 20,
    },
    stickyHeaderActive: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
    },
    headerLogo: {
        width: 120,
        height: 40,
    },
    navLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32,
    },
    navLink: {
        display: isMobile ? 'none' : 'flex',
    },
    navLinkText: {
        color: '#fff',
        fontFamily: AppFonts.medium,
        fontSize: 16,
        opacity: 0.8,
    },
    launchButton: {
        backgroundColor: AppColors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 50,
    },
    launchButtonText: {
        color: '#fff',
        fontFamily: AppFonts.bold,
        fontSize: 14,
    },
});
