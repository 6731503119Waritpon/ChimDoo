import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
  Image,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Globe,
  ChefHat,
  Users,
  Sparkles,
  Smartphone,
  Download,
  Zap,
  MessageCircle,
  ChevronRight,
} from 'lucide-react-native';
import Animated, {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
} from 'react-native-reanimated';
import { AppColors } from '@/constants/colors';
import { AppFonts, AppLayout } from '@/constants/theme';

const GlassCard = ({ children, style }: { children: React.ReactNode, style?: ViewStyle }) => (
  <View style={[styles.glassCard, style]}>
    <View style={styles.glassBackground} />
    <View style={styles.glassBorder} />
    {children}
  </View>
);

const SectionHeader = ({ preTitle, title, subtitle, light = false }: { preTitle: string, title: string, subtitle?: string, light?: boolean }) => (
  <Animated.View entering={FadeInUp.delay(200).duration(1000)} style={styles.sectionHeader}>
    <View style={styles.preTitleBadge}>
      <Text style={styles.preTitleText}>{preTitle}</Text>
    </View>
    <Text style={[styles.sectionTitle, light && { color: '#fff' }]}>{title}</Text>
    {subtitle && <Text style={[styles.sectionSubtitle, light && { color: 'rgba(255,255,255,0.6)' }]}>{subtitle}</Text>}
  </Animated.View>
);

const DeviceMockup = ({ children, label, scale = 1, shadow = true, source }: { children?: React.ReactNode, label?: string, scale?: number, shadow?: boolean, source?: any }) => (
  <View style={[styles.mockupWrapper, { transform: [{ scale }] }]}>
    <View style={styles.deviceContainer}>
      <View style={styles.deviceFrame}>
        <View style={styles.deviceNotch} />
        <View style={styles.deviceScreen}>
          {source ? (
            <Image 
              source={source} 
              style={styles.deviceScreenImage}
              resizeMode="cover"
            />
          ) : children || (
            <LinearGradient
              colors={['#1e293b', '#0f172a']}
              style={styles.devicePlaceholder}
            >
              <Smartphone size={32} color="rgba(255,255,255,0.15)" />
              <Text style={styles.devicePlaceholderText}>Screenshot</Text>
            </LinearGradient>
          )}
        </View>
        <View style={styles.deviceHomeBar} />
      </View>
      {shadow && <View style={styles.deviceShadow} />}
    </View>
    {label && <Text style={styles.deviceLabel}>{label}</Text>}
  </View>
);

const { width: initialWidth, height: initialHeight } = Dimensions.get('window');
let isMobile = initialWidth < 768;
let isTablet = initialWidth >= 768 && initialWidth <= 1024;
let isDesktop = Platform.OS === 'web' && initialWidth > 1024;

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [scrollY, setScrollY] = useState(0);

  const localIsMobile = windowWidth < 768;
  const localIsTablet = windowWidth >= 768 && windowWidth <= 1024;
  const localIsDesktop = Platform.OS === 'web' && windowWidth > 1024;

  isMobile = localIsMobile;
  isTablet = localIsTablet;
  isDesktop = localIsDesktop;

  const HERO_MOCKUP_SCALE = localIsDesktop ? 1.1 : 0.8;
  const SHOWCASE_MOCKUP_SCALE = localIsDesktop ? 0.8 : 0.6;
  const BENTO_MOCKUP_SCALE = 0.4;

  const showcaseItems = [
    { label: 'Home Page', delay: 0, image: require('@/assets/images/Homepage.jpg') },
    { label: 'AI Assistant', delay: 100, image: require('@/assets/images/AIAssistant.jpg') },
    { label: 'Country Selection', delay: 200, image: require('@/assets/images/CountrySelection.jpg') },
    { label: 'Country Discovery', delay: 300, image: require('@/assets/images/CountryDiscovery.jpg') },
    { label: 'Recipe Details', delay: 400, image: require('@/assets/images/RecipeDetails.jpg') },
    { label: 'My Kitchen', delay: 500, image: require('@/assets/images/MyKitchen.jpg') },
    { label: 'Social Community', delay: 600, image: require('@/assets/images/SocialCommunity.jpg') },
    { label: 'Chef Profile', delay: 700, image: require('@/assets/images/ChefProfile.jpg') },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Sticky Production Header */}
      <View style={[styles.stickyHeader, scrollY > 50 && styles.stickyHeaderActive]}>
        <View style={styles.headerContent}>
          <Image
            source={require('@/assets/images/ChimDooLogo2.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.navLinks}>
            <TouchableOpacity onPress={onEnter} style={styles.navLink}>
              <Text style={styles.navLinkText}>Features</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onEnter} style={styles.navLink}>
              <Text style={styles.navLinkText}>Showcase</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onEnter} style={styles.launchButton}>
              <Text style={styles.launchButtonText}>Launch App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        bounces={false}
      >
        {/* Production Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[AppColors.navy, '#1e293b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBackground}
          />

          {/* Decorative Mesh Mesh Gradients */}
          <View style={[styles.meshGradient, { top: -200, right: -200, backgroundColor: AppColors.primary, opacity: 0.15 }]} />
          <View style={[styles.meshGradient, { bottom: -200, left: -200, backgroundColor: AppColors.info, opacity: 0.1 }]} />

          <View style={[styles.heroContent, isDesktop && styles.heroContentDesktop]}>
            <Animated.View
              entering={FadeInLeft.duration(1000)}
              style={styles.heroTextContainer}
            >
              <View style={styles.heroBadge}>
                <Sparkles size={14} color={AppColors.orange} />
                <Text style={styles.heroBadgeText}>VERSION 1.0 IS HERE</Text>
              </View>

              <Text style={styles.heroTitle}>
                Discover the World,{' '}
                <Text style={{ color: AppColors.primary }}>One Dish</Text> at a Time.
              </Text>
              
              <Text style={[styles.heroSubtitle, isMobile && { fontSize: 16, lineHeight: 24 }]}>
                ChimDoo brings global culinary traditions straight to your kitchen. 
                Uncover secret recipes and expert techniques from the world's most vibrant food cultures.
              </Text>

              <View style={styles.heroActions}>
                <TouchableOpacity
                  onPress={onEnter}
                  style={styles.heroPrimaryBtn}
                  activeOpacity={0.9}
                >
                  <Text style={styles.heroPrimaryBtnText}>Start Your Journey</Text>
                  <ChevronRight size={20} color="#fff" />
                </TouchableOpacity>

                <View style={styles.platformBadges}>
                  <Download size={18} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.platformText}>Available on iOS and Android</Text>
                </View>
              </View>
            </Animated.View>

            {isDesktop ? (
              <View style={styles.heroVisualContainer}>
                {/* Overlapping Mockups with Depth */}
                <Animated.View
                  entering={FadeInRight.delay(400).duration(1200)}
                  style={styles.heroMockupSecondary}
                >
                  <DeviceMockup scale={0.85} shadow={false} source={require('@/assets/images/Front2.jpg')} />
                </Animated.View>
                <Animated.View
                  entering={FadeInRight.delay(200).duration(1200)}
                  style={styles.heroMockupPrimary}
                >
                  <DeviceMockup scale={1.0} source={require('@/assets/images/Front1.jpg')} />
                </Animated.View>
              </View>
            ) : (
              <Animated.View
                entering={FadeInUp.delay(400).duration(1000)}
                style={styles.heroVisualMobile}
              >
                <DeviceMockup scale={0.9} source={require('@/assets/images/Front1.jpg')} />
              </Animated.View>
            )}
          </View>
        </View>

        {/* Statistics Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>190+</Text>
            <Text style={styles.statLabel}>COUNTRIES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>500K+</Text>
            <Text style={styles.statLabel}>FOODIES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1M+</Text>
            <Text style={styles.statLabel}>RECIPES</Text>
          </View>
        </View>

        {/* Mosaic App Showcase (The 7 Screens) */}
        <View style={styles.showcaseSection}>
          <SectionHeader
            preTitle="Experience"
            title="The Most Advanced Mobile Kitchen"
            subtitle="Explore all the core features of ChimDoo, meticulously designed for the best culinary experience."
          />

          <View style={[styles.mosaicGrid, !isDesktop && styles.mosaicGridMobile]}>
            {showcaseItems.map((item, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(item.delay).duration(1000)}
                style={[
                  styles.mosaicItem,
                  isDesktop && (index % 4 === 1 || index % 4 === 3) ? { marginTop: 40 } : { marginTop: 0 }
                ]}
              >
                <DeviceMockup label={item.label} scale={SHOWCASE_MOCKUP_SCALE} source={item.image} />
              </Animated.View>
            ))}
          </View>
        </View>

        <View style={styles.featuresSection}>
          <LinearGradient
            colors={['#0f172a', '#1e293b']}
            style={styles.featuresBackground}
          />
          <SectionHeader
            light
            preTitle="Innovation"
            title="Beyond Simple Cooking"
            subtitle="We push the boundaries of what a food app can do with cutting-edge tech."
          />

          <View style={[styles.bentoGrid, isDesktop && styles.bentoGridDesktop]}>
            <GlassCard style={styles.bentoCardLarge}>
              <View style={styles.bentoCardContent}>
                <View style={styles.bentoIconBox}>
                  <MessageCircle size={32} color={AppColors.primary} />
                </View>
                <Text style={styles.bentoTitle}>Vibrant Foodie Community</Text>
                <Text style={styles.bentoDesc}>
                  Join a thriving community where every dish tells a story. Share your 
                  latest creations, exchange secret tips, and get inspired by what the 
                  world is cooking right now.
                </Text>
              </View>
              {isDesktop && (
                <View style={styles.bentoVisual}>
                  <DeviceMockup scale={0.7} label="Social Hub" shadow={false} source={require('@/assets/images/Comment.jpg')} />
                </View>
              )}
            </GlassCard>

            <View style={styles.bentoRightCol}>
              <GlassCard style={styles.bentoCardSmall}>
                <View style={styles.bentoIconBox}>
                  <Zap size={24} color={AppColors.orange} />
                </View>
                <Text style={styles.bentoTitleSmall}>Expert Sous-Chef</Text>
                <Text style={styles.bentoDescSmall}>
                  Get real-time advice, instant ingredient substitutions, and professional culinary guidance.
                </Text>
              </GlassCard>

              <GlassCard style={styles.bentoCardSmall}>
                <View style={styles.bentoIconBox}>
                  <Users size={24} color={AppColors.info} />
                </View>
                <Text style={styles.bentoTitleSmall}>Foodie Social</Text>
                <Text style={styles.bentoDescSmall}>
                  Join a global community of amateur and professional chefs.
                </Text>
              </GlassCard>
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <GlassCard style={styles.ctaContainer}>
            <Text style={styles.ctaTitle}>Ready to spice up your life?</Text>
            <Text style={styles.ctaSubtitle}>
              Join the future of global culinary discovery. Download ChimDoo today.
            </Text>
            <TouchableOpacity onPress={onEnter} style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Get Started for Free</Text>
            </TouchableOpacity>
            <View style={styles.ctaMockups}>
              <View style={{ transform: [{ rotate: '-15deg' }, { translateX: 40 }] }}>
                <DeviceMockup scale={0.7} shadow={false} source={require('@/assets/images/Back2.jpg')} />
              </View>
              <View style={{ transform: [{ rotate: '15deg' }, { translateX: -40 }], zIndex: -1 }}>
                <DeviceMockup scale={0.6} shadow={false} source={require('@/assets/images/Back1.jpg')} />
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Production Footer */}
        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <View style={styles.footerBrand}>
              <Image
                source={require('@/assets/images/ChimDooLogo2.png')}
                style={styles.footerLogo}
                resizeMode="contain"
              />
              <Text style={styles.footerTagline}>Discover. Cook. Share.</Text>
            </View>
            <View style={styles.footerLinks}>
              <View style={styles.footerCol}>
                <Text style={styles.footerColTitle}>PRODUCT</Text>
                <Text style={styles.footerLink}>Features</Text>
                <Text style={styles.footerLink}>Smart Assistant</Text>
                <Text style={styles.footerLink}>Community</Text>
              </View>
              <View style={styles.footerCol}>
                <Text style={styles.footerColTitle}>COMPANY</Text>
                <Text style={styles.footerLink}>About Us</Text>
                <Text style={styles.footerLink}>Privacy</Text>
                <Text style={styles.footerLink}>Terms</Text>
              </View>
            </View>
          </View>
          <View style={styles.footerBottom}>
            <Text style={styles.footerCopy}>© 2026 ChimDoo. All rights reserved. Created with passion for food lovers.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
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
  heroSection: {
    paddingTop: isMobile ? 120 : 160,
    paddingBottom: isMobile ? 60 : 100,
    paddingHorizontal: isDesktop ? 80 : 24,
    minHeight: initialHeight > 800 ? 800 : initialHeight,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  meshGradient: {
    position: 'absolute',
    width: 800,
    height: 800,
    borderRadius: 400,
  },
  heroContent: {
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    zIndex: 10,
  },
  heroContentDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTextContainer: {
    flex: 1.2,
    alignItems: isDesktop ? 'flex-start' : 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    marginBottom: 32,
    gap: 8,
  },
  heroBadgeText: {
    color: AppColors.primary,
    fontFamily: AppFonts.bold,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontFamily: AppFonts.bold,
    fontSize: isDesktop ? 72 : 48,
    color: '#fff',
    lineHeight: isDesktop ? 82 : 56,
    marginBottom: 24,
    textAlign: isDesktop ? 'left' : 'center',
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontFamily: AppFonts.regular,
    fontSize: 20,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 32,
    marginBottom: 48,
    maxWidth: 600,
    textAlign: isDesktop ? 'left' : 'center',
  },
  heroActions: {
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    gap: 32,
  },
  heroPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 100,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  heroPrimaryBtnText: {
    color: '#fff',
    fontFamily: AppFonts.bold,
    fontSize: 18,
    marginRight: 10,
  },
  platformBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  platformText: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: AppFonts.medium,
    fontSize: 14,
  },
  heroVisualContainer: {
    flex: 1,
    height: 600,
    position: 'relative',
  },
  heroVisualMobile: {
    marginTop: 60,
    alignItems: 'center',
  },
  heroMockupPrimary: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  heroMockupSecondary: {
    position: 'absolute',
    top: 80,
    right: 220,
    zIndex: 1,
    opacity: 0.5,
  },
  statsBar: {
    paddingVertical: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: isDesktop ? 60 : 20,
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
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  showcaseSection: {
    paddingVertical: 120,
    backgroundColor: '#fff',
  },
  mosaicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 40,
    paddingHorizontal: 24,
    maxWidth: 1600,
    alignSelf: 'center',
  },
  mosaicGridMobile: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  mosaicItem: {
    width: isDesktop ? '22%' : isTablet ? '45%' : '100%',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 80,
    paddingHorizontal: 24,
  },
  preTitleBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 16,
  },
  preTitleText: {
    color: AppColors.primary,
    fontFamily: AppFonts.bold,
    fontSize: 12,
    letterSpacing: 2,
  },
  sectionTitle: {
    fontFamily: AppFonts.bold,
    fontSize: 42,
    color: AppColors.navy,
    textAlign: 'center',
    maxWidth: 800,
    lineHeight: 52,
  },
  sectionSubtitle: {
    fontFamily: AppFonts.regular,
    fontSize: 18,
    color: AppColors.textSecondary,
    textAlign: 'center',
    maxWidth: 700,
    marginTop: 20,
    lineHeight: 30,
  },
  featuresSection: {
    paddingVertical: 120,
    position: 'relative',
    overflow: 'hidden',
  },
  featuresBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  bentoGrid: {
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 24,
    gap: 24,
  },
  bentoGridDesktop: {
    flexDirection: 'row',
  },
  bentoCardLarge: {
    flex: 1.5,
    flexDirection: 'row',
    height: 500,
    padding: 60,
    paddingBottom: 0,
    overflow: 'hidden',
  },
  bentoCardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  bentoVisual: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    transform: [{ translateY: 60 }],
  },
  bentoRightCol: {
    flex: 1,
    gap: 24,
  },
  bentoCardSmall: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
  },
  bentoIconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  bentoTitle: {
    color: '#fff',
    fontFamily: AppFonts.bold,
    fontSize: 32,
    marginBottom: 16,
  },
  bentoDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: AppFonts.regular,
    fontSize: 18,
    lineHeight: 28,
  },
  bentoTitleSmall: {
    color: '#fff',
    fontFamily: AppFonts.bold,
    fontSize: 24,
    marginBottom: 12,
  },
  bentoDescSmall: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: AppFonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  ctaSection: {
    paddingVertical: 120,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  ctaContainer: {
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    padding: isDesktop ? 100 : 40,
    alignItems: 'center',
    backgroundColor: AppColors.navy,
    borderRadius: 40,
    overflow: 'hidden',
  },
  ctaTitle: {
    color: '#fff',
    fontFamily: AppFonts.bold,
    fontSize: isDesktop ? 60 : 36,
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: AppFonts.regular,
    fontSize: 20,
    textAlign: 'center',
    maxWidth: 600,
    marginBottom: 48,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 100,
  },
  ctaButtonText: {
    color: AppColors.navy,
    fontFamily: AppFonts.bold,
    fontSize: 18,
  },
  ctaMockups: {
    flexDirection: 'row',
    marginTop: 60,
    marginBottom: -100,
  },
  footer: {
    paddingTop: 100,
    paddingBottom: 40,
    backgroundColor: '#fff',
    paddingHorizontal: isDesktop ? 80 : 24,
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
    borderTopColor: '#f1f5f9',
    paddingTop: 40,
    alignItems: 'center',
  },
  footerCopy: {
    color: 'rgba(15, 23, 42, 0.4)',
    fontSize: 14,
    textAlign: 'center',
  },
  glassCard: {
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 32,
  },
  mockupWrapper: {
    alignItems: 'center',
  },
  deviceContainer: {
    width: 320,
    height: 650,
    position: 'relative',
  },
  deviceFrame: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 44,
    padding: 12,
    borderWidth: 8,
    borderColor: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
  },
  deviceNotch: {
    position: 'absolute',
    top: 25,
    left: '50%',
    transform: [{ translateX: -40 }],
    width: 80,
    height: 25,
    backgroundColor: '#000',
    borderRadius: 15,
    zIndex: 10,
  },
  deviceScreen: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 34,
    overflow: 'hidden',
  },
  deviceScreenImage: {
    width: '100%',
    height: '100%',
  },
  devicePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  devicePlaceholderText: {
    color: 'rgba(255,255,255,0.2)',
    fontFamily: AppFonts.bold,
    fontSize: 16,
    marginTop: 12,
  },
  deviceHomeBar: {
    position: 'absolute',
    bottom: 25,
    left: '50%',
    transform: [{ translateX: -40 }],
    width: 80,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
  },
  deviceShadow: {
    position: 'absolute',
    bottom: -30,
    left: '10%',
    width: '80%',
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 100,
    zIndex: -1,
  },
  deviceLabel: {
    marginTop: 24,
    fontFamily: AppFonts.bold,
    fontSize: 16,
    color: AppColors.navy,
    opacity: 0.8,
  },
});
