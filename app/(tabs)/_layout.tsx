import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Home, Heart, MessageCircle, User, Book, BarChart3 } from 'lucide-react-native';
import { Colors, Typography, Spacing, Shadow } from '@/constants/theme';
import { BlurView } from 'expo-blur';

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
];

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={100} tint="light" style={styles.tabBar}>
          <TabBarContent state={state} descriptors={descriptors} navigation={navigation} />
        </BlurView>
      ) : (
        <View style={[styles.tabBar, styles.androidTabBar]}>
          <TabBarContent state={state} descriptors={descriptors} navigation={navigation} />
        </View>
      )}
    </View>
  );
}

function TabBarContent({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContent}>
      {TABS.filter(tab => tab.show).map((tab, index) => {
        const isFocused = state.index === index;
        const Icon = tab.icon;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[index].key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[index].name);
          }
        };

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={onPress}
            style={[styles.tabItem, isFocused && styles.activeTabItem]}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
              <Icon 
                size={20} 
                color={isFocused ? Colors.white : Colors.gray500} 
                strokeWidth={2.5}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                isFocused ? styles.activeTabLabel : styles.inactiveTabLabel
              ]}
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
      tabBar={(props) => <CustomTabBar {...props} />}
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
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingTop: 12,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 0,
  },
  androidTabBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  tabBarContent: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 20,
    minWidth: 60,
  },
  activeTabItem: {
    backgroundColor: Colors.purple + '15',
  },
  iconContainer: {
    padding: Spacing.xs,
    borderRadius: 16,
    marginBottom: 2,
  },
  activeIconContainer: {
    backgroundColor: Colors.purple,
  },
  tabLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: Colors.purple,
    fontFamily: 'Inter-Bold',
  },
  inactiveTabLabel: {
    color: Colors.gray500,
  },
});