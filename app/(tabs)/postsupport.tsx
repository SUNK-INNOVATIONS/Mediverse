import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function PostSupportReflectionScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleDone = () => {
    router.push('/(tabs)/mood');
  };

  const moods = [
    { id: 'happy', image: require('@/assets/images/happy-emoji.png') },
    { id: 'neutral', image: require('@/assets/images/happy-emoji.png') }, // Replace with neutral emoji
    { id: 'sad', image: require('@/assets/images/sad-emoji.png') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={{ ...styles.progressBarFill, width: '100%' }} />
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <X size={24} color={Colors.gray600} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>How are you feeling now?</Text>
        <View style={styles.moodRow}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodButton,
                selectedMood === mood.id && styles.selectedMoodButton,
              ]}
              onPress={() => setSelectedMood(mood.id)}
            >
              <Image source={mood.image} style={styles.moodImage} />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.feedbackBox}
          placeholder="Leave a note"
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.sm,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingVertical: Spacing.lg,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xxl,
  },
  moodButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  selectedMoodButton: {
    backgroundColor: Colors.gray200,
  },
  moodImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  feedbackBox: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
    ...Shadow.small,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  doneButton: {
    backgroundColor: Colors.purple,
    marginHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadow.medium,
  },
  doneButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
});
