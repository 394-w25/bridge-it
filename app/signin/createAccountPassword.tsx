import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../styles/color';

export default function PasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const validatePassword = (pass: string) => {
    // const hasMinLength = pass.length >= 8;
    // const hasUpperCase = /[A-Z]/.test(pass);
    // const hasLowerCase = /[a-z]/.test(pass);
    // const hasNumber = /[0-9]/.test(pass);
    
    // return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
    return true;
  };

  const handleContinue = () => {
    if (!validatePassword(password)) {
      setError('Password does not meet all requirements');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Navigate to the next screen
    router.push('/signin/createAccountConfirmation');
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
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
            <View style={styles.progressBar} />
            <View style={styles.progressBarSelected} />
          </View>
          
          <View style={styles.formContainer}>
            <View style={{width: '100%', alignItems: 'flex-start'}}>
              <View style={{width: '100%', alignItems: 'flex-start'}}>
                <Image source={require('../../assets/images/temp_logo.png')} style={styles.logo} />
                <Text style={styles.subtitle}>Create Account</Text>
                <Text style={styles.title}>Create Password</Text>
              </View>
              
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="#4A4A4A" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry={!isPasswordVisible}
                  placeholderTextColor="#AAAAAA"
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
                  <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={24} color="#4A4A4A" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="#4A4A4A" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!isConfirmPasswordVisible}
                  placeholderTextColor="#AAAAAA"
                />
                <TouchableOpacity onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                  <Ionicons name={isConfirmPasswordVisible ? "eye" : "eye-off"} size={24} color="#4A4A4A" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsTitle}>Password must contain:</Text>
                <Text style={[
                  styles.requirementItem, 
                  password.length >= 8 && styles.requirementMet
                ]}>• At least 8 characters</Text>
                <Text style={[
                  styles.requirementItem, 
                  /[A-Z]/.test(password) && styles.requirementMet
                ]}>• At least one uppercase letter</Text>
                <Text style={[
                  styles.requirementItem, 
                  /[a-z]/.test(password) && styles.requirementMet
                ]}>• At least one lowercase letter</Text>
                <Text style={[
                  styles.requirementItem, 
                  /[0-9]/.test(password) && styles.requirementMet
                ]}>• At least one number</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.continueButton} 
                onPress={handleContinue}
              >
                <Text style={styles.continueText}>Submit!</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Nunito',
    color: colors.neutralBlack,
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral900,
    fontFamily: 'DM Sans',
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
  passwordRequirements: {
    width: '100%',
    marginTop: 10,
    padding: 16,
    backgroundColor: colors.secondaryAlpha10,
    borderRadius: 8,
  },
  requirementsTitle: {
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'DM Sans',
    color: colors.neutralBlack,
  },
  requirementItem: {
    marginBottom: 4,
    color: colors.neutral700,
    fontFamily: 'DM Sans',
  },
  requirementMet: {
    color: colors.secondary500,
    fontWeight: '500',
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