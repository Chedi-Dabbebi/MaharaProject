import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SkillCard } from '../components/SkillCard';
import { skills } from '../data/skills';

interface HomeScreenProps {
  onSkillPress: (skillId: string) => void;
}

export function HomeScreen({ onSkillPress }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Bonjour 👋</Text>
        <Text style={styles.subHeader}>
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
    backgroundColor: '#311D3F',
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
    color: '#F8FAFC',
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 16,
    color: '#94A3B8',
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
