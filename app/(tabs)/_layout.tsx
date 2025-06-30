import React from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Heart, MessageCircle, User, History, Book } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

// Define tabs and control which ones are shown
const TABS = [
  {
    name: ' ',
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
    icon: Book, // Replace with appropriate icon
    show: true,
  },
  {
    name: 'history',
    title: 'History',
    icon: History,
    show: false, // Change to true to show
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: User,
    show: true,
  },
  {
    name: 'context',
    title: 'Context',
    icon: Heart, // Replace with appropriate icon
    show: false,
  },

];

function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.tabBar}>
      {TABS.filter(tab => tab.show).map((tab) => {
        const isActive = pathname === `/${tab.name}`;
        const Icon = tab.icon;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(('/' + tab.name) as any)}
            style={styles.tabItem}
          >
            <Icon size={24} color={isActive ? Colors.purple : Colors.gray500} />
            <Text
              style={{
                color: isActive ? Colors.purple : Colors.gray500,
                fontSize: 12,
                fontFamily: 'Inter-Medium',
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
  },
  tabItem: {
    alignItems: 'center',
  },
});
