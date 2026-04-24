import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { SkillDetailScreen } from '../screens/SkillDetailScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { QuizResultScreen } from '../screens/QuizResultScreen';
import { HomeStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="SkillDetail"
        component={SkillDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="QuizScreen"
        component={QuizScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="QuizResultScreen"
        component={QuizResultScreen}
        options={{
          animation: 'fade',
        }}
      />
    </Stack.Navigator>
  );
}
