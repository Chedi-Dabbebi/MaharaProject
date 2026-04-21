import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../i18n';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';

export function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const { resetPassword } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('forgot_password_title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('forgot_password_subtitle')}</Text>

          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('email_label')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder={t('email_placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading && !isSuccess}
            />

            {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}
            {isSuccess ? <Text style={[styles.successText, { color: colors.success }]}>{t('forgot_password_success')}</Text> : null}

            {!isSuccess && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: isLoading ? colors.textMuted : colors.primary, shadowColor: colors.primary }]}
                onPress={handleReset}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, { color: '#ffffff' }]}>{t('forgot_password_button')}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
              <Text style={[styles.linkText, { color: colors.primary }]}>{t('back_to_login')}</Text>
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
  subtitle: { fontSize: 16, marginTop: 8, marginBottom: 32 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: { borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, marginBottom: 16 },
  errorText: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  successText: { fontSize: 16, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
  backLink: { marginTop: 24, alignItems: 'center' },
  linkText: { fontSize: 14, fontWeight: '600' },
});
