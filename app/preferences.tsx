import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const toneOptions = [
  { id: 'professional', label: 'Professional', description: 'Clinical and structured approach' },
  { id: 'friendly', label: 'Friendly', description: 'Warm and conversational tone' },
  { id: 'spiritual', label: 'Spiritual', description: 'Mindful and holistic guidance' },
  { id: 'funny', label: 'Funny', description: 'Light-hearted with gentle humor' },
];

const voiceOptions = [
  { id: 'soft', label: 'Soft', description: 'Gentle and soothing voice' },
  { id: 'energetic', label: 'Energetic', description: 'Upbeat and motivating tone' },
  { id: 'calm', label: 'Calm', description: 'Peaceful and meditative voice' },
  { id: 'robotic', label: 'Robotic', description: 'Clear and neutral delivery' },
];

export default function PreferencesScreen() {
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [selectedVoice, setSelectedVoice] = useState('soft');

  const handleContinue = () => {
    // Save preferences and navigate to main app
    router.replace('/(tabs)');
  };

  const OptionCard = ({ 
    option, 
    isSelected, 
    onSelect 
  }: { 
    option: any; 
    isSelected: boolean; 
    onSelect: () => void; 
  }) => (
    <TouchableOpacity
      style={[
        styles.optionCard,
        isSelected && styles.selectedCard
      ]}
      onPress={onSelect}
    >
      <View style={styles.optionContent}>
        <View style={styles.optionHeader}>
          <Text style={[
            styles.optionTitle,
            isSelected && styles.selectedText
          ]}>
            {option.label}
          </Text>
          {isSelected && (
            <View style={styles.checkIcon}>
              <Check size={16} color={Colors.white} />
            </View>
          )}
        </View>
        <Text style={[
          styles.optionDescription,
          isSelected && styles.selectedDescription
        ]}>
          {option.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Preferred Tone</Text>
          <Text style={styles.sectionDescription}>
            How would you like your AI companion to communicate with you?
          </Text>
          
          <View style={styles.optionsContainer}>
            {toneOptions.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                isSelected={selectedTone === option.id}
                onSelect={() => setSelectedTone(option.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Type Preference</Text>
          <Text style={styles.sectionDescription}>
            Select the voice style for audio interactions
          </Text>
          
          <View style={styles.optionsContainer}>
            {voiceOptions.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                isSelected={selectedVoice === option.id}
                onSelect={() => setSelectedVoice(option.id)}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue to Mediverse</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You can change these preferences anytime in settings
          </Text>
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
  headerTitle: {
    ...Typography.heading,
    color: Colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  section: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.huge,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.gray200,
    ...Shadow.small,
  },
  selectedCard: {
    borderColor: Colors.lavender,
    backgroundColor: Colors.lightLavender,
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  optionTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
  selectedText: {
    color: Colors.lavender,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    lineHeight: 18,
  },
  selectedDescription: {
    color: Colors.gray700,
  },
  continueButton: {
    backgroundColor: Colors.lavender,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadow.medium,
  },
  continueText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  footer: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
  },
  footerText: {
    ...Typography.small,
    color: Colors.gray500,
    textAlign: 'center',
  },
});