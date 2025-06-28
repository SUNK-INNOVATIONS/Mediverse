import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import JournalEntry from '../types/JournalEntry';
import Sentiment from 'sentiment';

interface Props {
  entry?: JournalEntry;
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
}

const JournalEntryComponent: React.FC<Props> = ({ entry, onSave, onCancel }) => {
  const [text, setText] = useState(entry ? entry.text : '');

  const handleSave = () => {
    // Basic validation
    if (!text.trim()) {
      Alert.alert('Validation Error', 'Journal entry cannot be empty.');
      return;
    }

    const sentiment = new Sentiment();
    const result = sentiment.analyze(text);

    const newEntry: JournalEntry = {
      id: entry ? entry.id : Date.now().toString(), // Generate a unique ID
      date: new Date().toLocaleDateString(),
      text: text,
      sentimentScore: result.score, // Will be updated later
    };
    onSave(newEntry);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        placeholder="Write your journal entry here..."
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 120,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JournalEntryComponent;