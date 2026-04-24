import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Animated, ScrollView } from 'react-native';
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

export function SignUpScreen() {
  const { colors, theme } = useTheme();
  const { signUp, signInWithProvider } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);

  const [errors, setErrors] = useState<{name?: string; email?: string; password?: string; confirm?: string; tos?: string; global?: string}>({});
  const [loadingAction, setLoadingAction] = useState<'email' | AuthProvider | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const handleSignUp = async () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = t('error_name_empty');
    if (!email.trim() || !validateEmail(email)) newErrors.email = t('error_email_invalid');
    if (!password.trim() || password.length < 6) newErrors.password = t('error_password_short');
    if (password !== confirmPassword) newErrors.confirm = t('error_password_mismatch');
    if (!tosAccepted) newErrors.tos = t('error_tos_required');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoadingAction('email');

    const { success, error } = await signUp(email, password, name);
    setLoadingAction(null);

    if (!success) {
      setErrors({ global: error ? t(error as any) : t('error_network') });
      return;
    }

    navigation.navigate('EmailVerification', { email });
  };

  const handleSocialSignUp = async (provider: AuthProvider) => {
    setErrors({});
    setLoadingAction(provider);
    const { success, error } = await signInWithProvider(provider);
    setLoadingAction(null);
    if (!success) {
      setErrors({ global: error ? t(error as any) : t('error_oauth_start_failed') });
    }
  };

  const isDark = theme === 'dark';

  return (
    <View style={styles.flexTop}>
      <AmbientBackground />
      <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <Animated.View style={[styles.content, { 
          opacity: fadeAnim, 
          transform: [{ translateY }],
          backgroundColor: isDark ? 'rgba(15, 20, 28, 0.75)' : 'rgba(255, 255, 255, 0.85)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.5)',
        }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{t('signup_title')}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('signup_subtitle')}</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
              {/* Name Field */}
              <View style={styles.inputWrapper}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>{t('name_label')}</Text>
                <View style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: focusedField === 'name' ? colors.primary : colors.border,
                    borderWidth: 2,
                  }
                ]}>
                  <Icon name="person" size={20} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    placeholder={t('name_placeholder')}
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    editable={!loadingAction}
                    autoCapitalize="words"
                  />
                </View>
                {errors.name ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text> : null}
              </View>

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
                {errors.email ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text> : null}
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
                {errors.password ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.password}</Text> : null}
              </View>

              {/* Confirm Password Field */}
              <View style={styles.inputWrapper}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>{t('confirm_password_label')}</Text>
                <View style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: focusedField === 'confirm' ? colors.primary : colors.border,
                    borderWidth: 2,
                  }
                ]}>
                  <Icon name="lock-closed" size={20} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    placeholder={t('password_placeholder')}
                    placeholderTextColor={colors.textMuted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry={!showPassword}
                    editable={!loadingAction}
                  />
                </View>
                {errors.confirm ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.confirm}</Text> : null}
              </View>

              {/* ToS Checkbox */}
              <TouchableOpacity
                style={styles.tosContainer}
                onPress={() => setTosAccepted(!tosAccepted)}
                disabled={Boolean(loadingAction)}
              >
                <View style={[
                  styles.checkbox,
                  {
                    borderColor: tosAccepted ? colors.primary : colors.textMuted,
                    backgroundColor: tosAccepted ? `${colors.primary}20` : 'transparent',
                  }
                ]}>
                  {tosAccepted ? <Icon name="checkmark" size={16} color={colors.primary} /> : null}
                </View>
                <Text style={[styles.tosText, { color: colors.textSecondary }]}>{t('tos_accept')}</Text>
              </TouchableOpacity>
              {errors.tos ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.tos}</Text> : null}
              {errors.global ? <Text style={[styles.errorText, { color: colors.error, marginTop: 12 }]}>{errors.global}</Text> : null}

              {/* Sign Up Button */}
              <View style={styles.buttonContainer}>
                <AnimatedButton
                  title={loadingAction === 'email' ? t('signup_loading') : t('signup_button')}
                  onPress={handleSignUp}
                  disabled={Boolean(loadingAction)}
                />
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Social Sign Up Buttons */}
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
                onPress={() => handleSocialSignUp('google')}
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
                onPress={() => handleSocialSignUp('facebook')}
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

              {/* Back to Login Link */}
              <View style={styles.backContainer}>
                <Text style={[styles.backText, { color: colors.textSecondary }]}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={[styles.backLink, { color: colors.primary, fontWeight: '700' }]}>
                    {t('back_to_login')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
    maxHeight: '90%',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    marginBottom: 28,
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
  form: { width: '100%', paddingBottom: 20 },
  inputWrapper: {
    marginBottom: 4,
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
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    marginLeft: 4,
  },
  tosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 6,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tosText: {
    fontSize: 14,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
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
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  backText: {
    fontSize: 14,
  },
  backLink: {
    fontSize: 14,
  },
});
