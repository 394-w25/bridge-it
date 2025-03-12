import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, provider } from '../backend/firebaseInit';
import { postUser } from '@/backend/dbFunctions';
import { useUser } from '../context/UserContext';
import { useRouter } from 'expo-router';

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
  
  // The redirect will happen via the AuthGuard in _layout.tsx

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/temp_logo.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
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
      </View>
      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={() => handleSignIn(router)}
      >
        <AntDesign name="google" size={24} color="white" />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Login below or <Text style={styles.link}>create an account</Text></Text>
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
      <Text style={styles.forgotPassword}>Forgot Password</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    marginBottom: 10,
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
    alignItems: 'center',
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10,
  },
  googleButtonText: {
    color: 'white',
    marginLeft: 10,
  },
  text: {
    marginBottom: 10,
  },
  link: {
    color: '#4285F4',
    fontWeight: 'bold',
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
