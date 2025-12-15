import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import ThreadScreen from '@/screens/ThreadScreen';
import BrowserScreen from '@/screens/BrowserScreen';

export type RootStackParamList = {
  Root: undefined;
  Thread: { threadId: string };
  Browser: { initialUrl?: string; initialTask?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="Thread" component={ThreadScreen} />
      <Stack.Screen name="Browser" component={BrowserScreen} />
    </Stack.Navigator>
  );
}
