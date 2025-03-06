import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link, Tabs, Stack } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { UserProvider } from '../../context/UserContext';
import { textVariants } from '@/components/nativewindui/Text';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -10 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 20,
            height: 48,
            backgroundColor: '#fff',
            borderRadius: 30,
            // If you want a subtle shadow on Android:
            elevation: 5,
            // iOS shadow:
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            // Remove top border if needed
            borderTopWidth: 0,
          },
          // Optionally hide tab labels if you just want icons
          tabBarShowLabel: false,
        }}>
        <Tabs.Screen
          name="signin"
          options={{
            title: 'Sign In',
            tabBarIcon: ({ color }) => <TabBarIcon name="sign-in" color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color={Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="JournalEntryScreen"
          options={{
            title: 'Journal',
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          }}
        />
        <Tabs.Screen
          name="InterviewPrepScreen"
          options={{
            title: 'Interview Prep',
            tabBarIcon: ({ color }) => <TabBarIcon name="microphone" color={color} />,
          }}
        />
        
        <Stack.Screen
          name="screens/textEntry"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/EntryDetail"
          options={{
            headerShown: false,
          }}
        />
      </Tabs>
    </UserProvider>
  );
}
