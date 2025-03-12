import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
// import 'react-native-reanimated';
import '../global.css';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, useInitialAndroidBarSync } from '../lib/useColorScheme';
import { NAV_THEME } from '../theme';
import { UserProvider } from '../context/UserContext';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
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

function RootLayoutNav() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <>
  
    <ThemeProvider value={NAV_THEME['light']}>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
          <Stack.Screen name="index" />
          <Stack.Screen name="signin" />
          <Stack.Screen name="JournalEntryScreen" />
          <Stack.Screen name="interview" />
          <Stack.Screen name="summary" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </UserProvider>
    </ThemeProvider>
    </>
  );
}
