import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useSegments, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import '../global.css';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, useInitialAndroidBarSync } from '../lib/useColorScheme';
import { NAV_THEME } from '../theme';
import { UserProvider } from '../context/UserContext';
import { SafeAreaView, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from './styles/color';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'signin',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useInitialAndroidBarSync();

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function AuthenticationGuard({ children }: { children: React.ReactNode }) {
  const { uid, isLoading } = useUser();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === 'signin';
      
      if (!uid && !inAuthGroup) {
        router.replace('/signin');
      } else if (uid && inAuthGroup) {
        router.replace('/');
      }
    }
  }, [uid, segments, router, isLoading]);
  
  if (isLoading) {
    return (
      <LinearGradient 
        colors={['#D8EEEB', '#FFFFFF']} 
        style={loadingStyles.container}
      >
        <View style={loadingStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary500} />
        </View>
      </LinearGradient>
    );
  }
  
  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <>
    <ThemeProvider value={NAV_THEME['light']}>
      <UserProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <AuthenticationGuard>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="signin" />
              <Stack.Screen name="JournalEntryScreen" />
              <Stack.Screen name="interview" />
              <Stack.Screen name="summary" />
              {/* <Stack.Screen name="signin/email" /> */}
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
          </AuthenticationGuard>
        </SafeAreaView>
      </UserProvider>
    </ThemeProvider>
    </>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});