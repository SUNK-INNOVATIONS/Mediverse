import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { router } from 'expo-router';

const Reaction = () => {

  const handleNext = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>Back</Text>
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFill} />
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>

      {/* Title and Question */}
      <Text style={styles.title}>Reaction & body feelings</Text>
      <Text style={styles.question}>What did you feel in your body? How did you react?</Text>

      {/* Text Input */}
      <TextInput
        style={styles.textInput}
        placeholder="Example: My hands started shaking and sweating, I went to the bathroom."
        multiline
        textAlignVertical="top"
      />

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.lg,
  },
  progressBarFill: {
    width: '75%',
    height: '100%',
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.sm,
  },
  title: {
    ...Typography.title,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  question: {
    ...Typography.heading,
    textAlign: 'left',
    marginBottom: Spacing.md,
  },
  textInput: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    fontSize: Typography.paragraph.fontSize,
    fontFamily: Typography.paragraph.fontFamily,
    color: Colors.gray700,
    height: 200,
    textAlignVertical: 'top',
  },
  nextButton: {
    backgroundColor: Colors.purple,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadow.medium,
  },
  nextButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
});

export default Reaction;
