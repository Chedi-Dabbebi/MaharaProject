import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../i18n';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { Icon } from '../components/ui/Icon';
import type { AuthProvider } from '../services/authService';

export function LoginScreen() {
  const { colors } = useTheme();
  const { signIn, signInWithProvider } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState<'email' | AuthProvider | null>(null);

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
      // Handle explicit supabase strings resolving to our translation nodes
      setError(t((authError || 'error_login_failed') as any));
      return;
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('login_welcome')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('login_subtitle')}</Text>

          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('email_label')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, color: colors.textPrimary }]}
              placeholder={t('email_placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loadingAction}
            />

            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('password_label')}</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder={t('password_placeholder')}
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loadingAction}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon name={showPassword ? 'eye' : 'eye-off'} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: loadingAction ? colors.textMuted : colors.primary, shadowColor: colors.primary }]}
              onPress={handleLogin}
              disabled={Boolean(loadingAction)}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, { color: '#ffffff' }]}>
                {loadingAction === 'email' ? t('login_loading') : t('login_button')}
              </Text>
            </TouchableOpacity>

            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={[styles.socialButton, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}
                onPress={() => handleSocialLogin('google')}
                disabled={Boolean(loadingAction)}
                activeOpacity={0.8}
              >
                <Text style={[styles.socialButtonText, { color: colors.textPrimary }]}>
                  {loadingAction === 'google' ? t('login_loading') : t('login_google_button')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}
                onPress={() => handleSocialLogin('facebook')}
                disabled={Boolean(loadingAction)}
                activeOpacity={0.8}
              >
                <Text style={[styles.socialButtonText, { color: colors.textPrimary }]}>
                  {loadingAction === 'facebook' ? t('login_loading') : t('login_facebook_button')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={[styles.linkText, { color: colors.primary }]}>{t('login_forgot_password')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signUpLink}>
                <Text style={[styles.linkText, { color: colors.primary }]}>{t('login_no_account')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  form: { width: '100%' },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    borderWidth: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  errorContainer: {
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linksContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  socialContainer: {
    marginTop: 14,
    gap: 10,
  },
  socialButton: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signUpLink: {
    marginTop: 16,
  },
});
