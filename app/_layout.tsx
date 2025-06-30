import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import { Text } from 'react-native';
import Splash from './splash';
import Onboarding from './onboarding';
import AuthLayout from './auth/_layout';
import Welcome from './welcome';
import Affirmations from './affirmations';
import Breathing from './breathing';
import Mindfulness from './mindfulness';
import Journal from './journal';
import MoodCheckIn from './mood-check-in';
import MusicPlayer from './music-player';
import Notifications from './notifications';
import EmergencyContacts from './emergency-contacts';
import BotCustomization from './bot-customization';
import Crisis from './crisis';
import Streaks from './streaks';
import Subscription from './subscription';
import Preferences from './preferences';
import Settings from './settings';
import Toolbox from './toolbox';
import VideoAgent from './video-agent';
import VoiceEntry from './voice-entry';
import Logout from './logout';
import JournalPrompt from './journal-prompt';
import MoodAnalysis from './mood-analysis';
import MoodTrends from './mood-trends';
import Voice from './voice';

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  return (
    <NavigationContainer>
<Drawer.Navigator initialRouteName="MainTabs">
        <Drawer.Screen name="MainTabs" component={MainStackNavigator} options={{ headerShown: false }} />
        <Drawer.Screen name="Affirmations" component={Affirmations} />
        <Drawer.Screen name="Breathing" component={Breathing} />
        <Drawer.Screen name="Mindfulness" component={Mindfulness} />
        <Drawer.Screen name="Journal" component={Journal} />
        <Drawer.Screen name="JournalPrompt" component={JournalPrompt} />
        <Drawer.Screen name="MoodCheckIn" component={MoodCheckIn} />
        <Drawer.Screen name="MoodAnalysis" component={MoodAnalysis} />
        <Drawer.Screen name="MoodTrends" component={MoodTrends} />
        <Drawer.Screen name="MusicPlayer" component={MusicPlayer} />
        <Drawer.Screen name="Notifications" component={Notifications} />
        <Drawer.Screen name="EmergencyContacts" component={EmergencyContacts} />
        <Drawer.Screen name="BotCustomization" component={BotCustomization} />
        <Drawer.Screen name="Crisis" component={Crisis} />
        <Drawer.Screen name="Streaks" component={Streaks} />
        <Drawer.Screen name="Subscription" component={Subscription} />
        <Drawer.Screen name="Preferences" component={Preferences} />
        <Drawer.Screen name="Settings" component={Settings} />
        <Drawer.Screen name="Toolbox" component={Toolbox} />
        <Drawer.Screen name="VideoAgent" component={VideoAgent} />
        <Drawer.Screen name="VoiceEntry" component={VoiceEntry} />
        <Drawer.Screen name="Voice" component={Voice} />
        <Drawer.Screen name="Logout" component={Logout} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

import TabsLayout from './(tabs)/_layout';

function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
      <Stack.Screen name="Auth" component={AuthLayout} options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={TabsLayout} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
