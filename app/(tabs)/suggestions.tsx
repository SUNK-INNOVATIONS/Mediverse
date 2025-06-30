import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function SuggestionsScreen() {
const handleSelectActivity = (id: string) => {
  switch (id) {
    case 'breathing':
      router.push('/(tabs)/breathingexcercise'); // ← your breathing exercise route
      break;
    case 'music':
      router.push('/(tabs)/music-player');
    //   break;
    case 'journal':
      router.push('/journal');
      break;
    case 'chat':
      router.push('/(tabs)/chat');
      break;
    default:
      break;
  }
};


  const suggestions = [
    { id: 'breathing', label: 'Try Breathing Exercise', icon: '🧘' },
    { id: 'music', label: 'Play Uplifting Music', icon: '🎵' },
    { id: 'journal', label: 'Write a Journal Entry', icon: '📓' },
    { id: 'chat', label: 'Chat with AI Companion', icon: '💬' },
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
        <Text style={styles.sectionTitle}>Here’s what might help 💡</Text>
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            style={styles.suggestionCard}
            onPress={() => handleSelectActivity(suggestion.id)}
          >
            <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
            <Text style={styles.suggestionLabel}>{suggestion.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.blobContainer}>
          {/* Replace with animated blob/emoji */}
          <Image source={require('@/assets/images/happy-emoji.png')} style={styles.blobImage} />
        </View>
        <Text style={styles.selectActivityText}>Select an activity</Text>
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
  },
  content: {
    flex: 1,
    paddingVertical: Spacing.lg,
  },
  suggestionCard: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.small,
  },
  suggestionIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  suggestionLabel: {
    ...Typography.paragraph,
    color: Colors.black,
  },
  blobContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  blobImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  selectActivityText: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
  },
});
