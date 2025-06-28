import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CircleHelp as HelpCircle, 
  Info, 
  LogOut, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  Calendar,
  Edit3,
  Save,
  X
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useMoodData } from '@/hooks/useMoodData';
import { useJournalData } from '@/hooks/useJournalData';
import { getProfile, updateProfile } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { moodStreak, averageMood } = useMoodData();
  const { totalEntries } = useJournalData();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await getProfile(user.id);
      if (error) throw error;
      
      if (data) {
        setProfile(data);
        setEditedName(data.full_name || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    
    try {
      const { data, error } = await updateProfile(user.id, {
        full_name: editedName,
      });
      
      if (error) throw error;
      
      if (data) {
        setProfile(data);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const userStats = [
    { label: 'Day Streak', value: moodStreak.toString(), icon: Calendar, color: Colors.purple },
    { label: 'Avg Mood', value: `${averageMood}%`, icon: TrendingUp, color: Colors.green },
    { label: 'Journal Entries', value: totalEntries.toString(), icon: Award, color: Colors.blue },
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
          onPress: async () => {
            await signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleMenuPress = (route: string) => {
    if (route.startsWith('/')) {
      router.push(route as any);
    }
  };

  if (!user || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={Colors.gradientPurple}
              style={styles.avatarContainer}
            >
              <User size={48} color={Colors.white} />
            </LinearGradient>
            
            <View style={styles.profileInfo}>
              {isEditing ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Enter your name"
                    placeholderTextColor={Colors.gray500}
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity 
                      onPress={() => setIsEditing(false)}
                      style={[styles.editButton, styles.cancelButton]}
                    >
                      <X size={16} color={Colors.gray600} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={handleSaveProfile}
                      style={[styles.editButton, styles.saveButton]}
                    >
                      <Save size={16} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.nameContainer}>
                  <Text style={styles.userName}>{profile?.full_name || 'User'}</Text>
                  <TouchableOpacity 
                    onPress={() => setIsEditing(true)}
                    style={styles.editIconButton}
                  >
                    <Edit3 size={16} color={Colors.gray600} />
                  </TouchableOpacity>
                </View>
              )}
              
              <Text style={styles.userEmail}>{profile?.email}</Text>
              <Text style={styles.joinDate}>
                Member since {new Date(profile?.created_at || '').toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Text>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.statsGrid}>
              {userStats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <LinearGradient
                    colors={[stat.color + '15', stat.color + '05']}
                    style={styles.statIconContainer}
                  >
                    <stat.icon size={24} color={stat.color} />
                  </LinearGradient>
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
                <View style={[styles.settingIcon, { backgroundColor: Colors.purple + '15' }]}>
                  <Bell size={20} color={Colors.purple} />
                </View>
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
                <View style={[styles.settingIcon, { backgroundColor: Colors.gray600 + '15' }]}>
                  <Settings size={20} color={Colors.gray600} />
                </View>
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
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
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
            <LinearGradient
              colors={[Colors.error + '15', Colors.error + '05']}
              style={styles.logoutGradient}
            >
              <LogOut size={20} color={Colors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Version Info */}
          <Text style={styles.versionText}>Mediverse v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.paragraph,
    color: Colors.gray600,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileHeader: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.medium,
  },
  profileInfo: {
    alignItems: 'center',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  nameInput: {
    ...Typography.subtitle,
    color: Colors.black,
    borderBottomWidth: 1,
    borderBottomColor: Colors.purple,
    paddingVertical: 4,
    minWidth: 150,
    textAlign: 'center',
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.gray200,
  },
  saveButton: {
    backgroundColor: Colors.purple,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  userName: {
    ...Typography.subtitle,
    color: Colors.black,
  },
  editIconButton: {
    padding: 4,
  },
  userEmail: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
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
    borderRadius: BorderRadius.lg,
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
  statIconContainer: {
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
    borderRadius: BorderRadius.lg,
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
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingText: {
    ...Typography.paragraph,
    color: Colors.black,
  },
  menuSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
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
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.small,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  logoutText: {
    ...Typography.paragraph,
    color: Colors.error,
    fontFamily: 'Inter-Bold',
  },
  versionText: {
    ...Typography.small,
    color: Colors.gray500,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
});