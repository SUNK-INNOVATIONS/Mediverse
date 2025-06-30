import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { PlusCircle, Search, Tag, TextCursorInput, X } from 'lucide-react-native';
// Removed: import { LinearGradient } from 'expo-linear-gradient';
import { BorderRadius, Colors, Shadow, Spacing, Typography } from '@/constants/theme';

interface JournalEntry {
  id: string;
  text: string;
  mood: string;
  sentimentScore: number;
}

const moods = ['Happy', 'Sad', 'Excited', 'Angry', 'Calm', 'Anxious'];

const initialJournalEntries: JournalEntry[] = [];

const getSentimentColor = (score: number) => {
  if (score > 20) return Colors.green;
  if (score < -20) return '#EF4444';
  return '#EF4444'; // red-500 hex
};

const getSentimentLabel = (score: number) => {
  if (score > 20) return 'Positive';
  if (score < -20) return 'Negative';
  return 'Neutral';
};

const JournalScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>(initialJournalEntries);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', 'YOUR_USER_ID'); // Replace 'YOUR_USER_ID' with the actual user ID

      if (error) {
        console.error('Error fetching journal entries:', error);
      } else {
        const formattedEntries = data.map(entry => ({
          id: entry.id,
          text: entry.content,
          mood: entry.mood_tags ? entry.mood_tags[0] : '', // Assuming only one mood tag
          sentimentScore: entry.sentiment_score,
        }));
        setJournalEntries(formattedEntries);
        setFilteredEntries(formattedEntries);
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = journalEntries.filter((entry) =>
      entry.text.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEntries(filtered);
  };

  const openModal = (entry?: JournalEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setNewEntry(entry.text);
      setSelectedMood(entry.mood);
    } else {
      setEditingEntry(null);
      setNewEntry('');
      setSelectedMood('');
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewEntry('');
    setSelectedMood('');
    setEditingEntry(null);
  };

  const saveEntry = async () => {
    try {
      if (editingEntry) {
        // Update existing entry
        const { data, error } = await supabase
          .from('journal_entries')
          .update({ content: newEntry, mood_tags: [selectedMood] })
          .eq('id', editingEntry.id)
          .select();

        if (error) {
          console.error('Error updating journal entry:', error);
        } else {
          const updatedEntries = journalEntries.map(entry =>
            entry.id === editingEntry.id
              ? { ...entry, text: newEntry, mood: selectedMood }
              : entry
          );
          setJournalEntries(updatedEntries);
          setFilteredEntries(updatedEntries);
        }
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('journal_entries')
          .insert([{ user_id: 'YOUR_USER_ID', content: newEntry, mood_tags: [selectedMood] }]) // Replace 'YOUR_USER_ID' with the actual user ID
          .select();

        if (error) {
          console.error('Error creating journal entry:', error);
        } else {
          const newEntry = data[0];
          const newJournalEntry = {
            id: newEntry.id,
            text: newEntry.content,
            mood: selectedMood,
            sentimentScore: newEntry.sentiment_score || 0,
          };
          const updatedEntries = [newJournalEntry, ...journalEntries];
          setJournalEntries(updatedEntries);
          setFilteredEntries(updatedEntries);
        }
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      closeModal();
    }
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => (
    <TouchableOpacity
      style={styles.entryCard}
      onPress={() => openModal(item)}
      activeOpacity={0.85}
    >
      {/* Replaced LinearGradient with View and added backgroundColor */}
      <View style={styles.gradientCard}>
        <Text style={styles.entryText} numberOfLines={3}>{item.text}</Text>
        <View style={styles.entryFooter}>
          <View style={[styles.sentimentBadge, { backgroundColor: getSentimentColor(item.sentimentScore) }]}>
            <Text style={styles.sentimentText}>
              {getSentimentLabel(item.sentimentScore)}
            </Text>
          </View>
          <View style={styles.moodTag}>
            <Text style={styles.moodText}>{item.mood}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Replaced LinearGradient with View and added backgroundColor */}
      <View style={styles.headerGradient}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>My Journal</Text>
          <TouchableOpacity onPress={() => openModal()} style={styles.headerIcon}>
            <PlusCircle size={28} color={Colors.purple} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.gray500} style={styles.searchIcon} />
          <TextInput
            placeholder="Search journal..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={Colors.gray400}
          />
        </View>
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        contentContainerStyle={styles.entryList}
        ListEmptyComponent={<Text style={styles.emptyText}>No entries found.</Text>}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <X size={22} color={Colors.gray500} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editingEntry ? 'Edit Entry' : 'New Entry'}</Text>
            <TextInput
              placeholder="Write your thoughts..."
              multiline
              style={styles.modalInput}
              value={newEntry}
              onChangeText={setNewEntry}
              placeholderTextColor={Colors.gray400}
              maxLength={500}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
              {moods.map((mood) => (
                <Pressable
                  key={mood}
                  onPress={() => setSelectedMood(mood)}
                  style={[
                    styles.moodOption,
                    selectedMood === mood && styles.selectedMood,
                  ]}
                >
                  <Text style={styles.moodOptionText}>{mood}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!newEntry.trim() || !selectedMood) && styles.saveButtonDisabled,
              ]}
              onPress={saveEntry}
              disabled={!newEntry.trim() || !selectedMood}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <View style={styles.modalFooter}>
              <View style={styles.tipRow}>
                <Tag size={18} color={Colors.purple} />
                <Text style={styles.tipText}> Tip: Tag your mood to track emotional trends over time.</Text>
              </View>
              <View style={styles.tipRow}>
                <TextCursorInput size={18} color={Colors.purple} />
                <Text style={styles.tipText}> You can edit or delete entries anytime.</Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default JournalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerGradient: {
    // Replaced gradient with solid color
    // backgroundColor: '#E0E7FF',
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: 28,
    letterSpacing: 0.5,
  },
  headerIcon: {
    padding: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 100,
    ...Shadow.small,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadow.small,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  entryList: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.sm,
  },
  entryCard: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadow.small,
  },
  gradientCard: {
    // Replaced gradient with solid color
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    backgroundColor: '#F3E8FF',
  },
  entryText: {
    ...Typography.paragraph,
    color: Colors.black,
    marginBottom: Spacing.md,
    fontSize: 16,
    lineHeight: 22,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sentimentBadge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minWidth: 70,
    alignItems: 'center',
  },
  sentimentText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  moodTag: {
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  moodText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.gray400,
    marginTop: Spacing.xxl,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '92%',
    ...Shadow.medium,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    zIndex: 2,
    padding: Spacing.xs,
  },
  modalTitle: {
    ...Typography.heading,
    color: Colors.purple,
    marginBottom: Spacing.md,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.purple,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
    minHeight: 80,
    marginBottom: Spacing.md,
    color: Colors.black,
    backgroundColor: Colors.gray500,
  },
  moodScroll: {
    marginBottom: Spacing.md,
    minHeight: 48,
  },
  moodOption: {
    backgroundColor: '#F3E8FF',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMood: {
    borderColor: Colors.purple,
    backgroundColor: '#E0E7FF',
  },
  moodOptionText: {
    color: Colors.purple,
    fontWeight: 'bold',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.gray300,
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalFooter: {
    marginTop: Spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  tipText: {
    color: Colors.purple,
    fontSize: 13,
    marginLeft: Spacing.xs,
  },
});
