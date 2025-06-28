import React, { useState } from 'react';
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
import { ArrowLeft, X } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function ContextLoggingScreen() {
  const [text, setText] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

const handleNext = () => {
    router.push('/suggestions');
  };

  const toggleChip = (chip: string) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter((c) => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  const chips = ['Work', 'Family', 'Health', 'Loneliness', 'Sleep', 'Overthinking'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={{ ...styles.progressBarFill, width: '75%' }} />
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <X size={24} color={Colors.gray600} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>What’s been going on?</Text>
        <Text style={styles.descriptionText}>You can write freely or choose what’s affecting you.</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Write here..."
          value={text}
          onChangeText={setText}
          multiline
        />
        <View style={styles.chipsContainer}>
          {chips.map((chip) => (
            <TouchableOpacity
              key={chip}
              style={[
                styles.chip,
                selectedChips.includes(chip) && styles.selectedChip,
              ]}
              onPress={() => toggleChip(chip)}
            >
              <Text style={[
                styles.chipText,
                selectedChips.includes(chip) && styles.selectedChipText,
              ]}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
    marginBottom: Spacing.sm,
  },
  descriptionText: {
    ...Typography.paragraph,
    color: Colors.black,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  content: {
    flex: 1,
    paddingVertical: Spacing.lg,
  },
  inputBox: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
    ...Shadow.small,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  chip: {
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  selectedChip: {
    backgroundColor: Colors.purple,
  },
  chipText: {
    ...Typography.secondary,
    color: Colors.gray700,
  },
  selectedChipText: {
    ...Typography.secondary,
    color: Colors.white,
  },
  nextButton: {
    backgroundColor: Colors.purple,
    marginHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadow.medium,
  },
  nextButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
});
