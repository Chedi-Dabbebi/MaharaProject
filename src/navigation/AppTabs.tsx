import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabsParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { Icon } from '../components/ui/Icon';
import { View, StyleSheet } from 'react-native';
import { CustomTabBar } from '../components/ui/CustomTabBar';

import { HomeStack } from './HomeStack';
import { ProfileStack } from './ProfileStack';
import { PlanScreen } from '../screens/PlanScreen';
import { StatsScreen } from '../screens/StatsScreen';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  const { colors, theme } = useTheme();
  const { t } = useTranslation();

  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
      />
      <Tab.Screen
        name="PlanTab"
        component={PlanScreen}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
}
