import { LandingStyleParams } from './Shared.styles';
import { ShowcaseStyles } from '@/types/landingPage';

export const getShowcaseStyles = ({ isMobile }: LandingStyleParams): ShowcaseStyles => ({
    showcaseSection: {
        paddingVertical: 120,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    carouselContainer: {
        position: 'relative',
    },
    carouselWrapper: {
        overflow: 'hidden',
        marginBottom: 20,
    },
    carouselTrack: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    carouselCard: {
        paddingHorizontal: 12,
        flexShrink: 0,
    },
    carouselFadeLeft: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: isMobile ? 40 : 150,
        zIndex: 10,
    },
    carouselFadeRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: isMobile ? 40 : 150,
        zIndex: 10,
    },
});
