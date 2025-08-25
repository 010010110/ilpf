import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ListScreen from '@/screens/ListScreen';
import FormScreen from '@/screens/FormScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import AboutScreen from '@/screens/AboutScreen';
import ResultScreen from '@/screens/ResultScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="List"
      screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2e7d32' }}
    >
      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{
          tabBarLabel: 'Listagem',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Result"
        component={ResultScreen}
        options={{
          tabBarLabel: 'Resultado',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Form"
        component={FormScreen}
        options={{
          tabBarLabel: 'Novo',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-box" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarLabel: 'Sobre',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="information-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
