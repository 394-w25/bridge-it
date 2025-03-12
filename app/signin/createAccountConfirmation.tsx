import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../styles/color';

export default function ConfirmationScreen() {
  const router = useRouter();

  const handleFinish = () => {
    // Here you would typically:
    // 1. Create the user account with the collected information
    // 2. Sign them in
    // 3. Navigate to the main app
    
    // For now, let's just navigate to the home screen
    router.replace('/');
  };

  return (
    <LinearGradient colors={['#D8EEEB', '#FFFFFF']} style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.successContainer}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <Text style={styles.title}>Account Created!</Text>
              <Text style={styles.subtitle}>
                Your account has been successfully created. You can now start using the app.
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleFinish}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary500,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  checkmark: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.neutralBlack,
    textAlign: 'center',
    fontFamily: 'Nunito',
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral900,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    fontFamily: 'DM Sans',
  },
  button: {
    backgroundColor: colors.secondary500,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
});