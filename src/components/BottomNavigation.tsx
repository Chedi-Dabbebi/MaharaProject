import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, IconName } from './ui/Icon';

type Screen = 'home' | 'plan' | 'stats' | 'profile';

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
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                isActive && styles.navItemActive,
              ]}
              onPress={() => onNavigate(item.id)}
              activeOpacity={0.7}
            >
              <Icon name={item.icon} size={24} color={isActive ? '#E23E57' : '#94A3B8'} />
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive,
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: 'rgba(226, 62, 87, 0.1)',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  labelActive: {
    color: '#E23E57',
  },
});
