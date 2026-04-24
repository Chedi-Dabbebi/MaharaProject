import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Image,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../i18n';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '../components/ui/Icon';

const BUDGET_OPTIONS = [30, 60, 90, 120, 180, 240];

function buildInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

export function EditProfileScreen() {
  const { colors, theme } = useTheme();
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isDark = theme === 'dark';

  const initialBudget = user?.weekly_time_budget_minutes ?? 60;
  const initialBudgetIndex = Math.max(0, BUDGET_OPTIONS.indexOf(initialBudget));

  const [displayName, setDisplayName] = useState(user?.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? '');
  const [budgetIndex, setBudgetIndex] = useState(initialBudgetIndex);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const insets = useSafeAreaInsets();

  const initials = buildInitials(displayName) || user?.initials || '?';
  const budget = BUDGET_OPTIONS[budgetIndex];

  // Animations
  const avatarScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 12, bounciness: 4, useNativeDriver: true }),
    ]).start();
  }, []);

  const onNameChange = (val: string) => {
    setDisplayName(val);
    Animated.sequence([
      Animated.spring(avatarScale, { toValue: 0.93, speed: 60, bounciness: 0, useNativeDriver: true }),
      Animated.spring(avatarScale, { toValue: 1, speed: 20, bounciness: 8, useNativeDriver: true }),
    ]).start();
  };

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0]?.uri) {
      setAvatarUrl(result.assets[0].uri);
      
      // Pulse animation
      Animated.sequence([
        Animated.spring(avatarScale, { toValue: 1.1, speed: 40, bounciness: 10, useNativeDriver: true }),
        Animated.spring(avatarScale, { toValue: 1, speed: 20, bounciness: 8, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) return;
    setSaveError('');
    setIsSaving(true);
    const { success, error } = await updateUser(displayName.trim(), initials, budget, avatarUrl);
    setIsSaving(false);
    if (!success) {
      setSaveError(error ?? t('edit_profile_save_error'));
      return;
    }
    navigation.goBack();
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView 
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]} 
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* ── Header ─────────────────────────────────────────── */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Icon name="chevron-back" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
              
              <Text style={[styles.title, { color: colors.textPrimary }]}>{t('edit_profile_title')}</Text>
              
              <TouchableOpacity
                onPress={handleSave}
                disabled={isSaving || !displayName.trim()}
                style={[
                  styles.saveHeaderBtn,
                  { 
                    backgroundColor: colors.primary,
                    opacity: (isSaving || !displayName.trim()) ? 0.6 : 1 
                  }
                ]}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveHeaderText}>{t('edit_profile_save')}</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* ── Avatar Preview ────────────────────────────────── */}
            <View style={styles.avatarSection}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                {t('edit_profile_avatar_preview')}
              </Text>
              <Animated.View style={{ transform: [{ scale: avatarScale }] }}>
                <TouchableOpacity activeOpacity={0.9} onPress={handlePickImage} style={styles.avatarTouchable}>
                  <View style={[styles.avatarRing, { borderColor: `${colors.primary}50` }]}>
                    <View
                      style={[
                        styles.avatar,
                        { backgroundColor: colors.primary, shadowColor: colors.primary },
                      ]}
                    >
                      {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                      ) : (
                        <Text style={styles.avatarText}>{initials}</Text>
                      )}
                    </View>
                  </View>
                  <View style={[styles.cameraBadge, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
                    <Icon name="camera" size={12} color={colors.primary} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
              <Text style={[styles.avatarName, { color: colors.textSecondary }]}>
                {displayName.trim() || '–'}
              </Text>
            </View>

            {/* ── Display Name ──────────────────────────────────── */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>{t('edit_profile_name_label')}</Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: colors.surface,
                    borderColor: nameFocused ? colors.primary : colors.border,
                  },
                ]}
              >
                <Icon name="edit" size={16} color={nameFocused ? colors.primary : colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  placeholder={t('edit_profile_name_placeholder')}
                  placeholderTextColor={colors.textMuted}
                  value={displayName}
                  onChangeText={onNameChange}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  editable={!isSaving}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* ── Weekly Budget ────────────────────────────────── */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>{t('edit_profile_budget_label')}</Text>
              <View style={[styles.budgetCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {/* Minus */}
                <TouchableOpacity
                  style={[
                    styles.budgetStepBtn,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                      opacity: budgetIndex === 0 ? 0.4 : 1,
                    },
                  ]}
                  onPress={() => setBudgetIndex((i) => Math.max(0, i - 1))}
                  disabled={isSaving || budgetIndex === 0}
                >
                  <Text style={[styles.stepBtnText, { color: colors.textPrimary }]}>−</Text>
                </TouchableOpacity>

                {/* Value */}
                <View style={styles.budgetCenter}>
                  <Text style={[styles.budgetValue, { color: colors.textPrimary }]}>{budget}</Text>
                  <Text style={[styles.budgetUnit, { color: colors.textSecondary }]}>
                    {t('edit_profile_budget_unit')}
                  </Text>
                </View>

                {/* Plus */}
                <TouchableOpacity
                  style={[
                    styles.budgetStepBtn,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                      opacity: budgetIndex === BUDGET_OPTIONS.length - 1 ? 0.4 : 1,
                    },
                  ]}
                  onPress={() => setBudgetIndex((i) => Math.min(BUDGET_OPTIONS.length - 1, i + 1))}
                  disabled={isSaving || budgetIndex === BUDGET_OPTIONS.length - 1}
                >
                  <Text style={[styles.stepBtnText, { color: colors.textPrimary }]}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Pill progress */}
              <View style={styles.budgetDots}>
                {BUDGET_OPTIONS.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: i === budgetIndex ? colors.primary : colors.border,
                        width: i === budgetIndex ? 18 : 6,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* ── Error ─────────────────────────────────────────── */}
            {saveError ? (
              <View style={[styles.errorBox, { backgroundColor: `${colors.error}15`, borderColor: `${colors.error}40` }]}>
                <Icon name="alert-triangle" size={14} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{saveError}</Text>
              </View>
            ) : null}

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { 
    fontSize: 18, 
    fontWeight: '800', 
    letterSpacing: -0.5,
    flex: 1,
    textAlign: 'center',
  },
  saveHeaderBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 70,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveHeaderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Avatar
  avatarSection: { alignItems: 'center', marginBottom: 36 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  avatarTouchable: {
    position: 'relative',
  },
  avatarRing: {
    padding: 4,
    borderRadius: 99,
    borderWidth: 2,
    marginBottom: 14,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: { color: '#ffffff', fontSize: 32, fontWeight: '800' },
  avatarName: { fontSize: 15, fontWeight: '600' },

  // Fields
  field: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 10, letterSpacing: 0.1 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  input: { flex: 1, fontSize: 16, fontWeight: '500' },

  // Budget
  budgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  budgetStepBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { fontSize: 24, fontWeight: '700', lineHeight: 28 },
  budgetCenter: { alignItems: 'center', flex: 1 },
  budgetValue: { fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  budgetUnit: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  budgetDots: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  dot: { height: 6, borderRadius: 99 },

  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  errorText: { fontSize: 13, fontWeight: '600', flex: 1 },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
});
