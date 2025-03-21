import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../styles/color';

export default function FullNameScreen() {
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    router.push('/signin/createAccountEmail');
  };

  return (
    <LinearGradient colors={['#D8EEEB', '#FFFFFF']} style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/signin')}
          >
            <AntDesign name="arrowleft" size={24} color={colors.neutralBlack} />
          </TouchableOpacity>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarSelected} />
            <View style={styles.progressBar} />
            <View style={styles.progressBar} />
          </View>
          
          <View style={styles.formContainer}>
            <View style={{width: '100%', alignItems: 'flex-start'}}>
                <View style={{width: '100%', alignItems: 'flex-start'}}>
                    <Image source={require('../../assets/images/temp_logo.png')} style={styles.logo} />
                    <Text style={styles.subtitle}>Create Account</Text>
                    <Text style={styles.title}>Let's start with your name</Text>
                </View>

                <View style={{width: '100%', alignItems: 'flex-start'}}>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <View style={styles.inputContainer}>
                        <AntDesign name="user" size={24} color="#4A4A4A" style={styles.inputIcon} />
                        <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter your full name"
                        autoCapitalize="words"
                        placeholderTextColor="#AAAAAA"
                        />
                    </View>
                </View>

            </View>
           

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.continueButton} 
                onPress={handleContinue}
              >
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.switchModeButton}
                onPress={() => router.push('/signin/email')}
              >
                <Text style={styles.switchModeText}>
                  Already have an account? Sign in
                </Text>
              </TouchableOpacity>
            </View>
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
  logo: {
    marginBottom: 16,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Nunito',
    color: colors.neutralBlack,
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral900,
    fontFamily: 'DM Sans',
    textAlign: 'center',
  },
  errorText: {
    color: colors.error400,
    marginBottom: 8,
    fontFamily: 'DM Sans',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    color: colors.neutralBlack,
    fontFamily: 'DM Sans',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  continueButton: {
    backgroundColor: colors.secondary500,
    borderRadius: 8,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  continueText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'DM Sans',
  },
  switchModeButton: {
    marginTop: 10,
  },
  switchModeText: {
    color: colors.neutralBlack,
    fontFamily: 'DM Sans',
    textDecorationLine: 'underline',
  },
  progressBarContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  progressBarSelected: {
    backgroundColor: colors.secondary400,
    height: 3,
    width: '10%',
    borderRadius: 10,
  },
  progressBar: {
    backgroundColor: colors.neutral400,
    height: 3,
    width: '4%',
    borderRadius: 10,
  },
});