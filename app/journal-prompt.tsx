import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, X, Mic } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function JournalPromptScreen() {
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const moodTags = [
    'Work', 'Family', 'Health', 'Relationships', 'Sleep', 
    'Exercise', 'Money', 'Social', 'Weather', 'Stress',
    'Anxiety', 'Joy', 'Gratitude', 'Loneliness', 'Energy'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleNext = () => {
    // Store journal data
    const journalData = {
      text,
      tags: selectedTags,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Journal data:', journalData);
    
    // Navigate to voice entry or mood analysis
    if (text.trim()) {
      router.push('/mood-analysis');
    } else {
      router.push('/voice-entry');
    }
  };

  const handleVoiceEntry = () => {
    router.push('/voice-entry');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '50%' }]} />
        </View>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.headerIcon}>
          <X size={24} color={Colors.gray600} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What's been going on?</Text>
        <Text style={styles.subtitle}>
          You can write freely about your thoughts and feelings, or choose what's affecting you
        </Text>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.textInput}
            placeholder="Write here about your day, thoughts, or feelings..."
            placeholderTextColor={Colors.gray500}
            value={text}
            onChangeText={setText}
            multiline
            textAlignVertical="top"
          />
          
          <TouchableOpacity style={styles.voiceButton} onPress={handleVoiceEntry}>
            <Mic size={20} color={Colors.lavender} />
            <Text style={styles.voiceButtonText}>Or speak your thoughts</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>What's affecting your mood?</Text>
          <View style={styles.tagsContainer}>
            {moodTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.selectedTag,
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[
                  styles.tagText,
                  selectedTags.includes(tag) && styles.selectedTagText,
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.nextButton,
            (!text.trim() && selectedTags.length === 0) && styles.disabledButton
          ]} 
          onPress={handleNext}
          disabled={!text.trim() && selectedTags.length === 0}
        >
          <Text style={styles.nextButtonText}>
            {text.trim() ? 'Analyze My Mood' : 'Continue'}
          </Text>
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
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    lineHeight: 22,
    marginBottom: Spacing.huge,
  },
  inputSection: {
    marginBottom: Spacing.huge,
  },
  textInput: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    minHeight: 120,
    ...Typography.paragraph,
    color: Colors.black,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
    ...Shadow.small,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightLavender,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  voiceButtonText: {
    ...Typography.secondary,
    color: Colors.lavender,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  tagsSection: {
    marginBottom: Spacing.huge,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.gray200,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
  },
  selectedTag: {
    backgroundColor: Colors.lavender,
  },
  tagText: {
    ...Typography.secondary,
    color: Colors.gray700,
  },
  selectedTagText: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  nextButton: {
    backgroundColor: Colors.lavender,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadow.medium,
  },
  disabledButton: {
    backgroundColor: Colors.gray400,
    opacity: 0.6,
  },
  nextButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
});