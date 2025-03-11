import React from 'react';
import { Stack } from 'expo-router';
import { UserProvider } from '../../context/UserContext';

export default function TabLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="JournalEntryScreen" />
        <Stack.Screen name="interview" />
        <Stack.Screen name="summary" />
      </Stack>
    </UserProvider>
  )
}
