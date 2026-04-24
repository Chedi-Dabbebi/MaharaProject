import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, DimensionValue } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface LoadingSkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'rect' | 'circle' | 'text';
}

export function LoadingSkeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
  variant = 'rect',
}: LoadingSkeletonProps) {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.45],
  });

  const containerStyle: ViewStyle = {
    width,
    height,
    borderRadius,
    backgroundColor: colors.surfaceElevated,
    ...(variant === 'circle' ? { borderRadius: height / 2 } : {}),
  };

  return (
    <Animated.View style={[containerStyle, { opacity }, style]} />
  );
}

interface LoadingSkeletonContainerProps {
  lines?: number;
  showImage?: boolean;
  showTitle?: boolean;
}

export function LoadingSkeletonContainer({
  lines = 3,
  showImage = false,
  showTitle = true,
}: LoadingSkeletonContainerProps) {
  return (
    <View style={styles.container}>
      {showImage && (
        <LoadingSkeleton
          width={80}
          height={80}
          borderRadius={16}
          style={styles.image}
        />
      )}
      {showTitle && (
        <LoadingSkeleton
          width="60%"
          height={24}
          borderRadius={12}
          style={styles.title}
        />
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton
          key={i}
          width={i === lines - 1 ? '40%' : '100%'}
          height={14}
          borderRadius={7}
          style={i === 0 ? styles.firstLine : styles.line}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
  },
  firstLine: {
    marginBottom: 8,
  },
  line: {
    marginBottom: 8,
  },
});
