import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, LogOut, Trash2, Download, Heart } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function LogoutScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? You can always sign back in anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            // Simulate logout process
            setTimeout(() => {
              setIsLoading(false);
              router.replace('/welcome');
            }, 1500);
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your mood entries, journal entries, and chat history will be prepared for download. This may take a few moments.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Exporting data...') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.\n\nAre you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'This is your last chance to change your mind. All your data will be permanently deleted.',
              [
                { text: 'Keep My Account', style: 'cancel' },
                {
                  text: 'Delete Everything',
                  style: 'destructive',
                  onPress: () => {
                    console.log('Deleting account...');
                    router.replace('/welcome');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Gentle Message */}
        <View style={styles.messageCard}>
          <Heart size={32} color={Colors.pink} />
          <Text style={styles.messageTitle}>We'll miss you</Text>
          <Text style={styles.messageText}>
            Your mental health journey is important to us. If you're leaving because something isn't working, 
            we'd love to help make it better.
          </Text>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Before you go...</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={handleExportData}>
            <View style={styles.actionIcon}>
              <Download size={24} color={Colors.green} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Export Your Data</Text>
              <Text style={styles.actionDescription}>
                Download all your mood entries, journal entries, and chat history
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity 
            style={[styles.actionCard, styles.logoutCard]} 
            onPress={handleLogout}
            disabled={isLoading}
          >
            <View style={styles.actionIcon}>
              <LogOut size={24} color={Colors.orange} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Logout</Text>
              <Text style={styles.actionDescription}>
                {isLoading ? 'Logging you out...' : 'Sign out of your account (you can sign back in anytime)'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, styles.deleteCard]} 
            onPress={handleDeleteAccount}
          >
            <View style={styles.actionIcon}>
              <Trash2 size={24} color={Colors.error} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, styles.deleteTitle]}>Delete Account</Text>
              <Text style={styles.actionDescription}>
                Permanently delete your account and all data (this cannot be undone)
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Support Message */}
        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportText}>
            If you're experiencing a mental health crisis or need immediate support, 
            please contact emergency services or a mental health professional.
          </Text>
          <Text style={styles.supportContact}>
            Crisis Text Line: Text HOME to 741741{'\n'}
            National Suicide Prevention Lifeline: 988
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for trusting Mediverse with your mental health journey. 
            Take care of yourself. 💙
          </Text>
        </View>
      </View>
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
  headerTitle: {
    ...Typography.heading,
    color: Colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  messageCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  messageTitle: {
    ...Typography.subtitle,
    color: Colors.black,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  messageText: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.small,
  },
  logoutCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.orange,
  },
  deleteCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  deleteTitle: {
    color: Colors.error,
  },
  actionDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    lineHeight: 18,
  },
  supportCard: {
    backgroundColor: Colors.lightLavender,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.lavender,
  },
  supportTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  supportText: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  supportContact: {
    ...Typography.small,
    color: Colors.lavender,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
  },
  footerText: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
});