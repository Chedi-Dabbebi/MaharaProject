import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../i18n';
import { useNavigation } from '@react-navigation/native';

const BUDGET_OPTIONS = [30, 60, 90, 120, 180, 240];

function buildInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  return words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

export function EditProfileScreen() {
  const { colors } = useTheme();
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const initialBudget = user?.weekly_time_budget_minutes ?? 60;
  const initialBudgetIndex = Math.max(0, BUDGET_OPTIONS.indexOf(initialBudget));

  const [displayName, setDisplayName] = useState(user?.name ?? '');
  const [budgetIndex, setBudgetIndex] = useState(initialBudgetIndex);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const initials = buildInitials(displayName) || user?.initials || '?';
  const budget = BUDGET_OPTIONS[budgetIndex];

  const handleSave = async () => {
    if (!displayName.trim()) return;
    setSaveError('');
    setIsSaving(true);
    const { success, error } = await updateUser(displayName.trim(), initials, budget);
    setIsSaving(false);
    if (!success) {
      setSaveError(error ?? t('edit_profile_save_error'));
      return;
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
              <Text style={[styles.cancelText, { color: colors.primary }]}>{t('edit_profile_cancel')}</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{t('edit_profile_title')}</Text>
            <TouchableOpacity onPress={handleSave} disabled={isSaving} style={styles.saveBtn}>
              {isSaving
                ? <ActivityIndicator size="small" color={colors.primary} />
                : <Text style={[styles.saveText, { color: colors.primary }]}>{t('edit_profile_save')}</Text>
              }
            </TouchableOpacity>
          </View>

          {/* Avatar Preview */}
          <View style={styles.avatarSection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('edit_profile_avatar_preview')}</Text>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={[styles.avatarHint, { color: colors.textSecondary }]}>
              {displayName.trim() || '–'}
            </Text>
          </View>

          {/* Display Name */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('edit_profile_name_label')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, color: colors.textPrimary }]}
              placeholder={t('edit_profile_name_placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={displayName}
              onChangeText={setDisplayName}
              editable={!isSaving}
              autoCapitalize="words"
            />
          </View>

          {/* Weekly Time Budget */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('edit_profile_budget_label')}</Text>
            <View style={[styles.budgetControl, { backgroundColor: colors.surface }]}>
              <TouchableOpacity
                style={[styles.budgetBtn, { backgroundColor: colors.surfaceElevated }]}
                onPress={() => setBudgetIndex(i => Math.max(0, i - 1))}
                disabled={isSaving || budgetIndex === 0}
              >
                <Text style={[styles.budgetBtnText, { color: colors.textPrimary }]}>−</Text>
              </TouchableOpacity>
              <View style={styles.budgetValueBox}>
                <Text style={[styles.budgetValue, { color: colors.textPrimary }]}>{budget}</Text>
                <Text style={[styles.budgetUnit, { color: colors.textSecondary }]}>{t('edit_profile_budget_unit')}</Text>
              </View>
              <TouchableOpacity
                style={[styles.budgetBtn, { backgroundColor: colors.surfaceElevated }]}
                onPress={() => setBudgetIndex(i => Math.min(BUDGET_OPTIONS.length - 1, i + 1))}
                disabled={isSaving || budgetIndex === BUDGET_OPTIONS.length - 1}
              >
                <Text style={[styles.budgetBtnText, { color: colors.textPrimary }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {saveError ? (
            <Text style={[styles.errorText, { color: colors.error }]}>{saveError}</Text>
          ) : null}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 60 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 28,
  },
  cancelBtn: { minWidth: 56 },
  cancelText: { fontSize: 16, fontWeight: '500' },
  title: { fontSize: 18, fontWeight: 'bold' },
  saveBtn: { minWidth: 56, alignItems: 'flex-end' },
  saveText: { fontSize: 16, fontWeight: '700' },
  avatarSection: { alignItems: 'center', marginBottom: 36 },
  sectionLabel: { fontSize: 12, fontWeight: '600', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.8 },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 10,
  },
  avatarText: { color: '#ffffff', fontSize: 32, fontWeight: 'bold' },
  avatarHint: { fontSize: 14, fontWeight: '500' },
  field: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  input: {
    borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1,
  },
  budgetControl: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 16,
    padding: 12, justifyContent: 'space-between',
  },
  budgetBtn: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  budgetBtnText: { fontSize: 22, fontWeight: 'bold', lineHeight: 26 },
  budgetValueBox: { alignItems: 'center', flex: 1 },
  budgetValue: { fontSize: 30, fontWeight: 'bold' },
  budgetUnit: { fontSize: 12, marginTop: 2 },
  errorText: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8 },
});
