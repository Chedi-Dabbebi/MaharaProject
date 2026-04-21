import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { Icon } from '../components/ui/Icon';

export function EmailVerificationScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'EmailVerification'>>();
  
  const email = route.params?.email || 'votre email';
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown > 0) return;
    // In a full implementation, you would call your authService.resend(email) here.
    setCooldown(60);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name="checkmark" size={64} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('verify_title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('verify_subtitle', { email })}
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: cooldown > 0 ? colors.textMuted : colors.primary, shadowColor: colors.primary }
          ]}
          onPress={handleResend}
          disabled={cooldown > 0}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: '#ffffff' }]}>
            {cooldown > 0 ? t('verify_resend_timer', { time: cooldown }) : t('verify_resend_button')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backLink}>
          <Text style={[styles.linkText, { color: colors.primary }]}>{t('back_to_login')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  iconContainer: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  button: { width: '100%', padding: 16, borderRadius: 12, alignItems: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
  backLink: { marginTop: 32, padding: 10 },
  linkText: { fontSize: 16, fontWeight: '600' },
});
