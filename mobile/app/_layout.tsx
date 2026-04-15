/**
 * Root layout — wraps the entire app with:
 *  - Sora font loading
 *  - Splash screen management
 *  - React Query client provider
 *  - Safe area context
 */
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
  Sora_700Bold,
} from '@expo-google-fonts/sora';
import { Colors } from '@/constants/Colors';

// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

// React Query client — shared across the whole app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Show stale data while refetching in background
      staleTime: 5 * 60 * 1000,
      // Retry twice on failure before showing error state
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={Colors.primary} />
        <Stack screenOptions={{ headerShown: false }}>
          {/* Tab screens are managed by (tabs)/_layout.tsx */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Detail screens slide in over tabs */}
          <Stack.Screen
            name="store/[id]"
            options={{
              headerShown: true,
              headerTitle: 'Store Details',
              headerStyle: { backgroundColor: Colors.primary },
              headerTintColor: Colors.textOnPrimary,
              headerTitleStyle: {
                fontFamily: 'Sora_600SemiBold',
                fontSize: 16,
              },
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="promotion/[id]"
            options={{
              headerShown: true,
              headerTitle: 'Offer Details',
              headerStyle: { backgroundColor: Colors.primary },
              headerTintColor: Colors.textOnPrimary,
              headerTitleStyle: {
                fontFamily: 'Sora_600SemiBold',
                fontSize: 16,
              },
              presentation: 'card',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
