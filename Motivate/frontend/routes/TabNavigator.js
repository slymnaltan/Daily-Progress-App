import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/GameScreen';
import MoreScreen from '../screens/MoreScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import TaskScreen from '../screens/TaskScreen';

import SudokuGame from '../screens/games/SudokuGame'
import MemoryGame from '../screens/games/MemoryGame'
import TicTacToeGame from '../screens/games/TicTacToeGame'
import NumberGuessGame from '../screens/games/NumberGuessGame'

const Tab = createBottomTabNavigator();
const GameStack = createNativeStackNavigator();

const GameStackScreen = () => (
  <GameStack.Navigator>
    <GameStack.Screen name="GameHome" component={GameScreen} options={{ title: 'Games' }} />
    <GameStack.Screen name="SudokuGame" component={SudokuGame} />
    <GameStack.Screen name="MemoryGame" component={MemoryGame} />
    <GameStack.Screen name="TicTacToeGame" component={TicTacToeGame} />
    <GameStack.Screen name="NumberGuessGame" component={NumberGuessGame} />
  </GameStack.Navigator>
);

export default function TabNavigator() {
  const insets = useSafeAreaInsets(); // dinamik safe area verisi

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Task') iconName = 'checkmark-done-outline';
          else if (route.name === 'Analysis') iconName = 'bar-chart-outline';
          else if (route.name === 'Game') iconName = 'game-controller-outline';
          else if (route.name === 'More') iconName = 'ellipsis-horizontal-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingTop: 5,
          paddingBottom: Math.max(insets.bottom, 8), // dinamik boşluk
          height: Platform.OS === 'android' ? 60 + insets.bottom : 80,
          borderTopWidth: 0.5,
          borderTopColor: '#ddd',
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Task" component={TaskScreen} />
      <Tab.Screen name="Analysis" component={AnalysisScreen} />
      <Tab.Screen name="Game" component={GameStackScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}
