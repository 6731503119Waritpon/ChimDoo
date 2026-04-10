import { ViewStyle, TextStyle, ImageStyle, DimensionValue } from 'react-native';

export interface SharedStyles {
    sectionHeader?: ViewStyle;
    preTitleBadge?: ViewStyle;
    preTitleText?: TextStyle;
    sectionTitle?: TextStyle;
    sectionSubtitle?: TextStyle;
    glassCard?: ViewStyle;
    glassBackground?: ViewStyle;
    glassBorder?: ViewStyle;
    mockupWrapper?: ViewStyle;
    deviceContainer?: ViewStyle;
    deviceFrame?: ViewStyle;
    deviceNotch?: ViewStyle;
    deviceScreen?: ViewStyle;
    deviceScreenImage?: ImageStyle;
    devicePlaceholder?: ViewStyle;
    devicePlaceholderText?: TextStyle;
    deviceHomeBar?: ViewStyle;
    deviceShadow?: ViewStyle;
    deviceLabel?: TextStyle;
}

export interface LayoutStyles {
    container?: ViewStyle;
    scrollView?: ViewStyle;
    stickyHeader?: ViewStyle;
    stickyHeaderActive?: ViewStyle;
    headerContent?: ViewStyle;
    headerLogo?: ImageStyle;
    navLinks?: ViewStyle;
    navLink?: ViewStyle;
    navLinkText?: TextStyle;
    launchButton?: ViewStyle;
    launchButtonText?: TextStyle;
}

export interface HeroStyles extends SharedStyles {
    heroSection?: ViewStyle;
    heroBackground?: ViewStyle;
    meshGradient?: ViewStyle;
    heroContent?: ViewStyle;
    heroContentDesktop?: ViewStyle;
    heroTextContainer?: ViewStyle;
    heroBadge?: ViewStyle;
    heroBadgeText?: TextStyle;
    heroTitle?: TextStyle;
    heroSubtitle?: TextStyle;
    heroActions?: ViewStyle;
    heroPrimaryBtn?: ViewStyle;
    heroPrimaryBtnText?: TextStyle;
    platformBadges?: ViewStyle;
    platformText?: TextStyle;
    heroVisualContainer?: ViewStyle;
    heroMockupSecondary?: ViewStyle;
    heroMockupPrimary?: ViewStyle;
    heroVisualMobile?: ViewStyle;
}

export interface StatsStyles {
    statsBar?: ViewStyle;
    statItem?: ViewStyle;
    statIconBox?: ViewStyle;
    statValue?: TextStyle;
    statLabel?: TextStyle;
    statDivider?: ViewStyle;
}

export interface ShowcaseStyles extends SharedStyles {
    showcaseSection?: ViewStyle;
    carouselContainer?: ViewStyle;
    carouselWrapper?: ViewStyle;
    carouselTrack?: ViewStyle;
    carouselCard?: ViewStyle;
    carouselFadeLeft?: ViewStyle;
    carouselFadeRight?: ViewStyle;
}

export interface FeaturesStyles extends SharedStyles {
    featuresSection?: ViewStyle;
    featuresBackground?: ViewStyle;
    featureRow?: ViewStyle;
    featureRowReverse?: ViewStyle;
    featureImageCol?: ViewStyle;
    featureTextCol?: ViewStyle;
    featureIconBox?: ViewStyle;
    featureTitle?: TextStyle;
    featureDesc?: TextStyle;
}

export interface TestimonialsStyles extends SharedStyles {
    testimonialsSection?: ViewStyle;
    testimonialsBackground?: ViewStyle;
    testimonialsGrid?: ViewStyle;
    testimonialCard?: ViewStyle;
    testimonialHeader?: ViewStyle;
    testimonialAvatar?: ImageStyle;
    testimonialInfo?: ViewStyle;
    testimonialName?: TextStyle;
    testimonialHandle?: TextStyle;
    testimonialStars?: ViewStyle;
    testimonialQuote?: TextStyle;
}

export interface FAQStyles extends SharedStyles {
    faqSection?: ViewStyle;
    faqContainer?: ViewStyle;
    faqItem?: ViewStyle;
    faqHeader?: ViewStyle;
    faqQuestion?: TextStyle;
    faqAnswerContainer?: ViewStyle;
    faqAnswer?: TextStyle;
}

export interface CTAStyles extends SharedStyles {
    ctaSection?: ViewStyle;
    ctaContainer?: ViewStyle;
    ctaBackground?: ViewStyle;
    ctaTitle?: TextStyle;
    ctaSubtitle?: TextStyle;
    ctaButton?: ViewStyle;
    ctaButtonText?: TextStyle;
    ctaMockups?: ViewStyle;
}

export interface FooterStyles {
    footer?: ViewStyle;
    footerTop?: ViewStyle;
    footerBrand?: ViewStyle;
    footerLogo?: ImageStyle;
    footerTagline?: TextStyle;
    footerLinks?: ViewStyle;
    footerCol?: ViewStyle;
    footerColTitle?: TextStyle;
    footerLink?: TextStyle;
    footerBottom?: ViewStyle;
    footerCopy?: TextStyle;
}

export interface BaseSectionProps {
    isDesktop?: boolean;
    isMobile?: boolean;
    isTablet?: boolean;
}

export interface StickyHeaderProps {
    scrollY: number;
    onEnter: () => void;
    styles: LayoutStyles;
    scrollToSection: (name: string) => void;
}

export interface HeroSectionProps extends Omit<BaseSectionProps, 'styles'> {
    isMobile: boolean;
    isDesktop: boolean;
    onEnter: () => void;
    styles: HeroStyles;
}

export interface StatsBarProps extends Omit<BaseSectionProps, 'styles'> {
    isDesktop: boolean;
    styles: StatsStyles;
}

export interface ShowcaseSectionProps extends Omit<BaseSectionProps, 'styles'> {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    styles: ShowcaseStyles;
}

export interface FeaturesSectionProps extends Omit<BaseSectionProps, 'styles'> {
    isDesktop: boolean;
    isMobile: boolean;
    styles: FeaturesStyles;
}

export interface TestimonialsSectionProps extends Omit<BaseSectionProps, 'styles'> {
    isDesktop: boolean;
    isTablet: boolean;
    styles: TestimonialsStyles;
}

export interface FAQSectionProps extends Omit<BaseSectionProps, 'styles'> {
    isDesktop: boolean;
    styles: FAQStyles;
}

export interface CTASectionProps extends Omit<BaseSectionProps, 'styles'> {
    isDesktop: boolean;
    onEnter: () => void;
    styles: CTAStyles;
}

export interface FooterSectionProps extends Omit<BaseSectionProps, 'styles'> {
    isDesktop: boolean;
    styles: FooterStyles;
}

export type CombinedLandingStyles = LayoutStyles &
    HeroStyles &
    StatsStyles &
    ShowcaseStyles &
    FeaturesStyles &
    TestimonialsStyles &
    FAQStyles &
    CTAStyles &
    FooterStyles;

export interface LandingPageProps {
    onEnter: () => void;
}

export interface ParticleConfig {
    left: DimensionValue;
    top: DimensionValue;
    size: number;
    duration: number;
    delay: number;
}

