import { StyleSheet } from 'react-native';
import { LandingStyleParams } from './styles/Shared.styles';
import { getLayoutStyles } from './styles/Layout.styles';
import { getHeroStyles } from './styles/Hero.styles';
import { getStatsStyles } from './styles/Stats.styles';
import { getShowcaseStyles } from './styles/Showcase.styles';
import { getFeaturesStyles } from './styles/Features.styles';
import { getSharedStyles } from './styles/Shared.styles';
import { getTestimonialsStyles } from './styles/Testimonials.styles';
import { getFAQStyles } from './styles/FAQ.styles';
import { getCTAStyles } from './styles/CTA.styles';
import { getFooterStyles } from './styles/Footer.styles';

import { CombinedLandingStyles } from '@/types/landingPage';

export const getLandingStyles = (params: LandingStyleParams): CombinedLandingStyles => {
    const styles = {
        ...getLayoutStyles(params),
        ...getHeroStyles(params),
        ...getStatsStyles(params),
        ...getShowcaseStyles(params),
        ...getSharedStyles(params),
        ...getFeaturesStyles(params),
        ...getTestimonialsStyles(params),
        ...getFAQStyles(params),
        ...getCTAStyles(params),
        ...getFooterStyles(params),
    };

    return StyleSheet.create<CombinedLandingStyles>(styles);
};

