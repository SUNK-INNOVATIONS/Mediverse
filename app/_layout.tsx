import { useEffect, useState, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const mounted = useRef(true);
  const { loading: authLoading } = useAuth();

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
        // Wait for auth to initialize
        while (authLoading) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
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
  }, [fontsLoaded, fontError, authLoading]);

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
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="journal" />
        <Stack.Screen name="voice" />
        <Stack.Screen name="suggestions" />
        <Stack.Screen name="crisis" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="about" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}