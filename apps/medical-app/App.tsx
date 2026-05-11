import './src/i18n';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import HomeScreen from './src/screens/HomeScreen';
import SymptomCheckerScreen from './src/screens/SymptomCheckerScreen';
import FirstAidScreen from './src/screens/FirstAidScreen';
import MedicationsScreen from './src/screens/MedicationsScreen';
import ChildHealthScreen from './src/screens/ChildHealthScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1A1A2E' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: '#E74C3C',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { paddingBottom: 4 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('appName'),
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('settings.title'),
          tabBarLabel: t('settings.title'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { t } = useTranslation();
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1A1A2E' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="Main" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="SymptomChecker"
          component={SymptomCheckerScreen}
          options={{ title: t('symptoms.title') }}
        />
        <Stack.Screen
          name="FirstAid"
          component={FirstAidScreen}
          options={{ title: t('firstAid.title') }}
        />
        <Stack.Screen
          name="Medications"
          component={MedicationsScreen}
          options={{ title: t('home.medications') }}
        />
        <Stack.Screen
          name="ChildHealth"
          component={ChildHealthScreen}
          options={{ title: t('home.childHealth') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
