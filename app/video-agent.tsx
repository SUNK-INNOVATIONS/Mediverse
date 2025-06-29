import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Volume2, VolumeX, Settings } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function VideoAgentScreen() {
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Meet Your AI Therapist</Text>
        <TouchableOpacity onPress={handleSkip}>
          <X size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Video Container */}
        <View style={styles.videoContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.videoPlaceholder}
          />
          
          {/* Video Controls */}
          <View style={styles.videoControls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX size={20} color={Colors.white} />
              ) : (
                <Volume2 size={20} color={Colors.white} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setShowSettings(!showSettings)}
            >
              <Settings size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Simulated video overlay */}
          <View style={styles.videoOverlay}>
            <View style={styles.speakingIndicator}>
              <Text style={styles.speakingText}>Speaking...</Text>
            </View>
          </View>
        </View>

        {/* Introduction Text */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Hi, I'm Dr. Sarah</Text>
          <Text style={styles.introText}>
            I'm your AI therapist companion, here to provide personalized support and guidance on your mental health journey. 
            I can help you process emotions, develop coping strategies, and track your progress over time.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🎯</Text>
            <Text style={styles.featureText}>Personalized therapy sessions</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>💬</Text>
            <Text style={styles.featureText}>24/7 emotional support</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📊</Text>
            <Text style={styles.featureText}>Progress tracking & insights</Text>
          </View>
        </View>

        {/* Settings Panel */}
        {showSettings && (
          <View style={styles.settingsPanel}>
            <Text style={styles.settingsTitle}>Video Settings</Text>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Change Avatar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Adjust Voice Speed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Turn Off Video Agent</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Start My Journey</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip Video Introduction</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerText}>
            This AI therapist is designed to provide support and guidance, but is not a replacement for professional mental health care. 
            If you're experiencing a crisis, please contact emergency services or a mental health professional.
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
  videoContainer: {
    position: 'relative',
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    ...Shadow.large,
  },
  videoPlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.gray800,
  },
  videoControls: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  speakingIndicator: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignSelf: 'flex-start',
  },
  speakingText: {
    ...Typography.small,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  introCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  introTitle: {
    ...Typography.subtitle,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  introText: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 22,
  },
  featuresContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  featureText: {
    ...Typography.secondary,
    color: Colors.gray700,
    flex: 1,
  },
  settingsPanel: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  settingsTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.md,
  },
  settingItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  settingText: {
    ...Typography.secondary,
    color: Colors.lavender,
  },
  actionsContainer: {
    marginBottom: Spacing.lg,
  },
  continueButton: {
    backgroundColor: Colors.lavender,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadow.medium,
  },
  continueButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  skipButton: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray200,
  },
  skipButtonText: {
    ...Typography.secondary,
    color: Colors.gray600,
    fontFamily: 'Poppins-SemiBold',
  },
  disclaimerCard: {
    backgroundColor: Colors.yellow + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.yellow,
  },
  disclaimerText: {
    ...Typography.small,
    color: Colors.gray700,
    lineHeight: 18,
  },
});