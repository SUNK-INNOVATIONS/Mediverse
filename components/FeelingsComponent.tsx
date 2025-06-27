// components/FeelingGrid.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

const feelings = [
  'Fearful', 'Shocked', 'Phobic',
  'Misgiving', 'Worried', 'Alert',
  'Trepid', 'Dismal', 'Panicking',
];

export default function FeelingGrid({ onSelect }: { onSelect?: (feeling: string) => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {feelings.map((feeling, index) => (
          <TouchableOpacity
            key={index}
            style={styles.feelingButton}
            onPress={() => onSelect?.(feeling)}
          >
            <Text style={styles.feelingText}>{feeling}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.heading,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  feelingButton: {
    width: '30%',
    backgroundColor: Colors.gray100,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  feelingText: {
    ...Typography.small,
    color: Colors.black,
    textAlign: 'center',
  },
});
