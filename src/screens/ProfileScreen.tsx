import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../components/ui/Icon';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { useSkills } from '../hooks/useSkills';
import { useTranslation } from '../i18n';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Animated Stat Card ──────────────────────────────────────────────────────
function StatCard({
  value,
  label,
  color,
  delay,
}: {
  value: string;
  label: string;
  color: string;
  delay: number;
}) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay,
        speed: 12,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        statCardStyles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[statCardStyles.dot, { backgroundColor: color }]} />
      <Text style={[statCardStyles.value, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[statCardStyles.label, { color: colors.textSecondary }]}>{label}</Text>
    </Animated.View>
  );
}

const statCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

// ─── Animated Achievement Tile ────────────────────────────────────────────────
function AchievementTile({
  name,
  earned,
  color,
  delay,
}: {
  name: string;
  earned: boolean;
  color: string;
  delay: number;
}) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay,
        speed: 14,
        bounciness: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePress = () => {
    if (!earned) return;
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.93, speed: 50, bounciness: 0, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, speed: 20, bounciness: 6, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim, width: '30%' }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={earned ? 0.8 : 1}
        style={[
          achievementStyles.tile,
          {
            backgroundColor: earned
              ? isDark ? `${color}18` : `${color}12`
              : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
            borderColor: earned ? `${color}40` : colors.border,
            opacity: earned ? 1 : 0.38,
          },
        ]}
      >
        <View
          style={[
            achievementStyles.iconWrap,
            {
              backgroundColor: earned ? `${color}25` : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            },
          ]}
        >
          {earned ? (
            <Icon name="trophy" size={18} color={color} />
          ) : (
            <Icon name="lock" size={18} color={colors.textMuted} />
          )}
        </View>
        <Text style={[achievementStyles.name, { color: colors.textPrimary }]} numberOfLines={2}>
          {name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const achievementStyles = StyleSheet.create({
  tile: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 8,
    aspectRatio: 1,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 9.5,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});


// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.1,
        color: colors.textMuted,
        textTransform: 'uppercase',
        paddingHorizontal: 24,
        marginBottom: 10,
        marginTop: 28,
      }}
    >
      {label}
    </Text>
  );
}

// ─── XP Progress Bar ─────────────────────────────────────────────────────────
function XPBar({ xp, level, color }: { xp: number; level: number; color: string }) {
  const { colors } = useTheme();
  const xpForCurrentLevel = level * 100;
  const xpForNextLevel = (level + 1) * 100;
  const progress = Math.min(1, xp / Math.max(1, xpForNextLevel));
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 900,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={xpBarStyles.wrapper}>
      <View style={[xpBarStyles.track, { backgroundColor: colors.border }]}>
        <Animated.View
          style={[
            xpBarStyles.fill,
            {
              backgroundColor: color,
              width: widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            },
          ]}
        />
      </View>
      <View style={xpBarStyles.labels}>
        <Text style={[xpBarStyles.small, { color: colors.textMuted }]}>
          {xp} XP
        </Text>
        <Text style={[xpBarStyles.small, { color: colors.textMuted }]}>
          Lvl {level + 1} in {xpForNextLevel - xp} XP
        </Text>
      </View>
    </View>
  );
}

const xpBarStyles = StyleSheet.create({
  wrapper: { paddingHorizontal: 24, marginTop: 4 },
  track: { height: 5, borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  small: { fontSize: 11, fontWeight: '500' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function ProfileScreen() {
  const { colors, theme } = useTheme();
  const { user, appReady } = useAuth();
  const { skills, totalXP, totalLevel, totalCompletedTasks, isLoading, loadError, reload } = useSkills();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const insets = useSafeAreaInsets();
  const onNavigateToSettings = () => navigation.navigate('Settings');
  const onNavigateToEdit = () => navigation.navigate('EditProfile');

  // Hero fade-in
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade, { toValue: 1, duration: 550, useNativeDriver: true }),
      Animated.spring(heroSlide, { toValue: 0, speed: 10, bounciness: 3, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!appReady || isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingState message={t('profile_loading')} />
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ErrorState message={loadError} onRetry={reload} />
      </View>
    );
  }

  const achievements = [
    { id: 1, name: t('ach_first_step'), earned: totalCompletedTasks >= 1, color: '#F59E0B' },
    { id: 2, name: t('ach_persistent'), earned: skills.some((s) => s.streak >= 7), color: '#FF5733' },
    { id: 3, name: t('ach_expert'), earned: totalLevel >= 5, color: '#8B5CF6' },
    { id: 4, name: t('ach_versatile'), earned: skills.length >= 4, color: '#22C55E' },
    { id: 5, name: t('ach_marathoner'), earned: skills.some((s) => s.streak >= 30), color: '#4CAF50' },
    { id: 6, name: t('ach_master'), earned: totalLevel >= 10, color: '#3B82F6' },
  ];

  const earnedCount = achievements.filter((a) => a.earned).length;

  const profile = user ?? {
    name: t('common_user'),
    email: t('common_unknown'),
    initials: 'U',
  };

  const weeklyBudget = user?.weekly_time_budget_minutes
    ? user.weekly_time_budget_minutes >= 60
      ? `${Math.round(user.weekly_time_budget_minutes / 60)}h`
      : `${user.weekly_time_budget_minutes}m`
    : '–';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >

        {/* ── Hero Banner ───────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.heroBanner,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
              opacity: heroFade,
              transform: [{ translateY: heroSlide }],
            },
          ]}
        >
          {/* Top bar */}
          <View style={styles.heroDeck}>
            <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>
              {t('profile_title')}
            </Text>
            <TouchableOpacity
              style={[styles.settingsBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
              onPress={onNavigateToSettings}
              activeOpacity={0.75}
            >
              <Icon name="settings" size={18} color={colors.iconDefault} />
            </TouchableOpacity>
          </View>

          {/* Avatar + meta */}
          <View style={styles.heroIdentity}>
            {/* Avatar */}
            <View style={[styles.avatarRing, { borderColor: `${colors.primary}50` }]}>
              <View style={[styles.avatar, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
                {profile.avatar_url ? (
                  <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>{profile.initials}</Text>
                )}
              </View>
            </View>
            
            {/* Name / email / stats summary */}
            <View style={styles.heroMeta}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>{profile.name}</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{profile.email}</Text>
              <View style={styles.heroTagRow}>
                <View style={[styles.achievedTag, { backgroundColor: `${colors.accent}20`, borderColor: `${colors.accent}40` }]}>
                  <Icon name="trophy" size={11} color={colors.accent} />
                  <Text style={[styles.achievedTagText, { color: colors.accent }]}>
                    {earnedCount}/{achievements.length} Achievements
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Edit Profile CTA */}
          <TouchableOpacity
            style={[styles.editCTA, { backgroundColor: colors.primary }]}
            onPress={onNavigateToEdit}
            activeOpacity={0.82}
          >
            <Icon name="edit" size={15} color="#fff" />
            <Text style={styles.editCTAText}>{t('profile_edit_button')}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── XP Progress ───────────────────────────────────────── */}
        <XPBar xp={totalXP} level={totalLevel} color={colors.primary} />

        {/* ── Stats Row ─────────────────────────────────────────── */}
        <SectionHeader label="Stats" />
        <View style={styles.statsRow}>
          <StatCard value={`${totalXP}`} label={t('profile_total_xp')} color={colors.primary} delay={0} />
          <StatCard value={`${totalCompletedTasks}`} label={t('profile_sessions')} color={colors.secondary} delay={80} />
          <StatCard value={weeklyBudget} label={t('profile_weekly_budget')} color={colors.accent} delay={160} />
        </View>

        {/* ── Achievements ──────────────────────────────────────── */}
        <SectionHeader label={t('profile_achievements')} />
        <View style={[styles.achievementCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.achievementRow}>
            {achievements.map((a, i) => (
              <AchievementTile
                key={a.id}
                name={a.name}
                earned={a.earned}
                color={a.color}
                delay={i * 60}
              />
            ))}
          </View>
        </View>


        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

// ─── Root Styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 32 },

  // Hero
  heroBanner: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  heroDeck: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Identity
  heroIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 24,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 99,
    borderWidth: 2,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 99,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroMeta: { flex: 1, gap: 4 },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  profileEmail: {
    fontSize: 13,
    fontWeight: '500',
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  achievedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
  },
  achievedTagText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Edit CTA
  editCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  editCTAText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
  },

  // Achievements
  achievementCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  achievementRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },

  // Actions
  actionsCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  bottomPad: { height: 40 },
});
