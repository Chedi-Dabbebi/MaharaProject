import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../i18n';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { Icon } from '../components/ui/Icon';
import { AmbientBackground } from '../components/ui/AmbientBackground';
import { AnimatedButton } from '../components/ui/AnimatedButton';

export function ForgotPasswordScreen() {
  const { colors, theme } = useTheme();
  const { resetPassword } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const handleReset = async () => {
    setError('');
    setIsSuccess(false);

    if (!email.trim() || !validateEmail(email)) {
      setError(t('error_email_invalid'));
      return;
    }

    setIsLoading(true);
    const { success, error: authError } = await resetPassword(email);
    setIsLoading(false);

    if (!success) {
      setError(t((authError || 'error_network') as any));
      return;
    }

    setIsSuccess(true);
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
            <View style={styles.iconHeader}>
              <View style={[styles.iconCircle, { backgroundColor: `${colors.primary}20`, borderColor: colors.border }]}>
                <Icon name="lock-closed" size={32} color={colors.primary} />
              </View>
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{t('forgot_password_title')}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('forgot_password_subtitle')}</Text>
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
                  editable={!isLoading && !isSuccess}
                />
              </View>
            </View>

            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: `${colors.error}15` }]}>
                <Icon name="alert-circle" size={18} color={colors.error} style={styles.errorIcon} />
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            {isSuccess ? (
              <View style={[styles.successContainer, { backgroundColor: `${colors.success}15` }]}>
                <Icon name="checkmark-circle" size={20} color={colors.success} style={styles.successIcon} />
                <Text style={[styles.successText, { color: colors.success }]}>{t('forgot_password_success')}</Text>
              </View>
            ) : null}

            {/* Reset Button */}
            {!isSuccess && (
              <View style={styles.buttonContainer}>
                <AnimatedButton
                  title={isLoading ? t('login_loading') : t('forgot_password_button')}
                  onPress={handleReset}
                  disabled={isLoading}
                />
              </View>
            )}

            {/* Back Link */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
              <Icon name="arrow-back" size={18} color={colors.primary} style={styles.backIcon} />
              <Text style={[styles.backLinkText, { color: colors.primary }]}>{t('back_to_login')}</Text>
            </TouchableOpacity>
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
    paddingVertical: 36,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconHeader: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
    color: '#94A3B8',
  },
  form: { width: '100%' },
  inputWrapper: {
    marginBottom: 12,
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
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
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  successIcon: {
    flexShrink: 0,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 24,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  backIcon: {
    marginTop: 2,
  },
  backLinkText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
