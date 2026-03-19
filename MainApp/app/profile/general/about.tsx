import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  CookingPot,
  Globe,
  Heart,
  Users,
  Star,
  MessageCircle,
  Utensils,
  BookOpen,
  Sparkles,
  LucideProps,
} from 'lucide-react-native';
import { useAbout } from '../../../hooks/useAbout';
import { AppColors } from '@/constants/colors';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Globe,
  Heart,
  Users,
  Star,
  MessageCircle,
  Utensils,
  BookOpen,
  Sparkles,
  CookingPot,
};

export default function AboutScreen() {
  const router = useRouter();
  const { data, loading, error } = useAbout();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About ChimDoo</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={AppColors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load content</Text>
        </View>
      ) : ( 
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.hero}>
            <Text style={styles.appName}>ChimDoo</Text>
            <Text style={styles.tagline}>{data?.tagline}</Text>
            <Text style={styles.heroDesc}>{data?.description}</Text>
          </View>

          {(data?.features ?? []).length > 0 && (
            <>
              <Text style={styles.sectionLabel}>What You Can Do</Text>
              {(data?.features ?? []).map((feature, index) => {
                const Icon = ICON_MAP[feature.iconName] ?? CookingPot;
                return (
                  <View key={index} style={styles.featureCard}>
                    <View style={[styles.featureIconWrapper, { backgroundColor: `${feature.color}18` }]}>
                      <Icon size={22} color={feature.color} />
                    </View>
                    <View style={styles.featureText}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDesc}>{feature.desc}</Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}
          {data?.credits ? (
            <View style={styles.creditsCard}>
              <Text style={styles.creditsTitle}>Made with</Text>
              <Text style={styles.creditsText}>{data.credits}</Text>
              <View style={styles.divider} />
              <Text style={styles.creditsFooter}>© 2026 ChimDoo · All rights reserved</Text>
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.backgroundLight },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: AppColors.navy,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 14, color: AppColors.primary },
  scrollContent: { paddingBottom: 60 },
  hero: {
    alignItems: 'center',
    backgroundColor: AppColors.navy,
    paddingTop: 8,
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    marginBottom: 18,
    textAlign: 'center',
  },
  heroDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 28,
    marginBottom: 12,
    marginHorizontal: 24,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  featureIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '700', color: AppColors.navy, marginBottom: 3 },
  featureDesc: { fontSize: 13, color: '#777', lineHeight: 18 },
  creditsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  creditsTitle: { fontSize: 18, fontWeight: '700', color: AppColors.navy, marginBottom: 10 },
  creditsText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22 },
  divider: { height: 1, backgroundColor: '#f0f0f0', width: '100%', marginVertical: 16 },
  creditsFooter: { fontSize: 13, color: '#aaa' },
});