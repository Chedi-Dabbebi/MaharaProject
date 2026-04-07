import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

interface LoadingScreenProps {
  onFinish: () => void;
}

export function LoadingScreen({ onFinish }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // 2 second simulated loading

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E23E57" />
      <Text style={styles.text}>Chargement...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#311D3F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#F8FAFC',
    fontWeight: '500',
  },
});
