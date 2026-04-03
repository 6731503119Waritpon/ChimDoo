import React from 'react';
import { Platform } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import LandingPage from '@/components/ui/LandingPage';

export default function LandingPageRoute() {
  const router = useRouter();

  if (Platform.OS !== 'web') {
    return <Redirect href="/(tabs)" />;
  }

  return <LandingPage onEnter={() => router.replace('/(tabs)')} />;
}
