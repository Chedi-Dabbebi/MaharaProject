import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import { skills } from '../data/skills';
import { updateProfileBudget } from '../services/profileService';
import { Icon } from '../components/ui/Icon';
import { useNavigation } from '@react-navigation/native';

export function OnboardingSetup() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user, completeOnboarding } = useAuth();
  const navigation = useNavigation<any>();

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [budgetIndex, setBudgetIndex] = useState(1); // Default to 60 min

  const budgetOptions = [30, 60, 90, 120, 180, 240];

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (selectedSkills.length === 0) {
      Alert.alert(t('onboarding_error_min_skills') as string);
      return;
    }

    if (user?.id) {
      await updateProfileBudget(user.id, budgetOptions[budgetIndex]);
    }
    
    await completeOnboarding();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('onboarding_setup_title')}
        </Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {t('onboarding_setup_skills_label')}
        </Text>
        <View style={styles.skillsGrid}>
          {skills.map((skill) => {
            const isSelected = selectedSkills.includes(skill.id);
            return (
              <TouchableOpacity
                key={skill.id}
                style={[
                  styles.skillCard,
                  { 
                    backgroundColor: isSelected ? skill.color : colors.cardBackground,
                    borderColor: isSelected ? skill.color : colors.cardBorder
                  }
                ]}
                onPress={() => toggleSkill(skill.id)}
              >
                <Text style={[styles.skillName, { color: isSelected ? '#FFFFFF' : colors.textPrimary }]}>
                  {skill.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.budgetSection}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('onboarding_setup_budget_label')}
          </Text>
          <View style={styles.budgetControl}>
            <TouchableOpacity 
              style={[styles.budgetBtn, { backgroundColor: colors.cardBackground }]}
              onPress={() => setBudgetIndex(Math.max(0, budgetIndex - 1))}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 24 }}>-</Text>
            </TouchableOpacity>
            
            <View style={styles.budgetValueContainer}>
              <Text style={[styles.budgetValue, { color: colors.textPrimary }]}>
                {budgetOptions[budgetIndex]}
              </Text>
              <Text style={[styles.budgetUnit, { color: colors.textSecondary }]}>min</Text>
            </View>

            <TouchableOpacity 
              style={[styles.budgetBtn, { backgroundColor: colors.cardBackground }]}
              onPress={() => setBudgetIndex(Math.min(budgetOptions.length - 1, budgetIndex + 1))}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 24 }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
          onPress={handleFinish}
        >
          <Text style={styles.buttonText}>{t('onboarding_btn_start_learning')}</Text>
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
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 40,
  },
  skillCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
  },
  budgetSection: {
    marginTop: 20,
  },
  budgetControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    padding: 20,
    borderRadius: 20,
  },
  budgetBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetValueContainer: {
    alignItems: 'center',
  },
  budgetValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  budgetUnit: {
    fontSize: 14,
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
