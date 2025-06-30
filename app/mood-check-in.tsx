import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const { width } = Dimensions.get('window');

const emotions = [
  { id: 'very-sad', label: 'Very Sad', emoji: '😢', value: 1 },
  { id: 'sad', label: 'Sad', emoji: '😞', value: 2 },
  { id: 'neutral', label: 'Neutral', emoji: '😐', value: 3 },
  { id: 'happy', label: 'Happy', emoji: '😊', value: 4 },
  { id: 'very-happy', label: 'Very Happy', emoji: '😄', value: 5 },
];

export default function MoodCheckInScreen() {
  const [selectedMood, setSelectedMood] = useState(3);
  const [intensity, setIntensity] = useState(5);

  const handleNext = () => {
    // Store mood data (in real app, save to database)
    const moodData = {
      mood: emotions.find(e => e.value === selectedMood),
      intensity,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Mood data:', moodData);
    router.push('/journal-prompt');
  };

  const selectedEmotion = emotions.find(e => e.value === selectedMood);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '25%' }]} />
        </View>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.headerIcon}>
          <X size={24} color={Colors.gray600} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How are you feeling today?</Text>
        <Text style={styles.subtitle}>Select the emoji that best represents your current mood</Text>

        <View style={styles.moodContainer}>
          <Text style={styles.selectedEmoji}>{selectedEmotion?.emoji}</Text>
          <Text style={styles.selectedLabel}>{selectedEmotion?.label}</Text>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            value={selectedMood}
            onValueChange={setSelectedMood}
            step={1}
            minimumTrackTintColor={Colors.lavender}
            maximumTrackTintColor={Colors.gray300}
            thumbTintColor={Colors.lavender}
          />
          <View style={styles.emojiRow}>
            {emotions.map((emotion) => (
              <TouchableOpacity
                key={emotion.id}
                style={styles.emojiButton}
                onPress={() => setSelectedMood(emotion.value)}
              >
                <Text style={[
                  styles.emojiText,
                  selectedMood === emotion.value && styles.selectedEmojiText
                ]}>
                  {emotion.emoji}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.intensitySection}>
          <Text style={styles.sectionTitle}>How intense is this feeling?</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            value={intensity}
            onValueChange={setIntensity}
            minimumTrackTintColor={Colors.lavender}
            maximumTrackTintColor={Colors.gray300}
            thumbTintColor={Colors.lavender}
          />
          <View style={styles.intensityLabels}>
            <Text style={styles.intensityLabel}>Very Low</Text>
            <Text style={styles.intensityValue}>{Math.round(intensity)}</Text>
            <Text style={styles.intensityLabel}>Very High</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
  },
  headerIcon: {
    padding: Spacing.xs,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.lg,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.lavender,
    borderRadius: BorderRadius.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  title: {
    ...Typography.title,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: Spacing.huge,
  },
  moodContainer: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
  },
  selectedEmoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  selectedLabel: {
    ...Typography.subtitle,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
  sliderContainer: {
    marginBottom: Spacing.huge,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: Spacing.lg,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  emojiButton: {
    padding: Spacing.sm,
  },
  emojiText: {
    fontSize: 24,
    opacity: 0.5,
  },
  selectedEmojiText: {
    opacity: 1,
  },
  intensitySection: {
    marginBottom: Spacing.huge,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  intensityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  intensityLabel: {
    ...Typography.small,
    color: Colors.gray600,
  },
  intensityValue: {
    ...Typography.subtitle,
    color: Colors.lavender,
    fontFamily: 'Poppins-Bold',
  },
  nextButton: {
    backgroundColor: Colors.lavender,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadow.medium,
  },
  nextButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
});