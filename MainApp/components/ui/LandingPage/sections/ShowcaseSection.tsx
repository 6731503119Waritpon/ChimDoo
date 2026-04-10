import React, { useEffect } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue, useAnimatedStyle,
    withRepeat, withTiming, Easing,
} from 'react-native-reanimated';
import { SectionHeader, DeviceMockup } from '../shared';
import { SHOWCASE_ITEMS } from '../LandingPage.constants';

const GAP = 24;
const SPEED = 35;

import { ShowcaseSectionProps } from '@/types/landingPage';

export const ShowcaseSection = ({ isDesktop, styles }: ShowcaseSectionProps) => {
    const itemW = isDesktop ? 300 : 240;
    const mockupScale = isDesktop ? 0.75 : 0.55;

    const ROW1 = SHOWCASE_ITEMS.slice(0, 4);
    const ROW2 = SHOWCASE_ITEMS.slice(4, 8);

    const totalRow1 = ROW1.length * (itemW + GAP);
    const totalRow2 = ROW2.length * (itemW + GAP);

    const tx1 = useSharedValue(0);
    const tx2 = useSharedValue(-totalRow2);

    useEffect(() => {
        tx1.value = withRepeat(
            withTiming(-totalRow1, { duration: (totalRow1 / SPEED) * 1000, easing: Easing.linear }),
            -1, false,
        );
        tx2.value = withRepeat(
            withTiming(0, { duration: (totalRow2 / SPEED) * 1000, easing: Easing.linear }),
            -1, false,
        );
    }, [totalRow1, totalRow2]);

    const track1Style = useAnimatedStyle(() => ({ transform: [{ translateX: tx1.value }] }));
    const track2Style = useAnimatedStyle(() => ({ transform: [{ translateX: tx2.value }] }));

    const dup1 = [...ROW1, ...ROW1];
    const dup2 = [...ROW2, ...ROW2];

    return (
        <View style={styles.showcaseSection}>
            <SectionHeader
                preTitle="Experience"
                title="The Most Advanced Mobile Kitchen"
                subtitle="Every screen meticulously crafted for the ultimate culinary journey."
                styles={styles}
            />

            <View style={styles.carouselContainer}>
                <View style={styles.carouselWrapper}>
                    <Animated.View style={[styles.carouselTrack, track1Style]}>
                        {dup1.map((item, i) => (
                            <View key={`r1-${i}`} style={[styles.carouselCard, { width: itemW }]}>
                                <DeviceMockup label={item.label} scale={mockupScale} source={item.image} styles={styles} />
                            </View>
                        ))}
                    </Animated.View>
                </View>

                <View style={[styles.carouselWrapper, { marginBottom: 0 }]}>
                    <Animated.View style={[styles.carouselTrack, track2Style]}>
                        {dup2.map((item, i) => (
                            <View key={`r2-${i}`} style={[styles.carouselCard, { width: itemW }]}>
                                <DeviceMockup label={item.label} scale={mockupScale} source={item.image} styles={styles} />
                            </View>
                        ))}
                    </Animated.View>
                </View>

                <LinearGradient
                    colors={['#ffffff', 'transparent']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.carouselFadeLeft}
                    pointerEvents="none"
                />
                <LinearGradient
                    colors={['transparent', '#ffffff']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.carouselFadeRight}
                    pointerEvents="none"
                />
            </View>
        </View>
    );
};
