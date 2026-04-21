import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../types/navigation';
import { Icon } from '../components/ui/Icon';

export function OnboardingLanguage() {
  const { colors } = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const languages = [
    { id: 'en', label: '🇬🇧 English', subtitle: 'English' },
    { id: 'fr', label: '🇫🇷 Français', subtitle: 'French' },
  ] as const;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('onboarding_lang_title')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('onboarding_lang_subtitle')}
        </Text>

        <View style={styles.cardContainer}>
          {languages.map((item) => {
            const isSelected = language === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.langCard,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: isSelected ? colors.buttonPrimary : colors.cardBorder,
                    borderWidth: isSelected ? 2 : 1,
                  }
                ]}
                onPress={() => setLanguage(item.id)}
              >
                <View style={styles.cardContent}>
                  <Text style={[styles.langLabel, { color: colors.textPrimary }]}>
                    {item.label}
                  </Text>
                  {isSelected && (
                    <View style={[styles.checkCircle, { backgroundColor: colors.buttonPrimary }]}>
                      <Icon name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
          onPress={() => navigation.navigate('OnboardingSetup')}
        >
          <Text style={styles.buttonText}>{t('onboarding_btn_continue')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  cardContainer: {
    gap: 16,
  },
  langCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  langLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'transparent',
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
