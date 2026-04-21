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

export function SignUpScreen() {
  const { colors } = useTheme();
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
    
    // Auth context flows usually handle navigation automatically based on session creation,
    // but the prompt instructed: "On success navigate to EmailVerificationScreen"
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('signup_title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('signup_subtitle')}</Text>

          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('name_label')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder={t('name_placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              editable={!loadingAction}
            />
            {errors.name ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text> : null}

            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('email_label')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder={t('email_placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loadingAction}
            />
            {errors.email ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text> : null}

            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('password_label')}</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                placeholder={t('password_placeholder')}
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loadingAction}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye' : 'eye-off'} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.password}</Text> : null}

            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('confirm_password_label')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder={t('password_placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              editable={!loadingAction}
            />
            {errors.confirm ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.confirm}</Text> : null}

            <TouchableOpacity style={styles.tosContainer} onPress={() => setTosAccepted(!tosAccepted)} disabled={Boolean(loadingAction)}>
              <View style={[styles.checkbox, { borderColor: colors.textSecondary }]}>
                {tosAccepted ? <Icon name="checkmark" size={16} color={colors.primary} /> : null}
              </View>
              <Text style={[styles.tosText, { color: colors.textSecondary }]}>{t('tos_accept')}</Text>
            </TouchableOpacity>
            {errors.tos ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.tos}</Text> : null}
            {errors.global ? <Text style={[styles.errorText, { color: colors.error, marginTop: 12 }]}>{errors.global}</Text> : null}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: loadingAction ? colors.textMuted : colors.primary, shadowColor: colors.primary }]}
              onPress={handleSignUp}
              disabled={Boolean(loadingAction)}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, { color: '#ffffff' }]}>{loadingAction === 'email' ? t('signup_loading') : t('signup_button')}</Text>
            </TouchableOpacity>

            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={[styles.socialButton, { borderColor: colors.border, backgroundColor: colors.inputBackground }]}
                onPress={() => handleSocialSignUp('google')}
                disabled={Boolean(loadingAction)}
                activeOpacity={0.8}
              >
                <Text style={[styles.socialButtonText, { color: colors.textPrimary }]}>
                  {loadingAction === 'google' ? t('login_loading') : t('login_google_button')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, { borderColor: colors.border, backgroundColor: colors.inputBackground }]}
                onPress={() => handleSocialSignUp('facebook')}
                disabled={Boolean(loadingAction)}
                activeOpacity={0.8}
              >
                <Text style={[styles.socialButtonText, { color: colors.textPrimary }]}>
                  {loadingAction === 'facebook' ? t('login_loading') : t('login_facebook_button')}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
              <Text style={[styles.linkText, { color: colors.buttonPrimary }]}>{t('back_to_login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  title: { fontSize: 36, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 8, marginBottom: 24 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: { borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  passwordInput: { flex: 1, borderRadius: 12, padding: 16, paddingRight: 50, fontSize: 16, borderWidth: 1 },
  eyeIcon: { position: 'absolute', right: 16 },
  errorText: { fontSize: 12, fontWeight: '600', marginTop: 4, marginLeft: 4 },
  tosContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderRadius: 4, marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  tosText: { fontSize: 14, fontWeight: '500' },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
  socialContainer: { marginTop: 14, gap: 10 },
  socialButton: { borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16, borderWidth: 1, alignItems: 'center' },
  socialButtonText: { fontSize: 16, fontWeight: '700' },
  backLink: { marginTop: 24, alignItems: 'center' },
  linkText: { fontSize: 14, fontWeight: '600' },
});
