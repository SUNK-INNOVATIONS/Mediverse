import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import JournalEntry from '../types/JournalEntry';
import JournalEntryComponent from '../components/JournalEntryComponent';
import { supabase } from '../supabase';

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = async (newEntry: JournalEntry) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([newEntry]);

    if (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry.');
    } else {
      setEntries([...entries, newEntry]);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  const getSentimentLabel = (score: number): string => {
    if (score > 0) {
      return 'Positive';
    } else if (score < 0) {
      return 'Negative';
    } else {
      return 'Neutral';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Journal</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => setIsCreating(true)}>
        <Text style={styles.addButtonText}>Add New Entry</Text>
      </TouchableOpacity>
      {isCreating && (
        <JournalEntryComponent onSave={handleSave} onCancel={handleCancel} />
      )}
      {entries.map((entry) => (
        <View key={entry.id} style={styles.entryContainer}>
          <Text style={styles.entryHeader}>{entry.date} - {getSentimentLabel(entry.sentimentScore)}</Text>
          <Text style={styles.entryText}>{entry.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  entryContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  entryHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  entryText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Journal;