import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  activeOpacity?: number;
}

export function AnimatedCard({ children, onPress, style, activeOpacity = 0.95 }: AnimatedCardProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.container,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
});
