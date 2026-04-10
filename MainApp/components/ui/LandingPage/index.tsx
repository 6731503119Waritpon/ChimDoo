import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { useLandingPage } from './hooks/useLandingPage';
import { getLandingStyles } from './LandingPage.styles';
import { LandingPageProps } from '@/types/landingPage';

import { StickyHeader } from './sections/StickyHeader';
import { HeroSection } from './sections/HeroSection';
import { StatsBar } from './sections/StatsBar';
import { ShowcaseSection } from './sections/ShowcaseSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { FAQSection } from './sections/FAQSection';
import { CTASection } from './sections/CTASection';
import { FooterSection } from './sections/FooterSection';



export default function LandingPage({ onEnter }: LandingPageProps) {
    const {
        scrollY,
        isMobile,
        isTablet,
        isDesktop,
        initialHeight,
        handleScroll,
        scrollViewRef,
        setSectionOffset,
        scrollToSection,
    } = useLandingPage();

    const styles = getLandingStyles({
        isMobile,
        isTablet,
        isDesktop,
        initialHeight,
        scrollY,
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <StickyHeader
                scrollY={scrollY}
                onEnter={onEnter}
                styles={styles}
                scrollToSection={scrollToSection}
            />

            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                bounces={false}
            >
                <View onLayout={(e) => setSectionOffset('top', e.nativeEvent.layout.y)}>
                    <HeroSection
                        isDesktop={isDesktop}
                        isMobile={isMobile}
                        onEnter={onEnter}
                        styles={styles}
                    />
                </View>

                <StatsBar
                    isDesktop={isDesktop}
                    styles={styles}
                />

                <View
                    style={{ backgroundColor: 'transparent' }}
                    onLayout={(e) => setSectionOffset('experience', e.nativeEvent.layout.y)}
                >
                    <ShowcaseSection
                        isDesktop={isDesktop}
                        isTablet={isTablet}
                        isMobile={isMobile}
                        styles={styles}
                    />
                </View>

                <View
                    style={{ backgroundColor: 'transparent' }}
                    onLayout={(e) => setSectionOffset('innovation', e.nativeEvent.layout.y)}
                >
                    <FeaturesSection
                        isDesktop={isDesktop}
                        isMobile={isMobile}
                        styles={styles}
                    />
                </View>

                <View
                    style={{ backgroundColor: 'transparent' }}
                    onLayout={(e) => setSectionOffset('testimonials', e.nativeEvent.layout.y)}
                >
                    <TestimonialsSection
                        isDesktop={isDesktop}
                        isTablet={isTablet}
                        styles={styles}
                    />
                </View>

                <View
                    style={{ backgroundColor: 'transparent' }}
                    onLayout={(e) => setSectionOffset('faq', e.nativeEvent.layout.y)}
                >
                    <FAQSection
                        isDesktop={isDesktop}
                        styles={styles}
                    />
                </View>

                <CTASection
                    isDesktop={isDesktop}
                    onEnter={onEnter}
                    styles={styles}
                />

                <FooterSection
                    isDesktop={isDesktop}
                    styles={styles}
                />
            </ScrollView>
        </View>
    );
}
