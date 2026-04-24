import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../i18n';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { Icon } from '../components/ui/Icon';
import type { AuthProvider } from '../services/authService';
import { AmbientBackground } from '../components/ui/AmbientBackground';
import { AnimatedButton } from '../components/ui/AnimatedButton';

export function LoginScreen() {
  const { colors, theme } = useTheme();
  const { signIn, signInWithProvider } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState<'email' | AuthProvider | null>(null);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const translateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0]
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setError('');

    if (!email.trim() || !validateEmail(email)) {
      setError(t('error_email_invalid'));
      return;
    }

    if (!password.trim() || password.length < 6) {
      setError(t('error_password_short'));
      return;
    }

    setLoadingAction('email');
    const { success, error: authError } = await signIn(email, password);
    setLoadingAction(null);

    if (!success) {
      setError(t((authError || 'error_login_failed') as any));
    }
  };

  const handleSocialLogin = async (provider: AuthProvider) => {
    setError('');
    setLoadingAction(provider);
    const { success, error: authError } = await signInWithProvider(provider);
    setLoadingAction(null);
    if (!success) {
      setError(t((authError || 'error_oauth_start_failed') as any));
    }
  };

  const isDark = theme === 'dark';

  return (
    <View style={styles.flexTop}>
      <AmbientBackground />
      <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Animated.View style={[styles.content, { 
          opacity: fadeAnim, 
          transform: [{ translateY }],
          backgroundColor: isDark ? 'rgba(15, 20, 28, 0.75)' : 'rgba(255, 255, 255, 0.85)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.5)',
        }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{t('login_welcome')}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('login_subtitle')}</Text>
          </View>

          <View style={styles.form}>
            {/* Email Field */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>{t('email_label')}</Text>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: focusedField === 'email' ? colors.primary : colors.border,
                  borderWidth: 2,
                }
              ]}>
                <Icon name="mail" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  placeholder={t('email_placeholder')}
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loadingAction}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>{t('password_label')}</Text>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: focusedField === 'password' ? colors.primary : colors.border,
                  borderWidth: 2,
                }
              ]}>
                <Icon name="lock" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.passwordInput, { color: colors.textPrimary }]}
                  placeholder={t('password_placeholder')}
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showPassword}
                  editable={!loadingAction}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon name={showPassword ? 'eye' : 'eye-off'} size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: `${colors.error}15` }]}>
                <Icon name="alert-circle" size={18} color={colors.error} style={styles.errorIcon} />
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPasswordContainer}
            >
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                {t('login_forgot_password')}
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <View style={styles.buttonContainer}>
              <AnimatedButton
                title={loadingAction === 'email' ? t('login_loading') : t('login_button')}
                onPress={handleLogin}
                disabled={Boolean(loadingAction)}
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
              onPress={() => handleSocialLogin('google')}
              disabled={Boolean(loadingAction)}
              activeOpacity={0.8}
            >
              <View style={styles.socialButtonContent}>
                <View style={[styles.socialIconContainer, { backgroundColor: '#ffffff' }]}>
                  <Icon name="logo-google" size={18} color="#EA4335" />
                </View>
                <Text style={[styles.socialButtonText, { color: colors.textPrimary }]}>
                  {loadingAction === 'google' ? t('login_loading') : t('login_google_button')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
              onPress={() => handleSocialLogin('facebook')}
              disabled={Boolean(loadingAction)}
              activeOpacity={0.8}
            >
              <View style={styles.socialButtonContent}>
                <View style={[styles.socialIconContainer, { backgroundColor: '#1877F2' }]}>
                  <Icon name="logo-facebook" size={18} color="#ffffff" />
                </View>
                <Text style={[styles.socialButtonText, { color: colors.textPrimary }]}>
                  {loadingAction === 'facebook' ? t('login_loading') : t('login_facebook_button')}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={[styles.signUpText, { color: colors.textSecondary }]}>{t('login_no_account')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={[styles.signUpLink, { color: colors.primary, fontWeight: '700' }]}>
                  {t('signup_button')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flexTop: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  content: {
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    color: '#94A3B8',
  },
  form: { width: '100%' },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    paddingRight: 40,
  },
  eyeIcon: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  errorIcon: {
    flexShrink: 0,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  socialButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  socialIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  signUpText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
  },
});
