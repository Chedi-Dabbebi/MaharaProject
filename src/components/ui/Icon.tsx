import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

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
  | 'refresh'
  | 'arrow-left'
  | 'moon'
  | 'bell'
  | 'volume-up'
  | 'user'
  | 'help'
  | 'info'
  | 'logout'
  | 'checkmark-circle'
  | 'trash'
  | 'alert-circle'
  | 'eye'
  | 'eye-off'
  | 'mail'
  | 'lock-closed'
  | 'arrow-back'
  | 'logo-google'
  | 'logo-facebook'
  | 'person'
  | 'save'
  | 'edit'
  | 'alert-triangle'
  | 'chevron-left'
  | 'chevron-back';

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
  'arrow-left': 'arrow-back-outline',
  moon: 'moon-outline',
  bell: 'notifications-outline',
  'volume-up': 'volume-high-outline',
  user: 'person-outline',
  help: 'help-circle-outline',
  info: 'information-circle-outline',
  logout: 'log-out-outline',
  'checkmark-circle': 'checkmark-circle-outline',
  trash: 'trash-outline',
  'alert-circle': 'alert-circle-outline',
  eye: 'eye-outline',
  'eye-off': 'eye-off-outline',
  mail: 'mail-outline',
  'lock-closed': 'lock-closed-outline',
  'arrow-back': 'arrow-back-outline',
  'logo-google': 'logo-google',
  'logo-facebook': 'logo-facebook',
  person: 'person-outline',
  save: 'save-outline',
  edit: 'pencil-outline',
  'alert-triangle': 'alert-circle-outline',
  'chevron-left': 'chevron-back-outline',
  'chevron-back': 'chevron-back-outline',
};

export function Icon({ name, size = 24, color, style }: IconProps) {
  const { colors } = useTheme();
  const iconColor = color ?? colors.iconDefault;

  return (
    <Ionicons
      name={iconMap[name]}
      size={size}
      color={iconColor}
      style={style}
    />
  );
}
