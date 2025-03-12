import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../styles/color';

const EmailSignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Sign up with email: ${email}`);
      
    //   router.replace('/');
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#D8EEEB', '#FFFFFF']} style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <AntDesign name="arrowleft" size={24} color={colors.neutralBlack} />
          </TouchableOpacity>
          
          <View style={styles.formContainer}>
            <View style={{width: '100%', alignItems: 'center'}}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/images/squarelogo.png')} style={styles.logo} />
                </View>
                <Text style={styles.title}>Sign In with Email Address</Text>
                
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                
                <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={24} color="#4A4A4A" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#AAAAAA"
                />
                </View>
                
                <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="#4A4A4A" style={styles.inputIcon} />
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    placeholderTextColor="#AAAAAA"
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
                    <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={24} color="#4A4A4A" />
                </TouchableOpacity>
                </View>
            </View>

            <View style={styles.buttonContainer}>
            
                <TouchableOpacity 
                style={styles.signInButton} 
                onPress={handleEmailAuth}
                disabled={isLoading}
                >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text style={styles.signInText}>
                    Sign In
                    </Text>
                )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                style={styles.switchModeButton}
                onPress={() => router.push('/signin/createAccountName')}
                >
                <Text style={styles.switchModeText}>
                    Need an account? Create one
                </Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    borderRadius: 16,
    shadowColor: '#585C5F',
    shadowOffset: {
        width: 0,
        height: 16
    },
    shadowRadius: 40,
    elevation: 40,

    shadowOpacity: 0.16,
  },
  logo: {
    width: 100,
    height: 100,
    padding: 16
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 40,
    fontFamily: 'Nunito',
    color: colors.neutralBlack,
    textAlign: 'center',
  },
  errorText: {
    color: '#E53935',
    marginBottom: 20,
    textAlign: 'center',
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
  passwordInput: {
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
  signInButton: {
    backgroundColor: colors.secondary500,
    borderRadius: 8,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  signInText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'DM Sans',
  },
  switchModeButton: {
    marginTop: 10,
  },
  switchModeText: {
    color: colors.secondary500,
    fontFamily: 'DM Sans',
    textDecorationLine: 'underline',
  },
});

export default EmailSignInScreen;
