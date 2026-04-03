import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SectionHeader, DeviceMockup } from '../shared';
import { SHOWCASE_ITEMS } from '../LandingPage.constants';

interface ShowcaseSectionProps {
    isDesktop: boolean;
    isTablet: boolean;
    styles: any;
}

export const ShowcaseSection = ({ isDesktop, isTablet, styles }: ShowcaseSectionProps) => {
    const SHOWCASE_MOCKUP_SCALE = isDesktop ? 0.8 : 0.6;

    return (
        <View style={styles.showcaseSection}>
            <SectionHeader
                preTitle="Experience"
                title="The Most Advanced Mobile Kitchen"
                subtitle="Explore all the core features of ChimDoo, meticulously designed for the best culinary experience."
                styles={styles}
            />

            <View style={[styles.mosaicGrid, !isDesktop && styles.mosaicGridMobile]}>
                {SHOWCASE_ITEMS.map((item, index) => (
                    <Animated.View
                        key={index}
                        entering={FadeInUp.delay(item.delay).duration(1000)}
                        style={[
                            styles.mosaicItem,
                            isDesktop && (index % 4 === 1 || index % 4 === 3) ? { marginTop: 40 } : { marginTop: 0 }
                        ]}
                    >
                        <DeviceMockup 
                            label={item.label} 
                            scale={SHOWCASE_MOCKUP_SCALE} 
                            source={item.image} 
                            styles={styles}
                        />
                    </Animated.View>
                ))}
            </View>
        </View>
    );
};
