import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Breathingexcercise from './breathingexcercise';
import Chat from './chat';
import Context from './context';
import Feelings from './feelings';
import History from './history';
import Mood from './mood';
import Postsupport from './postsupport';
import Suggestions from './suggestions';
import Profile from './profile';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Breathingexcercise" component={Breathingexcercise} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Context" component={Context} />
      <Tab.Screen name="Feelings" component={Feelings} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Mood" component={Mood} />
      <Tab.Screen name="Postsupport" component={Postsupport} />
      <Tab.Screen name="Suggestions" component={Suggestions} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
