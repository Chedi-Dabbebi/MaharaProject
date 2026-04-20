import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SkillCard } from '../components/SkillCard';
import { useTheme } from '../context/ThemeContext';
import { useAppState } from '../context/AppStateContext';

interface HomeScreenProps {
  onSkillPress: (skillId: string) => void;
}

export function HomeScreen({ onSkillPress }: HomeScreenProps) {
  const { colors, theme } = useTheme();
  const { skills } = useAppState();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: colors.textPrimary }]}>Bonjour 👋</Text>
        <Text style={[styles.subHeader, { color: colors.textSecondary }]}>
          Que voulez-vous pratiquer aujourd'hui ?
        </Text>
      </View>

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
            onPress={() => onSkillPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
