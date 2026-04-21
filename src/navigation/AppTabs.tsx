import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabsParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { Icon } from '../components/ui/Icon';

import { HomeStack } from './HomeStack';
import { ProfileStack } from './ProfileStack';
import { PlanScreen } from '../screens/PlanScreen';
import { StatsScreen } from '../screens/StatsScreen';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.navBackground,
          borderTopColor: colors.navBorder,
          elevation: 0, // for Android
          shadowOpacity: 0, // for iOS
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.iconActive,
        tabBarInactiveTintColor: colors.iconDefault,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: t('nav_home') as string,
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="PlanTab"
        component={PlanScreen}
        options={{
          tabBarLabel: t('nav_plan') as string,
          tabBarIcon: ({ color, size }) => <Icon name="calendar" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{
          tabBarLabel: t('nav_stats') as string,
          tabBarIcon: ({ color, size }) => <Icon name="stats" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: t('nav_profile') as string,
          tabBarIcon: ({ color, size }) => <Icon name="profile" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
