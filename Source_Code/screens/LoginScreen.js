import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useUser } from '../contexts/UserContext';

// Complete the auth session for web browser
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setGuestUser, setMemberUser } = useUser();

  // Google OAuth Configuration
  const googleDiscovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };

  const [googleRequest, googleResponse, googlePromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google OAuth Client ID
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
      responseType: AuthSession.ResponseType.Token,
    },
    googleDiscovery
  );

  // Microsoft OAuth Configuration
  const microsoftDiscovery = {
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  };

  const [microsoftRequest, microsoftResponse, microsoftPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'YOUR_MICROSOFT_CLIENT_ID', // Replace with your Microsoft App (Client) ID
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
      responseType: AuthSession.ResponseType.Token,
    },
    microsoftDiscovery
  );

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const result = await googlePromptAsync();
      if (result.type === 'success') {
        setMemberUser();
        // Navigate to Kid Avatar Space (Page 2)
        navigation.navigate('KidAvatarSpace');
      }
    } catch (error) {
      Alert.alert('Error', 'Google sign in failed. Please try again.');
      console.error(error);
    }
  };

  // Handle Microsoft Sign In
  const handleMicrosoftSignIn = async () => {
    try {
      const result = await microsoftPromptAsync();
      if (result.type === 'success') {
        setMemberUser();
        // Navigate to Kid Avatar Space (Page 2)
        navigation.navigate('KidAvatarSpace');
      }
    } catch (error) {
      Alert.alert('Error', 'Microsoft sign in failed. Please try again.');
      console.error(error);
    }
  };

  // Handle Email/Password Login
  const handleEmailLogin = () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }
    setMemberUser();
    // Navigate to Kid Avatar Space (Page 2)
    navigation.navigate('KidAvatarSpace');
  };

  // Handle Guest Login
  const handleGuestLogin = () => {
    setGuestUser();
    // Navigate directly to Menu Lobby (skip Kid Avatar Space for guests)
    navigation.navigate('MenuLobby');
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset link will be sent to your email address.',
      [{ text: 'OK' }]
    );
  };

  // Handle Create New Account
  const handleCreateAccount = () => {
    Alert.alert(
      'Create Account',
      'This will redirect you to the registration page.',
      [{ text: 'OK' }]
    );
    // navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo and Title Section */}
          <View style={styles.header}>
            <Text style={styles.logo}>👶</Text>
            <Text style={styles.title}>URBAN CHILDHOOD</Text>
            <Text style={styles.subtitle}>
              Supporting parents at every stage of their child's development
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleEmailLogin}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* SSO Buttons */}
            <TouchableOpacity
              style={[styles.ssoButton, styles.googleButton]}
              onPress={handleGoogleSignIn}
              disabled={!googleRequest}
            >
              <Text style={styles.ssoButtonIcon}>G</Text>
              <Text style={styles.ssoButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ssoButton, styles.microsoftButton]}
              onPress={handleMicrosoftSignIn}
              disabled={!microsoftRequest}
            >
              <Text style={styles.ssoButtonIcon}>M</Text>
              <Text style={styles.ssoButtonText}>Continue with Microsoft</Text>
            </TouchableOpacity>

            {/* Create Account Button */}
            <TouchableOpacity
              style={styles.createAccountButton}
              onPress={handleCreateAccount}
            >
              <Text style={styles.createAccountText}>
                Don't have an account? <Text style={styles.createAccountLink}>Create New Account</Text>
              </Text>
            </TouchableOpacity>

            {/* Guest Login Button */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuestLogin}
            >
              <Text style={styles.guestButtonText}>Join as a guest</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF', // Soft lavender background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#B39DDB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E1BEE7', // Soft lavender border
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#9575CD', // Medium lavender
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#9575CD', // Medium lavender
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#9575CD',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1BEE7', // Soft lavender divider
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#9575CD', // Medium lavender
    fontWeight: '600',
  },
  ssoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E1BEE7', // Soft lavender border
    shadowColor: '#B39DDB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: 'rgba(219, 68, 55, 0.1)', // Light red with 90% transparency (10% opacity)
    borderColor: '#DB4437',
  },
  microsoftButton: {
    backgroundColor: 'rgba(0, 164, 239, 0.1)', // Light blue with 90% transparency (10% opacity)
    borderColor: '#00A4EF',
  },
  ssoButtonIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
    color: '#1A1A1A',
  },
  ssoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  createAccountButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: 12,
    color: '#666',
  },
  createAccountLink: {
    color: '#9575CD', // Medium lavender
    fontWeight: 'bold',
  },
  guestButton: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#9575CD', // Medium lavender
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9575CD', // Medium lavender
  },
});

export default LoginScreen;

