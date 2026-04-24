import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export function AmbientBackground() {
  const { colors, theme } = useTheme();
  const { width, height } = useWindowDimensions();
  
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimations = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim1, { toValue: 1, duration: 8000, useNativeDriver: true }),
          Animated.timing(anim1, { toValue: 0, duration: 8000, useNativeDriver: true }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(anim2, { toValue: 1, duration: 10000, useNativeDriver: true }),
          Animated.timing(anim2, { toValue: 0, duration: 10000, useNativeDriver: true }),
        ])
      ).start();
    };
    startAnimations();
  }, []);

  const topTranslateY = anim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });
  const topTranslateX = anim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const bottomTranslateY = anim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -60],
  });
  const bottomTranslateX = anim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  // Softer opacity in light mode
  const orbOpacity = theme === 'dark' ? 0.15 : 0.4;

  return (
    <View style={[StyleSheet.absoluteFillObject, { overflow: 'hidden', backgroundColor: colors.background }]}>
      {/* Top Right Orb */}
      <Animated.View
        style={[
          styles.orb,
          {
            backgroundColor: colors.primary,
            opacity: orbOpacity,
            width: width * 0.9,
            height: width * 0.9,
            top: -width * 0.3,
            right: -width * 0.2,
            transform: [{ translateY: topTranslateY }, { translateX: topTranslateX }],
          },
        ]}
      />
      {/* Bottom Left Orb */}
      <Animated.View
        style={[
          styles.orb,
          {
            backgroundColor: colors.secondary || '#7C3AED',
            opacity: orbOpacity * 0.8,
            width: width * 0.8,
            height: width * 0.8,
            bottom: -width * 0.2,
            left: -width * 0.3,
            transform: [{ translateY: bottomTranslateY }, { translateX: bottomTranslateX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 9999,
  },
});
