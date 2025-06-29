import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plus, BookOpen, Calendar, Heart, Search } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { supabase } from '@/supabase';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  sentiment_score: number;
  mood_tags: string[];
  created_at: string;
  updated_at: string;
}

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood_tags: [] as string[],
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading journal entries:', error);
        Alert.alert('Error', 'Failed to load journal entries');
      } else {
        setEntries(data || []);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
      Alert.alert('Error', 'Failed to load journal entries');
    }
  };

  const handleSave = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    try {
      // Simple sentiment analysis based on keywords
      const positiveWords = ['happy', 'good', 'great', 'amazing', 'wonderful', 'excited', 'grateful', 'love', 'joy'];
      const negativeWords = ['sad', 'angry', 'frustrated', 'anxious', 'worried', 'stressed', 'terrible', 'hate', 'fear'];
      
      const content = newEntry.content.toLowerCase();
      let sentimentScore = 0;
      
      positiveWords.forEach(word => {
        if (content.includes(word)) sentimentScore += 1;
      });
      
      negativeWords.forEach(word => {
        if (content.includes(word)) sentimentScore -= 1;
      });

      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{
          title: newEntry.title,
          content: newEntry.content,
          sentiment_score: sentimentScore,
          mood_tags: newEntry.mood_tags,
          user_id: 'temp-user-id', // In a real app, this would be the authenticated user's ID
        }])
        .select();

      if (error) {
        console.error('Error saving journal entry:', error);
        Alert.alert('Error', 'Failed to save journal entry');
      } else {
        setEntries([data[0], ...entries]);
        setIsCreating(false);
        setNewEntry({ title: '', content: '', mood_tags: [] });
        Alert.alert('Success', 'Journal entry saved successfully');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setNewEntry({ title: '', content: '', mood_tags: [] });
  };

  const getSentimentLabel = (score: number): string => {
    if (score > 0) return 'Positive';
    if (score < 0) return 'Negative';
    return 'Neutral';
  };

  const getSentimentColor = (score: number): string => {
    if (score > 0) return Colors.green;
    if (score < 0) return Colors.pink;
    return Colors.yellow;
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isCreating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <ArrowLeft size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Entry</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.titleInput}
              value={newEntry.title}
              onChangeText={(text) => setNewEntry({ ...newEntry, title: text })}
              placeholder="Give your entry a title..."
              placeholderTextColor={Colors.gray500}
            />

            <Text style={styles.inputLabel}>How are you feeling?</Text>
            <TextInput
              style={styles.contentInput}
              value={newEntry.content}
              onChangeText={(text) => setNewEntry({ ...newEntry, content: text })}
              placeholder="Write about your thoughts, feelings, or experiences..."
              placeholderTextColor={Colors.gray500}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Journal</Text>
        <TouchableOpacity onPress={() => setIsCreating(true)}>
          <Plus size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray500} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search your entries..."
            placeholderTextColor={Colors.gray500}
          />
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <BookOpen size={24} color={Colors.lavender} />
            <Text style={styles.statNumber}>{entries.length}</Text>
            <Text style={styles.statLabel}>Total Entries</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Heart size={24} color={Colors.pink} />
            <Text style={styles.statNumber}>
              {entries.filter(e => e.sentiment_score > 0).length}
            </Text>
            <Text style={styles.statLabel}>Positive Days</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Calendar size={24} color={Colors.green} />
            <Text style={styles.statNumber}>
              {entries.length > 0 ? Math.ceil((Date.now() - new Date(entries[entries.length - 1].created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
            </Text>
            <Text style={styles.statLabel}>Days Since First</Text>
          </View>
        </View>

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen size={64} color={Colors.gray400} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No matching entries' : 'Start Your Journal'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Begin documenting your thoughts and feelings. Your first entry is just a tap away.'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity style={styles.createButton} onPress={() => setIsCreating(true)}>
                <Text style={styles.createButtonText}>Create First Entry</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredEntries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <View style={[
                  styles.sentimentBadge,
                  { backgroundColor: getSentimentColor(entry.sentiment_score) + '20' }
                ]}>
                  <Text style={[
                    styles.sentimentText,
                    { color: getSentimentColor(entry.sentiment_score) }
                  ]}>
                    {getSentimentLabel(entry.sentiment_score)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.entryContent} numberOfLines={3}>
                {entry.content}
              </Text>
              
              <View style={styles.entryFooter}>
                <Text style={styles.entryDate}>{formatDate(entry.created_at)}</Text>
                {entry.mood_tags && entry.mood_tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {entry.mood_tags.slice(0, 2).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                    {entry.mood_tags.length > 2 && (
                      <Text style={styles.moreTagsText}>+{entry.mood_tags.length - 2}</Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.black,
  },
  saveButton: {
    ...Typography.paragraph,
    color: Colors.lavender,
    fontFamily: 'Poppins-SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.md,
    ...Typography.paragraph,
    color: Colors.black,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.title,
    color: Colors.black,
    fontFamily: 'Poppins-Bold',
    marginTop: Spacing.sm,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.gray600,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray200,
    marginHorizontal: Spacing.lg,
  },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.huge,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  emptyTitle: {
    ...Typography.subtitle,
    color: Colors.black,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  createButton: {
    backgroundColor: Colors.lavender,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  createButtonText: {
    ...Typography.secondary,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
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
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  entryTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
    marginRight: Spacing.md,
  },
  sentimentBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  sentimentText: {
    ...Typography.small,
    fontFamily: 'Poppins-SemiBold',
  },
  entryContent: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryDate: {
    ...Typography.small,
    color: Colors.gray500,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.xs,
  },
  tagText: {
    ...Typography.small,
    color: Colors.gray600,
  },
  moreTagsText: {
    ...Typography.small,
    color: Colors.gray500,
    marginLeft: Spacing.xs,
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    ...Shadow.small,
  },
  inputLabel: {
    ...Typography.secondary,
    color: Colors.gray700,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  titleInput: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
    ...Typography.paragraph,
    color: Colors.black,
  },
  contentInput: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 200,
    ...Typography.paragraph,
    color: Colors.black,
  },
});