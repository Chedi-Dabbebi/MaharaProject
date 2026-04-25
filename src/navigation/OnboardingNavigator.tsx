import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../types/navigation';
import { OnboardingWelcome } from '../screens/OnboardingWelcome';
import { OnboardingLanguage } from '../screens/OnboardingLanguage';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcome} />
      <Stack.Screen name="OnboardingLanguage" component={OnboardingLanguage} />
    </Stack.Navigator>
  );
}
