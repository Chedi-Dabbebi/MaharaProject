import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SkillCard } from '../components/SkillCard';
import { useTheme } from '../context/ThemeContext';
import { useSkills } from '../hooks/useSkills';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../i18n';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../types/navigation';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

export function HomeScreen() {
  const { colors, theme } = useTheme();
  const { user } = useAuth();
  const { skills, isLoading, loadError, reload } = useSkills();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  
  const displayName = user?.name || t('common_user');
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.headerContainer}>
          <Text style={[styles.header, { color: colors.textPrimary }]}>
            {t('home_hello', { name: displayName })}
          </Text>
          <Text style={[styles.subHeader, { color: colors.textSecondary }]}>{t('home_subtitle')}</Text>
        </View>
        <View style={styles.listContent}>
          <View style={styles.row}>
            <LoadingSkeleton width="48%" height={160} borderRadius={24} />
            <LoadingSkeleton width="48%" height={160} borderRadius={24} />
          </View>
          <View style={styles.row}>
            <LoadingSkeleton width="48%" height={160} borderRadius={24} />
            <LoadingSkeleton width="48%" height={160} borderRadius={24} />
          </View>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState message={loadError} onRetry={reload} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: colors.textPrimary }]}>
          {t('home_hello', { name: displayName })}
        </Text>
        <Text style={[styles.subHeader, { color: colors.textSecondary }]}>
          {t('home_subtitle')}
        </Text>
      </View>

      {skills.length === 0 ? (
        <EmptyState
          title={t('home_empty_title')}
          subtitle={t('home_empty_subtitle')}
          actionLabel={t('home_empty_action')}
          onAction={() => {/* future: open skill browser */}}
        />
      ) : (
        <FlatList
          data={skills}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SkillCard
              id={item.id}
              name={item.name}
              icon={item.icon}
              color={item.color}
              progress={item.progress}
              level={item.level}
              onPress={() => navigation.navigate('SkillDetail', { skillId: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 32 },
  header: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  subHeader: { fontSize: 16, marginTop: 8 },
  listContent: { paddingHorizontal: 24, paddingBottom: 24 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
});
