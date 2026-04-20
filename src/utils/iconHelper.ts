import { IconName } from '../components/ui/Icon';

/**
 * Maps skill icon names to their corresponding Ionicon names
 */
export const getIconName = (iconName: string): IconName => {
  const iconMap: Record<string, IconName> = {
    music: 'music',
    camera: 'camera',
    dumbbell: 'fitness',
    translate: 'language',
  };
  return iconMap[iconName] || 'star';
};

/**
 * Maps skill icon names to emoji representations
 */
export const getIconEmoji = (iconName: string): string => {
  const iconMap: Record<string, string> = {
    music: '🎵',
    camera: '📷',
    dumbbell: '🏋️',
    translate: '🌐',
  };
  return iconMap[iconName] || '⭐';
};
