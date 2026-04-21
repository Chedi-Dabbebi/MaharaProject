import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SkillCard } from '../components/SkillCard';
import { useTheme } from '../context/ThemeContext';
import { useSkills } from '../hooks/useSkills';
import { useTranslation } from '../i18n';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../types/navigation';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

export function HomeScreen() {
  const { colors, theme } = useTheme();
  const { skills, isLoading, loadError, reload } = useSkills();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingState message={t('home_loading')} />
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
        <Text style={[styles.header, { color: colors.textPrimary }]}>{t('home_hello')}</Text>
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
  container: { flex: 1, paddingBottom: 100 },
  headerContainer: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 30 },
  header: { fontSize: 32, fontWeight: 'bold' },
  subHeader: { fontSize: 16 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 20 },
});
