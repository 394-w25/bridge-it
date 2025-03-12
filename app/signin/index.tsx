import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, provider } from '../../backend/firebaseInit';
import { postUser } from '@/backend/dbFunctions';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../styles/color';

const handleSignIn = async (router: any) => {
  try {
    // Set persistence to LOCAL - this keeps the user logged in after page refresh
    await setPersistence(auth, browserLocalPersistence);
    
    // Now sign in
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Save additional user info to your database if needed
    const uid = user.uid;
    const displayName = user.displayName ?? 'Anonymous';
    const email = user.email ?? 'no email provided';
    await postUser({ uid, displayName, email });
    
    // The router.replace will happen automatically via the AuthGuard
  } catch (error) {
    console.log('error signing in', error);
  }
};

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const { uid, isLoading } = useUser();
  const router = useRouter();
  
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#288C85" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#D8EEEB', '#FFFFFF']} style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.logo}>
            <Image source={require('../../assets/images/biglogo.png')} />
            <Text style={styles.title}>BRIDGE IT</Text>
            <Text style={styles.subtitle}>Turn achievements into job offers with AI-powered prep.</Text>
          </View>
          {/* <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          /> */}

          {/* <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
              <AntDesign name={isPasswordVisible ? "eye" : "eyeo"} size={24} color="gray" />
            </TouchableOpacity>
          </View> */}

          <View style={{width: '100%', alignItems: 'center'}}>
            <TouchableOpacity 
              style={styles.googleButton} 
              onPress={() => handleSignIn(router)}
            >
              <View style={styles.googleButtonContainer}>
                <AntDesign name="google" size={24} color="white" />
                <View style={styles.googleButtonTextContainer}>
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                  <Text style={styles.googleButtonSubtext}>Most secure</Text>
                </View>
              </View>
              <FontAwesome6 name="angle-right" size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.emailButton} 
              onPress={() => router.push('/signin/email')}
            >
              <View style={styles.googleButtonContainer}>
                <MaterialIcons name="email" size={24} color={colors.neutralBlack} />
                <View style={styles.googleButtonTextContainer}>
                  <Text style={styles.emailButtonText}>Sign in with Email</Text>
                  <Text style={styles.emailButtonSubtext}>Classic username and password</Text>
                </View>
              </View>
              <FontAwesome6 name="angle-right" size={16} color={colors.neutralBlack} />
            </TouchableOpacity>

            <Text style={styles.text}>
              or, <Text style={styles.link} onPress={() => router.push('/signin/createAccountName')}>
                create an account
              </Text>
            </Text>
            {/* <TouchableOpacity style={styles.signInButton}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot Password</Text> */}
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    position: 'relative',
    top: '25%',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 40,
    fontFamily: 'Nunito',
    color: colors.neutralBlack,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 10,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: colors.neutralBlack,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.secondary500,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 10,
  },
  emailButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.neutral200,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 10,
  },
  googleButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonTextContainer: {
    marginLeft: 20,
    flex: 1,
    gap: 2,
  },
  googleButtonText: {
    color: 'white',
    fontFamily: 'DM Sans',
    fontWeight: '600',
    fontSize: 14,
  },
  googleButtonSubtext: {
    color: 'white',
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '300',
  },
  emailButtonText: {
    color: colors.neutralBlack,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '600',
  },
  emailButtonSubtext: {
    color: colors.neutralBlack,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '300',
  },
  text: {
    marginBottom: 10,
    marginTop: 10,
  },
  link: {
    color: colors.neutralBlack,
    textDecorationLine: 'underline',
  },
  signInButton: {
    backgroundColor: '#4A5568',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  signInText: {
    color: 'white',
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#4A5568',
  },
});

export default LoginScreen;
