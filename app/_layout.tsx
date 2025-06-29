import { useEffect, useState, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
} from '@expo-google-fonts/nunito';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Medium': Nunito_500Medium,
    'Nunito-SemiBold': Nunito_600SemiBold,
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const mounted = useRef(true);

  // Track component mount status
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        // Ensure splash screen stays visible
        await SplashScreen.preventAutoHideAsync();
        // Artificial delay for splash screen
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Only update state if component is still mounted
        if (mounted.current) {
          setAppIsReady(true);
        }
      }
    }

    if (fontsLoaded || fontError) {
      prepare();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (appIsReady && (fontsLoaded || fontError)) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded, fontError]);

  if (!appIsReady || (!fontsLoaded && !fontError)) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="preferences" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="mood-analysis" />
        <Stack.Screen name="toolbox" />
        <Stack.Screen name="breathing" />
        <Stack.Screen name="mindfulness" />
        <Stack.Screen name="music-player" />
        <Stack.Screen name="affirmations" />
        <Stack.Screen name="mood-trends" />
        <Stack.Screen name="crisis-support" />
        <Stack.Screen name="emergency-contacts" />
        <Stack.Screen name="subscription" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="bot-customization" />
        <Stack.Screen name="streaks" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}