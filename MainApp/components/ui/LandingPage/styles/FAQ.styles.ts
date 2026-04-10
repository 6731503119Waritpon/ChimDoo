import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { LandingStyleParams } from './Shared.styles';
import { FAQStyles } from '@/types/landingPage';

export const getFAQStyles = ({ isDesktop }: LandingStyleParams): FAQStyles => ({
    faqSection: {
        paddingVertical: 120,
        backgroundColor: '#FAFBFC',
        paddingHorizontal: isDesktop ? 60 : 24,
    },
    faqContainer: {
        maxWidth: 1000,
        alignSelf: 'center',
        width: '100%',
    },
    faqItem: {
        marginBottom: 16,
        borderRadius: 24,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
    },
    faqQuestion: {
        fontFamily: AppFonts.bold,
        fontSize: 18,
        color: AppColors.navy,
        flex: 1,
        paddingRight: 20,
    },
    faqAnswerContainer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    faqAnswer: {
        fontFamily: AppFonts.regular,
        fontSize: 16,
        lineHeight: 26,
        color: AppColors.textSecondary,
    },
});
