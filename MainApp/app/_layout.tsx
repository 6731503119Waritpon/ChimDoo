import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Prompt_300Light,
  Prompt_400Regular,
  Prompt_500Medium,
  Prompt_600SemiBold,
  Prompt_700Bold
} from '@expo-google-fonts/prompt';
import { ToastProvider } from '@/components/ToastProvider';
import 'react-native-reanimated';

const originalWarn = console.warn;
const originalLog = console.log;

const NOISY_PATTERNS = [
  "EXGL: gl.pixelStorei() doesn't support this parameter yet!",
  "THREE.WebGLRenderer: EXT_color_buffer_float extension not supported.",
  "THREE.WARNING: Multiple instances of Three.js being imported.",
];

console.warn = (...args: unknown[]) => {
  const message = args[0];
  if (typeof message === 'string' && NOISY_PATTERNS.some(p => message.includes(p))) {
    return;
  }
  originalWarn.apply(console, args as any);
};

console.log = (...args: unknown[]) => {
  const message = args[0];
  if (typeof message === 'string' && NOISY_PATTERNS.some(p => message.includes(p))) {
    return;
  }
  originalLog.apply(console, args as any);
};

LogBox.ignoreLogs(NOISY_PATTERNS);

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Prompt_300Light,
    Prompt_400Regular,
    Prompt_500Medium,
    Prompt_600SemiBold,
    Prompt_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ToastProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="country" options={{ headerShown: false }} />
          <Stack.Screen name="recipe" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ToastProvider>
    </ThemeProvider>
  );
}
