import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  sentiment_score: number;
  mood_tags: string[];
  created_at: string;
  updated_at: string;
}

interface Props {
  entry?: JournalEntry;
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
}

const JournalEntryComponent: React.FC<Props> = ({ entry, onSave, onCancel }) => {
  const [title, setTitle] = useState(entry ? entry.title : '');
  const [content, setContent] = useState(entry ? entry.content : '');

  const handleSave = () => {
    // Basic validation
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Both title and content are required.');
      return;
    }

    // Simple sentiment analysis based on keywords
    const positiveWords = ['happy', 'good', 'great', 'amazing', 'wonderful', 'excited', 'grateful', 'love', 'joy'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'anxious', 'worried', 'stressed', 'terrible', 'hate', 'fear'];
    
    const lowerContent = content.toLowerCase();
    let sentimentScore = 0;
    
    positiveWords.forEach(word => {
      if (lowerContent.includes(word)) sentimentScore += 1;
    });
    
    negativeWords.forEach(word => {
      if (lowerContent.includes(word)) sentimentScore -= 1;
    });

    const newEntry: JournalEntry = {
      id: entry ? entry.id : Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      sentiment_score: sentimentScore,
      mood_tags: entry ? entry.mood_tags : [],
      created_at: entry ? entry.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    onSave(newEntry);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter journal entry title..."
        placeholderTextColor={Colors.gray500}
      />
      
      <Text style={styles.label}>Content</Text>
      <TextInput
        style={styles.contentInput}
        value={content}
        onChangeText={setContent}
        placeholder="Write your journal entry here..."
        placeholderTextColor={Colors.gray500}
        multiline
        textAlignVertical="top"
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    margin: Spacing.lg,
    ...Shadow.medium,
  },
  label: {
    ...Typography.secondary,
    color: Colors.gray700,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  titleInput: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
    ...Typography.paragraph,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  contentInput: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 150,
    ...Typography.paragraph,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.gray200,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.secondary,
    color: Colors.gray700,
    fontFamily: 'Poppins-SemiBold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.lavender,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    ...Typography.secondary,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default JournalEntryComponent;