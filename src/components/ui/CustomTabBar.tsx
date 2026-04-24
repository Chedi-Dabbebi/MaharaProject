import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Icon } from './Icon';
import { useTheme } from '../../context/ThemeContext';

function TabButton({ route, isFocused, options, onPress, onLongPress, colors, isDark }: any) {
  const animation = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animation, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: true,
      friction: 6,
      tension: 70,
    }).start();
  }, [isFocused]);

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.1],
  });

  const bgScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const bgOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const iconName = route.name === 'HomeTab' ? 'home'
                 : route.name === 'PlanTab' ? 'calendar'
                 : route.name === 'StatsTab' ? 'stats'
                 : route.name === 'ProfileTab' ? 'profile' : 'home';

  const accentColor = route.name === 'HomeTab' ? colors.primary
                  : route.name === 'PlanTab' ? '#8B5CF6'
                  : route.name === 'StatsTab' ? '#10B981'
                  : route.name === 'ProfileTab' ? '#EC4899' : colors.primary;

  const iconColor = isFocused ? '#FFFFFF' : (isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)');

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabButton}
      activeOpacity={1}
    >
      {/* Animated Icon */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon name={iconName} size={26} color={iconColor} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const activeIndex = useRef(new Animated.Value(state.index)).current;

  useEffect(() => {
    Animated.spring(activeIndex, {
      toValue: state.index,
      useNativeDriver: false, // backgroundColor doesn't support native driver
      friction: 8,
      tension: 60,
    }).start();
  }, [state.index]);

  const barWidth = 280;
  const tabWidth = barWidth / state.routes.length; // 70 for 4 tabs

  const translateX = activeIndex.interpolate({
    inputRange: state.routes.map((_, i) => i),
    outputRange: state.routes.map((_, i) => i * tabWidth),
  });

  const tabColors = [
    colors.primary,
    '#8B5CF6',
    '#10B981',
    '#EC4899',
  ];

  const indicatorColor = activeIndex.interpolate({
    inputRange: tabColors.map((_, i) => i),
    outputRange: tabColors.slice(0, state.routes.length) as string[],
  });

  return (
    <View style={styles.floatingWrapper}>
      <View style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(15, 20, 28, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        }
      ]}>
        {/* Sliding Indicator Background */}
        <Animated.View
          style={[
            styles.glowBackground,
            {
              width: tabWidth,
              backgroundColor: indicatorColor,
              transform: [{ translateX }],
              shadowColor: indicatorColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            }
          ]}
        />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabButton
              key={route.key}
              route={route}
              isFocused={isFocused}
              options={options}
              onPress={onPress}
              onLongPress={onLongPress}
              colors={colors}
              isDark={isDark}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 24,
    left: 40, 
    right: 40, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
    alignItems: 'center', // Keep bar centered
  },
  container: {
    flexDirection: 'row',
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0, 
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 280, // Matches barWidth constant for perfect alignment
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  glowBackground: {
    position: 'absolute',
    width: 70, // Matches tabWidth
    height: 64,
    borderRadius: 32,
  },
});
