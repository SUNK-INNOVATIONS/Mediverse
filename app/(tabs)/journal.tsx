import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plus, 
  BookOpen, 
  Calendar, 
  Heart, 
  Edit3, 
  Trash2, 
  Save,
  X,
  Search
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useJournalData } from '@/hooks/useJournalData';
import { createJournalEntry, updateJournalEntry, deleteJournalEntry } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import Sentiment from 'sentiment';

type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];

export default function JournalScreen() {
  const { user } = useAuth();
  const { journalEntries, loading, refreshJournalData } = useJournalData();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sentiment = new Sentiment();

  const filteredEntries = journalEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateEntry = async () => {
    if (!user || !newEntry.content.trim()) {
      Alert.alert('Error', 'Please write something in your journal entry');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const sentimentResult = sentiment.analyze(newEntry.content);
      const moodTags = extractMoodTags(newEntry.content);
      
      const { data, error } = await createJournalEntry({
        user_id: user.id,
        title: newEntry.title.trim() || 'Untitled Entry',
        content: newEntry.content.trim(),
        sentiment_score: Math.max(-100, Math.min(100, sentimentResult.score * 10)),
        mood_tags: moodTags,
      });

      if (error) throw error;

      setNewEntry({ title: '', content: '' });
      setShowCreateModal(false);
      refreshJournalData();
      Alert.alert('Success', 'Journal entry created successfully!');
    } catch (error) {
      console.error('Error creating journal entry:', error);
      Alert.alert('Error', 'Failed to create journal entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEntry = async () => {
    if (!editingEntry || !newEntry.content.trim()) {
      Alert.alert('Error', 'Please write something in your journal entry');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const sentimentResult = sentiment.analyze(newEntry.content);
      const moodTags = extractMoodTags(newEntry.content);
      
      const { data, error } = await updateJournalEntry(editingEntry.id, {
        title: newEntry.title.trim() || 'Untitled Entry',
        content: newEntry.content.trim(),
        sentiment_score: Math.max(-100, Math.min(100, sentimentResult.score * 10)),
        mood_tags: moodTags,
      });

      if (error) throw error;

      setNewEntry({ title: '', content: '' });
      setEditingEntry(null);
      refreshJournalData();
      Alert.alert('Success', 'Journal entry updated successfully!');
    } catch (error) {
      console.error('Error updating journal entry:', error);
      Alert.alert('Error', 'Failed to update journal entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = (entry: JournalEntry) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await deleteJournalEntry(entry.id);
              if (error) throw error;
              
              refreshJournalData();
              Alert.alert('Success', 'Journal entry deleted successfully');
            } catch (error) {
              console.error('Error deleting journal entry:', error);
              Alert.alert('Error', 'Failed to delete journal entry');
            }
          },
        },
      ]
    );
  };

  const extractMoodTags = (content: string): string[] => {
    const moodWords = [
      'happy', 'sad', 'angry', 'excited', 'anxious', 'calm', 'stressed',
      'grateful', 'frustrated', 'content', 'worried', 'joyful', 'peaceful',
      'overwhelmed', 'hopeful', 'lonely', 'confident', 'tired', 'energetic'
    ];
    
    const words = content.toLowerCase().split(/\s+/);
    return moodWords.filter(mood => words.includes(mood));
  };

  const getSentimentColor = (score: number) => {
    if (score > 20) return Colors.green;
    if (score < -20) return Colors.pink;
    return Colors.yellow;
  };

  const getSentimentLabel = (score: number) => {
    if (score > 20) return 'Positive';
    if (score < -20) return 'Negative';
    return 'Neutral';
  };

  const openEditModal = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewEntry({ title: entry.title, content: entry.content });
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingEntry(null);
    setNewEntry({ title: '', content: '' });
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Please log in to access your journal</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={Colors.gradientBlue}
              style={styles.headerIcon}
            >
              <BookOpen size={24} color={Colors.white} />
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>My Journal</Text>
              <Text style={styles.headerSubtitle}>
                {journalEntries.length} {journalEntries.length === 1 ? 'entry' : 'entries'}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => setShowCreateModal(true)}
            style={styles.addButton}
          >
            <LinearGradient
              colors={Colors.gradientPurple}
              style={styles.addButtonGradient}
            >
              <Plus size={20} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.gray500} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your entries..."
              placeholderTextColor={Colors.gray500}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Journal Entries */}
        <ScrollView 
          style={styles.entriesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.entriesContent}
        >
          {loading ? (
            <View style={styles.centerContainer}>
              <Text style={styles.loadingText}>Loading your journal...</Text>
            </View>
          ) : filteredEntries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <BookOpen size={64} color={Colors.gray400} />
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No entries found' : 'Start Your Journal'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Write your first entry to begin your mental wellness journey'
                }
              </Text>
              {!searchQuery && (
                <TouchableOpacity 
                  onPress={() => setShowCreateModal(true)}
                  style={styles.emptyButton}
                >
                  <LinearGradient
                    colors={Colors.gradientPurple}
                    style={styles.emptyButtonGradient}
                  >
                    <Text style={styles.emptyButtonText}>Write First Entry</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredEntries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryMeta}>
                    <Calendar size={16} color={Colors.gray500} />
                    <Text style={styles.entryDate}>
                      {new Date(entry.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  <View style={styles.entryActions}>
                    <View style={[
                      styles.sentimentBadge,
                      { backgroundColor: getSentimentColor(entry.sentiment_score) + '20' }
                    ]}>
                      <Heart 
                        size={12} 
                        color={getSentimentColor(entry.sentiment_score)} 
                      />
                      <Text style={[
                        styles.sentimentText,
                        { color: getSentimentColor(entry.sentiment_score) }
                      ]}>
                        {getSentimentLabel(entry.sentiment_score)}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => openEditModal(entry)}
                      style={styles.actionButton}
                    >
                      <Edit3 size={16} color={Colors.gray600} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDeleteEntry(entry)}
                      style={styles.actionButton}
                    >
                      <Trash2 size={16} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryContent} numberOfLines={3}>
                  {entry.content}
                </Text>
                
                {entry.mood_tags && entry.mood_tags.length > 0 && (
                  <View style={styles.moodTags}>
                    {entry.mood_tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.moodTag}>
                        <Text style={styles.moodTagText}>{tag}</Text>
                      </View>
                    ))}
                    {entry.mood_tags.length > 3 && (
                      <Text style={styles.moreTagsText}>
                        +{entry.mood_tags.length - 3} more
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>

        {/* Create/Edit Modal */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModal}>
                <X size={24} color={Colors.gray600} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingEntry ? 'Edit Entry' : 'New Entry'}
              </Text>
              <TouchableOpacity 
                onPress={editingEntry ? handleUpdateEntry : handleCreateEntry}
                disabled={isSubmitting}
                style={[styles.saveButton, isSubmitting && styles.disabledButton]}
              >
                <Save size={20} color={isSubmitting ? Colors.gray400 : Colors.purple} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <TextInput
                style={styles.titleInput}
                placeholder="Entry title (optional)"
                placeholderTextColor={Colors.gray500}
                value={newEntry.title}
                onChangeText={(text) => setNewEntry(prev => ({ ...prev, title: text }))}
              />
              
              <TextInput
                style={styles.contentInput}
                placeholder="What's on your mind today?"
                placeholderTextColor={Colors.gray500}
                value={newEntry.content}
                onChangeText={(text) => setNewEntry(prev => ({ ...prev, content: text }))}
                multiline
                textAlignVertical="top"
              />
              
              <View style={styles.modalFooter}>
                <Text style={styles.tipText}>
                  💡 Tip: Write freely about your thoughts, feelings, and experiences. 
                  Your entries are private and secure.
                </Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.paragraph,
    color: Colors.error,
  },
  loadingText: {
    ...Typography.paragraph,
    color: Colors.gray600,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    ...Shadow.small,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.black,
  },
  headerSubtitle: {
    ...Typography.small,
    color: Colors.gray600,
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButtonGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.md,
    ...Typography.paragraph,
    color: Colors.black,
  },
  entriesContainer: {
    flex: 1,
  },
  entriesContent: {
    padding: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  emptyButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  entryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryDate: {
    ...Typography.small,
    color: Colors.gray600,
    marginLeft: Spacing.sm,
  },
  entryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sentimentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  sentimentText: {
    ...Typography.caption,
    fontFamily: 'Inter-Bold',
  },
  actionButton: {
    padding: 4,
  },
  entryTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginBottom: Spacing.sm,
  },
  entryContent: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  moodTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  moodTag: {
    backgroundColor: Colors.purple + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  moodTagText: {
    ...Typography.caption,
    color: Colors.purple,
    fontFamily: 'Inter-Bold',
  },
  moreTagsText: {
    ...Typography.caption,
    color: Colors.gray500,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalTitle: {
    ...Typography.heading,
    color: Colors.black,
  },
  saveButton: {
    padding: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.xl,
  },
  titleInput: {
    ...Typography.paragraph,
    color: Colors.black,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
  },
  contentInput: {
    ...Typography.paragraph,
    color: Colors.black,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    minHeight: 200,
    marginBottom: Spacing.xl,
  },
  modalFooter: {
    backgroundColor: Colors.blue + '10',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.blue,
  },
  tipText: {
    ...Typography.small,
    color: Colors.gray700,
    lineHeight: 18,
  },
});