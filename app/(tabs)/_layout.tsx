import React from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Chrome as Home, Heart, MessageCircle, User, History, Book } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

// Define tabs and control which ones are shown
const TABS = [
  {
    name: 'index',
    title: 'Home',
    icon: Home,
    show: true,
  },
  {
    name: 'mood',
    title: 'Mood',
    icon: Heart,
    show: true,
  },
  {
    name: 'chat',
    title: 'Chat',
    icon: MessageCircle,
    show: true,
  },
  {
    name: 'journal',
    title: 'Journal',
    icon: Book,
    show: true,
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: User,
    show: true,
  },
  {
    name: 'history',
    title: 'History',
    icon: History,
    show: false, // Change to true to show
  },
];

function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.tabBar}>
      {TABS.filter(tab => tab.show).map((tab) => {
        const isActive = pathname === `/${tab.name}` || (tab.name === 'index' && pathname === '/');
        const Icon = tab.icon;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(('/' + tab.name) as any)}
            style={styles.tabItem}
          >
            <Icon size={24} color={isActive ? Colors.lavender : Colors.gray500} />
            <Text
              style={{
                color: isActive ? Colors.lavender : Colors.gray500,
                fontSize: 12,
                fontFamily: 'Nunito-Medium',
              }}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={() => <CustomTabBar />}
    >
      {TABS.filter(tab => tab.show).map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{ title: tab.title }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopColor: Colors.gray200,
    borderTopWidth: 1,
    height: 84,
    paddingBottom: 20,
    paddingTop: 8,
    justifyContent: 'space-around',
    ...{
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 8,
    },
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
  },
});