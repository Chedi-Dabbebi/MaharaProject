import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ViewStyle } from 'react-native';

export type IconName =
  | 'music'
  | 'camera'
  | 'fitness'
  | 'language'
  | 'home'
  | 'calendar'
  | 'stats'
  | 'profile'
  | 'settings'
  | 'trophy'
  | 'fire'
  | 'target'
  | 'time'
  | 'checkmark'
  | 'lock'
  | 'star'
  | 'sparkle'
  | 'arrowForward'
  | 'refresh';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const iconMap: Record<IconName, string> = {
  music: 'musical-notes',
  camera: 'camera-outline',
  fitness: 'barbell-outline',
  language: 'language-outline',
  home: 'home-outline',
  calendar: 'calendar-outline',
  stats: 'analytics-outline',
  profile: 'person-outline',
  settings: 'settings-outline',
  trophy: 'trophy-outline',
  fire: 'flame-outline',
  target: 'target-outline',
  time: 'time-outline',
  checkmark: 'checkmark-circle-outline',
  lock: 'lock-closed-outline',
  star: 'star-outline',
  sparkle: 'sparkles-outline',
  arrowForward: 'arrow-forward-outline',
  refresh: 'refresh-outline',
};

export function Icon({ name, size = 24, color = '#94A3B8', style }: IconProps) {
  return (
    <Ionicons
      name={iconMap[name]}
      size={size}
      color={color}
      style={style}
    />
  );
}
