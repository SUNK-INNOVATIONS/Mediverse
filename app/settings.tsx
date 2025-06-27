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
import {
  ArrowLeft,
  Bell,
  Moon,
  Shield,
  Database,
  Smartphone,
  Volume2,
  Vibrate,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: {
      enabled: true,
      moodReminders: true,
      journalReminders: true,
      weeklyReports: true,
      crisisAlerts: true,
    },
    privacy: {
      dataCollection: true,
      analytics: false,
      crashReports: true,
    },
    appearance: {
      darkMode: false,
      reducedMotion: false,
    },
    sounds: {
      enabled: true,
      vibration: true,
    },
  });

  const updateSetting = (category: string, key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be prepared for download. This may take a few moments.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Exporting data...') },
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your mood entries, journal entries, and chat history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Deleting data...'),
        },
      ]
    );
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const SettingRow = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    showSwitch = true,
    onPress,
    showChevron = false 
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    showSwitch?: boolean;
    onPress?: () => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.settingRow} 
      onPress={onPress}
      disabled={!onPress && !onValueChange}
    >
      <View style={styles.settingLeft}>
        <Icon size={20} color={Colors.purple} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showSwitch && onValueChange && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: Colors.gray300, true: Colors.purple + '40' }}
          thumbColor={value ? Colors.purple : Colors.gray400}
        />
      )}
      {showChevron && <ChevronRight size={20} color={Colors.gray400} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SettingSection title="Notifications">
          <SettingRow
            icon={Bell}
            title="Enable Notifications"
            subtitle="Receive app notifications"
            value={settings.notifications.enabled}
            onValueChange={(value) => updateSetting('notifications', 'enabled', value)}
          />
          <SettingRow
            icon={Clock}
            title="Mood Reminders"
            subtitle="Daily reminders to track your mood"
            value={settings.notifications.moodReminders}
            onValueChange={(value) => updateSetting('notifications', 'moodReminders', value)}
          />
          <SettingRow
            icon={Bell}
            title="Journal Reminders"
            subtitle="Reminders to write in your journal"
            value={settings.notifications.journalReminders}
            onValueChange={(value) => updateSetting('notifications', 'journalReminders', value)}
          />
          <SettingRow
            icon={Bell}
            title="Weekly Reports"
            subtitle="Summary of your mental health progress"
            value={settings.notifications.weeklyReports}
            onValueChange={(value) => updateSetting('notifications', 'weeklyReports', value)}
          />
          <SettingRow
            icon={Shield}
            title="Crisis Alerts"
            subtitle="Important mental health resources"
            value={settings.notifications.crisisAlerts}
            onValueChange={(value) => updateSetting('notifications', 'crisisAlerts', value)}
          />
        </SettingSection>

        <SettingSection title="Appearance">
          <SettingRow
            icon={Moon}
            title="Dark Mode"
            subtitle="Use dark theme throughout the app"
            value={settings.appearance.darkMode}
            onValueChange={(value) => updateSetting('appearance', 'darkMode', value)}
          />
          <SettingRow
            icon={Smartphone}
            title="Reduced Motion"
            subtitle="Minimize animations and transitions"
            value={settings.appearance.reducedMotion}
            onValueChange={(value) => updateSetting('appearance', 'reducedMotion', value)}
          />
        </SettingSection>

        <SettingSection title="Sounds & Haptics">
          <SettingRow
            icon={Volume2}
            title="Sound Effects"
            subtitle="Play sounds for interactions"
            value={settings.sounds.enabled}
            onValueChange={(value) => updateSetting('sounds', 'enabled', value)}
          />
          <SettingRow
            icon={Vibrate}
            title="Vibration"
            subtitle="Haptic feedback for interactions"
            value={settings.sounds.vibration}
            onValueChange={(value) => updateSetting('sounds', 'vibration', value)}
          />
        </SettingSection>

        <SettingSection title="Privacy & Data">
          <SettingRow
            icon={Database}
            title="Data Collection"
            subtitle="Help improve the app with usage data"
            value={settings.privacy.dataCollection}
            onValueChange={(value) => updateSetting('privacy', 'dataCollection', value)}
          />
          <SettingRow
            icon={Shield}
            title="Analytics"
            subtitle="Share anonymous usage statistics"
            value={settings.privacy.analytics}
            onValueChange={(value) => updateSetting('privacy', 'analytics', value)}
          />
          <SettingRow
            icon={Database}
            title="Crash Reports"
            subtitle="Automatically send crash reports"
            value={settings.privacy.crashReports}
            onValueChange={(value) => updateSetting('privacy', 'crashReports', value)}
          />
        </SettingSection>

        <SettingSection title="Data Management">
          <SettingRow
            icon={Database}
            title="Export Data"
            subtitle="Download your data as a file"
            showSwitch={false}
            showChevron={true}
            onPress={handleExportData}
          />
          <SettingRow
            icon={Database}
            title="Delete All Data"
            subtitle="Permanently remove all your data"
            showSwitch={false}
            showChevron={true}
            onPress={handleDeleteData}
          />
        </SettingSection>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Mediverse</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoText}>
            Your mental health companion, designed with privacy and security in mind.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
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
  headerTitle: {
    ...Typography.heading,
    color: Colors.black,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionContent: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  settingTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  settingSubtitle: {
    ...Typography.small,
    color: Colors.gray600,
    lineHeight: 16,
  },
  appInfo: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadow.small,
  },
  appInfoTitle: {
    ...Typography.subtitle,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  appInfoVersion: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginBottom: Spacing.md,
  },
  appInfoText: {
    ...Typography.small,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 18,
  },
});