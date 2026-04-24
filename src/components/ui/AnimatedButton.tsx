import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback, StyleSheet, ViewStyle, Text, TextStyle, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function AnimatedButton({ onPress, title, disabled, style, textStyle, icon }: AnimatedButtonProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: disabled ? colors.textMuted : colors.primary,
            opacity: disabled ? 0.7 : 1,
            shadowColor: colors.primary,
            transform: [{ scale }],
          },
          style,
        ]}
      >
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
