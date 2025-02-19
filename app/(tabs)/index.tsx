import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
export default function WelcomePage() {
  const getCurrentDate = () => {
    const date = new Date();
    const options = { weekday: 'long' as const, month: 'long' as const, day: 'numeric' as const };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      {/* Welcome Section */}
      <View style={styles.content}>
        <Text style={styles.date}>{getCurrentDate()}</Text>
        <Text style={styles.welcomeMessage}>Welcome back Guillermo!</Text>

        {/* Button */}
        <Link href="/(tabs)/two" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Start Today's Journal</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#29B4D8',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 112,
    height: 55,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  date: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  welcomeMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4B5563',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});