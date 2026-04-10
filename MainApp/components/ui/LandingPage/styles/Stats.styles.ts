import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { LandingStyleParams } from './Shared.styles';
import { StatsStyles } from '@/types/landingPage';

export const getStatsStyles = ({ isDesktop }: LandingStyleParams): StatsStyles => ({
    statsBar: {
        paddingVertical: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFBFC',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: isDesktop ? 60 : 20,
    },
    statIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontFamily: AppFonts.bold,
        fontSize: 40,
        color: AppColors.navy,
    },
    statLabel: {
        fontFamily: AppFonts.bold,
        fontSize: 12,
        color: AppColors.primary,
        marginTop: 4,
        letterSpacing: 2,
    },
    statDivider: {
        width: 1,
        height: 60,
        backgroundColor: '#e2e8f0',
    },
});
