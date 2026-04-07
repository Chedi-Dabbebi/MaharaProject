import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, IconName } from './ui/Icon';
import { useTheme } from '../context/ThemeContext';

type Screen = 'loading' | 'login' | 'home' | 'skillDetail' | 'plan' | 'stats' | 'profile' | 'settings';

interface BottomNavigationProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems: { id: Screen; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'plan', label: 'Plan', icon: 'calendar' },
  { id: 'stats', label: 'Stats', icon: 'stats' },
  { id: 'profile', label: 'Profile', icon: 'profile' },
];

export function BottomNavigation({ activeScreen, onNavigate }: BottomNavigationProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.navBackground, borderColor: colors.navBorder }]}>
      <View style={styles.content}>
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                isActive && [styles.navItemActive, { backgroundColor: colors.navActiveBg }],
              ]}
              onPress={() => onNavigate(item.id)}
              activeOpacity={0.7}
            >
              <Icon name={item.icon} size={24} color={isActive ? colors.iconActive : colors.iconDefault} />
              <Text
                style={[
                  styles.label,
                  { color: isActive ? colors.iconActive : colors.iconDefault },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingBottom: 20,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  navItemActive: {
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
