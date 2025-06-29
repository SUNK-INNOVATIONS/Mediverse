import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Bell, Clock, Heart, MessageCircle, Trash2 } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'reminder' | 'achievement' | 'check-in' | 'tip';
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Daily Check-in Reminder',
    message: 'How are you feeling today? Take a moment to track your mood.',
    time: '2 hours ago',
    type: 'reminder',
    read: false,
  },
  {
    id: '2',
    title: 'Achievement Unlocked! 🎉',
    message: 'You\'ve completed 7 days of mood tracking. Keep up the great work!',
    time: '1 day ago',
    type: 'achievement',
    read: false,
  },
  {
    id: '3',
    title: 'Wellness Tip',
    message: 'Try the 5-4-3-2-1 grounding technique when feeling anxious.',
    time: '2 days ago',
    type: 'tip',
    read: true,
  },
  {
    id: '4',
    title: 'AI Companion Check-in',
    message: 'Your AI companion noticed you might be feeling stressed. Want to chat?',
    time: '3 days ago',
    type: 'check-in',
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [settings, setSettings] = useState({
    dailyReminders: true,
    achievements: true,
    aiCheckIns: true,
    wellnessTips: true,
    crisisAlerts: true,
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return Clock;
      case 'achievement':
        return Heart;
      case 'check-in':
        return MessageCircle;
      case 'tip':
        return Bell;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return Colors.lavender;
      case 'achievement':
        return Colors.yellow;
      case 'check-in':
        return Colors.green;
      case 'tip':
        return Colors.pastelBlue;
      default:
        return Colors.gray600;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Action Buttons */}
        {notifications.length > 0 && (
          <View style={styles.actionsContainer}>
            {unreadCount > 0 && (
              <TouchableOpacity style={styles.actionButton} onPress={markAllAsRead}>
                <Text style={styles.actionButtonText}>Mark All Read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton} onPress={clearAll}>
              <Text style={styles.actionButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Notifications List */}
        <View style={styles.notificationsSection}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Bell size={48} color={Colors.gray400} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptyText}>
                You're all caught up! We'll notify you of important updates and reminders.
              </Text>
            </View>
          ) : (
            notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const color = getNotificationColor(notification.type);
              
              return (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.read && styles.unreadCard
                  ]}
                  onPress={() => markAsRead(notification.id)}
                >
                  <View style={styles.notificationHeader}>
                    <View style={[styles.notificationIcon, { backgroundColor: color + '20' }]}>
                      <Icon size={20} color={color} />
                    </View>
                    <View style={styles.notificationInfo}>
                      <Text style={[
                        styles.notificationTitle,
                        !notification.read && styles.unreadTitle
                      ]}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => deleteNotification(notification.id)}
                    >
                      <Trash2 size={16} color={Colors.gray400} />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  
                  {!notification.read && (
                    <View style={styles.unreadIndicator} />
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Notification Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Daily Reminders</Text>
                <Text style={styles.settingDescription}>
                  Get reminded to check in with your mood
                </Text>
              </View>
              <Switch
                value={settings.dailyReminders}
                onValueChange={(value) => updateSetting('dailyReminders', value)}
                trackColor={{ false: Colors.gray300, true: Colors.lavender + '40' }}
                thumbColor={settings.dailyReminders ? Colors.lavender : Colors.gray400}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Achievement Notifications</Text>
                <Text style={styles.settingDescription}>
                  Celebrate your wellness milestones
                </Text>
              </View>
              <Switch
                value={settings.achievements}
                onValueChange={(value) => updateSetting('achievements', value)}
                trackColor={{ false: Colors.gray300, true: Colors.lavender + '40' }}
                thumbColor={settings.achievements ? Colors.lavender : Colors.gray400}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>AI Check-ins</Text>
                <Text style={styles.settingDescription}>
                  Let your AI companion reach out when needed
                </Text>
              </View>
              <Switch
                value={settings.aiCheckIns}
                onValueChange={(value) => updateSetting('aiCheckIns', value)}
                trackColor={{ false: Colors.gray300, true: Colors.lavender + '40' }}
                thumbColor={settings.aiCheckIns ? Colors.lavender : Colors.gray400}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Wellness Tips</Text>
                <Text style={styles.settingDescription}>
                  Receive helpful mental health tips
                </Text>
              </View>
              <Switch
                value={settings.wellnessTips}
                onValueChange={(value) => updateSetting('wellnessTips', value)}
                trackColor={{ false: Colors.gray300, true: Colors.lavender + '40' }}
                thumbColor={settings.wellnessTips ? Colors.lavender : Colors.gray400}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Crisis Alerts</Text>
                <Text style={styles.settingDescription}>
                  Important mental health resources and support
                </Text>
              </View>
              <Switch
                value={settings.crisisAlerts}
                onValueChange={(value) => updateSetting('crisisAlerts', value)}
                trackColor={{ false: Colors.gray300, true: Colors.lavender + '40' }}
                thumbColor={settings.crisisAlerts ? Colors.lavender : Colors.gray400}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.black,
  },
  unreadBadge: {
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  unreadText: {
    ...Typography.small,
    color: Colors.white,
    fontFamily: 'Poppins-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  actionButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  actionButtonText: {
    ...Typography.small,
    color: Colors.gray600,
    fontFamily: 'Poppins-SemiBold',
  },
  notificationsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.huge,
    alignItems: 'center',
    ...Shadow.small,
  },
  emptyTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
  notificationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    position: 'relative',
    ...Shadow.small,
  },
  unreadCard: {
    backgroundColor: Colors.lightLavender,
    borderLeftWidth: 4,
    borderLeftColor: Colors.lavender,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.xs,
  },
  unreadTitle: {
    color: Colors.lavender,
  },
  notificationTime: {
    ...Typography.small,
    color: Colors.gray600,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationMessage: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lavender,
  },
  settingsSection: {
    marginBottom: Spacing.huge,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    ...Shadow.small,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    ...Typography.small,
    color: Colors.gray600,
    lineHeight: 18,
  },
});