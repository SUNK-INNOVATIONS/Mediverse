import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { signIn } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        Alert.alert('Login Failed', error.message);
        return;
      }

      if (data.user) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Social Login', `${provider} login will be implemented`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={Colors.gradientPurple}
                  style={styles.logo}
                >
                  <Text style={styles.logoText}>🧠</Text>
                </LinearGradient>
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue your mental wellness journey</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color={Colors.gray500} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor={Colors.gray500}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Lock size={20} color={Colors.gray500} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.gray500}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={20} color={Colors.gray500} />
                    ) : (
                      <Eye size={20} color={Colors.gray500} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? [Colors.gray400, Colors.gray500] : Colors.gradientPurple}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin('Google')}
                >
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin('Apple')}
                >
                  <Text style={styles.socialButtonText}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text
                  style={styles.signUpText}
                  onPress={() => router.push('/auth/register')}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
  },
  logoContainer: {
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.large,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    ...Typography.title,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
  },
  form: {
    marginBottom: Spacing.xxl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    ...Shadow.small,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.md,
    ...Typography.paragraph,
    color: Colors.black,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
  },
  forgotPasswordText: {
    ...Typography.secondary,
    color: Colors.purple,
  },
  loginButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.medium,
  },
  buttonGradient: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray300,
  },
  dividerText: {
    ...Typography.small,
    color: Colors.gray500,
    paddingHorizontal: Spacing.lg,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  socialButton: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadow.small,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  socialButtonText: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...Typography.secondary,
    color: Colors.gray600,
  },
  signUpText: {
    color: Colors.purple,
    fontFamily: 'Inter-Bold',
  },
});