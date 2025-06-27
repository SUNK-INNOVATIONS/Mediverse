import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, Info, LogOut, ChevronRight, Award, TrendingUp, Calendar } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const userStats = [
    { label: 'Days Active', value: '47', icon: Calendar, color: Colors.purple },
    { label: 'Mood Entries', value: '156', icon: TrendingUp, color: Colors.green },
    { label: 'Chat Sessions', value: '23', icon: Award, color: Colors.yellow },
  ];

  const menuItems = [
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      route: '/settings',
      color: Colors.gray600,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      route: '/notifications',
      color: Colors.purple,
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      route: '/privacy',
      color: Colors.green,
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      route: '/help',
      color: Colors.yellow,
    },
    {
      id: 'about',
      title: 'About Mediverse',
      icon: Info,
      route: '/about',
      color: Colors.pink,
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => router.replace('/auth/login'),
        },
      ]
    );
  };

  const handleMenuPress = (route: string) => {
    if (route.startsWith('/')) {
      router.push(route as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={48} color={Colors.white} />
          </View>
          <Text style={styles.userName}>Sarah Johnson</Text>
          <Text style={styles.userEmail}>sarah.johnson@email.com</Text>
          <Text style={styles.joinDate}>Member since March 2024</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            {userStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <stat.icon size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Settings */}
        <View style={styles.quickSettings}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={Colors.purple} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.gray300, true: Colors.purple + '40' }}
              thumbColor={notificationsEnabled ? Colors.purple : Colors.gray400}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Settings size={20} color={Colors.gray600} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: Colors.gray300, true: Colors.purple + '40' }}
              thumbColor={darkModeEnabled ? Colors.purple : Colors.gray400}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.route)}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color={Colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={styles.versionText}>Mediverse v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  profileHeader: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.medium,
  },
  userName: {
    ...Typography.subtitle,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
  },
  joinDate: {
    ...Typography.small,
    color: Colors.gray500,
  },
  statsContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    ...Typography.subtitle,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.gray600,
    textAlign: 'center',
  },
  quickSettings: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    ...Typography.paragraph,
    color: Colors.black,
    marginLeft: Spacing.md,
  },
  menuSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuText: {
    ...Typography.paragraph,
    color: Colors.black,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  logoutText: {
    ...Typography.paragraph,
    color: Colors.error,
    marginLeft: Spacing.sm,
    fontFamily: 'Inter-Bold',
  },
  versionText: {
    ...Typography.small,
    color: Colors.gray500,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
});