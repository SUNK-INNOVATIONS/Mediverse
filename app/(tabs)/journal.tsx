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
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  FadeIn,
  SlideInRight,
  SlideInUp
} from 'react-native-reanimated';
import { 
  Plus, 
  BookOpen, 
  Calendar, 
  Heart, 
  Edit3, 
  Trash2, 
  Save,
  X,
  Search,
  Feather,
  Coffee,
  Sun,
  Moon,
  Cloud,
  Sparkles
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useJournalData } from '@/hooks/useJournalData';
import { createJournalEntry, updateJournalEntry, deleteJournalEntry } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import Sentiment from 'sentiment';

type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Journal paper texture and styling constants
const PAPER_COLOR = '#FDF6E3'; // Warm cream paper
const INK_COLOR = '#2C3E50'; // Dark blue-black ink
const MARGIN_COLOR = '#E8B4B8'; // Soft pink margin line
const RULED_LINE_COLOR = '#E8D5C4'; // Light brown ruled lines

export default function JournalScreen() {
  const { user } = useAuth();
  const { journalEntries, loading, refreshJournalData } = useJournalData();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('');

  const sentiment = new Sentiment();

  // Animation values
  const pageFlip = useSharedValue(0);
  const inkFlow = useSharedValue(0);

  const filteredEntries = journalEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const moodEmojis = [
    { emoji: '☀️', mood: 'sunny', label: 'Sunny' },
    { emoji: '🌙', mood: 'peaceful', label: 'Peaceful' },
    { emoji: '☁️', mood: 'cloudy', label: 'Cloudy' },
    { emoji: '⭐', mood: 'inspired', label: 'Inspired' },
    { emoji: '🌸', mood: 'grateful', label: 'Grateful' },
    { emoji: '🍃', mood: 'calm', label: 'Calm' },
  ];

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
        title: newEntry.title.trim() || getDateTitle(),
        content: newEntry.content.trim(),
        sentiment_score: Math.max(-100, Math.min(100, sentimentResult.score * 10)),
        mood_tags: [...moodTags, selectedMood].filter(Boolean),
      });

      if (error) throw error;

      setNewEntry({ title: '', content: '' });
      setSelectedMood('');
      setShowCreateModal(false);
      refreshJournalData();
      
      // Animate page flip
      pageFlip.value = withSpring(1, { damping: 15 });
      setTimeout(() => {
        pageFlip.value = withSpring(0, { damping: 15 });
      }, 1000);
      
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
        title: newEntry.title.trim() || getDateTitle(),
        content: newEntry.content.trim(),
        sentiment_score: Math.max(-100, Math.min(100, sentimentResult.score * 10)),
        mood_tags: [...moodTags, selectedMood].filter(Boolean),
      });

      if (error) throw error;

      setNewEntry({ title: '', content: '' });
      setSelectedMood('');
      setEditingEntry(null);
      refreshJournalData();
      
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
    if (score > 20) return '#8FBC8F'; // Sage green
    if (score < -20) return '#CD5C5C'; // Indian red
    return '#DEB887'; // Burlywood
  };

  const getSentimentLabel = (score: number) => {
    if (score > 20) return 'Positive';
    if (score < -20) return 'Challenging';
    return 'Reflective';
  };

  const getDateTitle = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const openEditModal = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewEntry({ title: entry.title, content: entry.content });
    setSelectedMood(entry.mood_tags?.[0] || '');
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingEntry(null);
    setNewEntry({ title: '', content: '' });
    setSelectedMood('');
  };

  const pageFlipStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotateY: `${interpolate(pageFlip.value, [0, 1], [0, 180])}deg`
      }
    ],
  }));

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
      {/* Vintage paper background */}
      <LinearGradient
        colors={[PAPER_COLOR, '#F5E6D3']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Journal Header - Like a book cover */}
        <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
          <View style={styles.bookCover}>
            <LinearGradient
              colors={['#8B4513', '#A0522D', '#CD853F']}
              style={styles.coverGradient}
            >
              <View style={styles.coverContent}>
                <Feather size={32} color="#F5DEB3" />
                <Text style={styles.journalTitle}>My Journal</Text>
                <Text style={styles.journalSubtitle}>
                  {journalEntries.length} {journalEntries.length === 1 ? 'entry' : 'entries'}
                </Text>
              </View>
              
              {/* Decorative corner elements */}
              <View style={styles.cornerDecoration}>
                <View style={styles.cornerLine} />
                <View style={[styles.cornerLine, styles.cornerLineVertical]} />
              </View>
            </LinearGradient>
          </View>
          
          <TouchableOpacity 
            onPress={() => setShowCreateModal(true)}
            style={styles.quillButton}
          >
            <LinearGradient
              colors={['#8B4513', '#A0522D']}
              style={styles.quillGradient}
            >
              <Feather size={20} color="#F5DEB3" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Search Bar - Like a bookmark */}
        <Animated.View entering={SlideInUp.delay(400)} style={styles.searchContainer}>
          <View style={styles.bookmark}>
            <View style={styles.searchBar}>
              <Search size={18} color="#8B4513" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search your thoughts..."
                placeholderTextColor="#A0522D"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </Animated.View>

        {/* Journal Pages */}
        <ScrollView 
          style={styles.pagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pagesContent}
        >
          {loading ? (
            <View style={styles.centerContainer}>
              <Coffee size={48} color="#8B4513" />
              <Text style={styles.loadingText}>Brewing your thoughts...</Text>
            </View>
          ) : filteredEntries.length === 0 ? (
            <Animated.View entering={FadeIn.delay(600)} style={styles.emptyPage}>
              <View style={styles.paperSheet}>
                {/* Ruled lines */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <View key={i} style={styles.ruledLine} />
                ))}
                
                {/* Margin line */}
                <View style={styles.marginLine} />
                
                <View style={styles.emptyContent}>
                  <BookOpen size={64} color="#A0522D" />
                  <Text style={styles.emptyTitle}>
                    {searchQuery ? 'No entries found' : 'Your First Page Awaits'}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {searchQuery 
                      ? 'Try different search terms'
                      : 'Every great story begins with a single word'
                    }
                  </Text>
                  {!searchQuery && (
                    <TouchableOpacity 
                      onPress={() => setShowCreateModal(true)}
                      style={styles.startWritingButton}
                    >
                      <Text style={styles.startWritingText}>Start Writing</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Animated.View>
          ) : (
            filteredEntries.map((entry, index) => (
              <Animated.View 
                key={entry.id} 
                entering={SlideInRight.delay(index * 100)}
                style={styles.journalPage}
              >
                <View style={styles.paperSheet}>
                  {/* Ruled lines background */}
                  {Array.from({ length: 25 }).map((_, i) => (
                    <View key={i} style={[styles.ruledLine, { top: 60 + i * 24 }]} />
                  ))}
                  
                  {/* Margin line */}
                  <View style={styles.marginLine} />
                  
                  {/* Page content */}
                  <View style={styles.pageContent}>
                    {/* Date header */}
                    <View style={styles.dateHeader}>
                      <Calendar size={16} color="#8B4513" />
                      <Text style={styles.entryDate}>
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Text>
                      
                      <View style={styles.entryActions}>
                        <View style={[
                          styles.sentimentDot,
                          { backgroundColor: getSentimentColor(entry.sentiment_score) }
                        ]} />
                        <TouchableOpacity 
                          onPress={() => openEditModal(entry)}
                          style={styles.actionButton}
                        >
                          <Edit3 size={14} color="#8B4513" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => handleDeleteEntry(entry)}
                          style={styles.actionButton}
                        >
                          <Trash2 size={14} color="#CD5C5C" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/* Entry title */}
                    <Text style={styles.entryTitle}>{entry.title}</Text>
                    
                    {/* Entry content */}
                    <Text style={styles.entryContent}>{entry.content}</Text>
                    
                    {/* Mood tags */}
                    {entry.mood_tags && entry.mood_tags.length > 0 && (
                      <View style={styles.moodTags}>
                        {entry.mood_tags.slice(0, 3).map((tag, tagIndex) => (
                          <View key={tagIndex} style={styles.moodTag}>
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
                    
                    {/* Sentiment indicator */}
                    <View style={styles.sentimentIndicator}>
                      <Heart 
                        size={12} 
                        color={getSentimentColor(entry.sentiment_score)} 
                        fill={getSentimentColor(entry.sentiment_score)}
                      />
                      <Text style={[
                        styles.sentimentText,
                        { color: getSentimentColor(entry.sentiment_score) }
                      ]}>
                        {getSentimentLabel(entry.sentiment_score)}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Page corner fold effect */}
                  <View style={styles.pageFold} />
                </View>
              </Animated.View>
            ))
          )}
        </ScrollView>

        {/* Writing Modal - Like opening a fresh page */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={[PAPER_COLOR, '#F5E6D3']}
              style={StyleSheet.absoluteFill}
            />
            
            <SafeAreaView style={styles.modalSafeArea}>
              {/* Modal header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <X size={24} color="#8B4513" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {editingEntry ? 'Edit Entry' : 'New Page'}
                </Text>
                <TouchableOpacity 
                  onPress={editingEntry ? handleUpdateEntry : handleCreateEntry}
                  disabled={isSubmitting}
                  style={[styles.saveButton, isSubmitting && styles.disabledButton]}
                >
                  <Save size={20} color={isSubmitting ? "#A0522D" : "#8B4513"} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalContent}>
                <View style={styles.writingPaper}>
                  {/* Ruled lines for writing */}
                  {Array.from({ length: 30 }).map((_, i) => (
                    <View key={i} style={[styles.writingLine, { top: 80 + i * 28 }]} />
                  ))}
                  
                  {/* Margin line */}
                  <View style={styles.writingMargin} />
                  
                  {/* Date */}
                  <Text style={styles.writingDate}>{getDateTitle()}</Text>
                  
                  {/* Title input */}
                  <TextInput
                    style={styles.titleInput}
                    placeholder="Dear Diary..."
                    placeholderTextColor="#A0522D"
                    value={newEntry.title}
                    onChangeText={(text) => setNewEntry(prev => ({ ...prev, title: text }))}
                  />
                  
                  {/* Mood selector */}
                  <View style={styles.moodSelector}>
                    <Text style={styles.moodLabel}>Today I feel:</Text>
                    <View style={styles.moodOptions}>
                      {moodEmojis.map((mood, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.moodOption,
                            selectedMood === mood.mood && styles.selectedMoodOption
                          ]}
                          onPress={() => setSelectedMood(mood.mood)}
                        >
                          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                          <Text style={styles.moodOptionLabel}>{mood.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  
                  {/* Content input */}
                  <TextInput
                    style={styles.contentInput}
                    placeholder="What's on your mind today?"
                    placeholderTextColor="#A0522D"
                    value={newEntry.content}
                    onChangeText={(text) => setNewEntry(prev => ({ ...prev, content: text }))}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
                
                {/* Writing tip */}
                <View style={styles.writingTip}>
                  <Sparkles size={16} color="#8B4513" />
                  <Text style={styles.tipText}>
                    Write freely - your thoughts are safe here. Let your emotions flow onto the page.
                  </Text>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
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
    color: '#CD5C5C',
    fontFamily: 'Inter-Medium',
  },
  loadingText: {
    ...Typography.paragraph,
    color: '#8B4513',
    marginTop: Spacing.md,
    fontFamily: 'Inter-Medium',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  bookCover: {
    flex: 1,
    height: 80,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadow.large,
  },
  coverGradient: {
    flex: 1,
    position: 'relative',
  },
  coverContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  journalTitle: {
    ...Typography.heading,
    color: '#F5DEB3',
    marginLeft: Spacing.md,
    flex: 1,
    fontFamily: 'Inter-Bold',
    fontSize: isSmallScreen ? 18 : 20,
  },
  journalSubtitle: {
    ...Typography.small,
    color: '#DEB887',
    fontFamily: 'Inter-Medium',
  },
  cornerDecoration: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
  },
  cornerLine: {
    position: 'absolute',
    width: 20,
    height: 1,
    backgroundColor: '#F5DEB3',
    opacity: 0.6,
  },
  cornerLineVertical: {
    width: 1,
    height: 20,
  },
  quillButton: {
    marginLeft: Spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadow.medium,
  },
  quillGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  bookmark: {
    backgroundColor: '#DEB887',
    borderRadius: BorderRadius.sm,
    padding: 2,
    ...Shadow.small,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PAPER_COLOR,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.md,
    ...Typography.paragraph,
    color: INK_COLOR,
    fontFamily: 'Inter-Medium',
  },
  pagesContainer: {
    flex: 1,
  },
  pagesContent: {
    padding: Spacing.lg,
  },
  emptyPage: {
    marginBottom: Spacing.xl,
  },
  journalPage: {
    marginBottom: Spacing.xl,
  },
  paperSheet: {
    backgroundColor: PAPER_COLOR,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    position: 'relative',
    minHeight: 300,
    ...Shadow.medium,
    // Paper texture effect
    shadowColor: '#8B4513',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  ruledLine: {
    position: 'absolute',
    left: 60,
    right: 20,
    height: 1,
    backgroundColor: RULED_LINE_COLOR,
    opacity: 0.3,
  },
  marginLine: {
    position: 'absolute',
    left: 50,
    top: 20,
    bottom: 20,
    width: 1,
    backgroundColor: MARGIN_COLOR,
    opacity: 0.4,
  },
  pageContent: {
    marginLeft: 20,
    paddingTop: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  entryDate: {
    ...Typography.small,
    color: '#8B4513',
    marginLeft: Spacing.sm,
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: isSmallScreen ? 11 : 12,
  },
  entryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sentimentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionButton: {
    padding: 4,
  },
  entryTitle: {
    ...Typography.paragraph,
    color: INK_COLOR,
    fontFamily: 'Inter-Bold',
    marginBottom: Spacing.md,
    fontSize: isSmallScreen ? 16 : 18,
    // Handwriting-like styling
    letterSpacing: 0.5,
  },
  entryContent: {
    ...Typography.secondary,
    color: INK_COLOR,
    lineHeight: 24,
    marginBottom: Spacing.lg,
    fontFamily: 'Inter-Regular',
    fontSize: isSmallScreen ? 14 : 15,
    // Handwriting-like styling
    letterSpacing: 0.3,
  },
  moodTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  moodTag: {
    backgroundColor: '#DEB887',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  moodTagText: {
    ...Typography.caption,
    color: '#8B4513',
    fontFamily: 'Inter-Bold',
    fontSize: isSmallScreen ? 10 : 11,
  },
  moreTagsText: {
    ...Typography.caption,
    color: '#A0522D',
    fontStyle: 'italic',
  },
  sentimentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sentimentText: {
    ...Typography.caption,
    fontFamily: 'Inter-Bold',
    fontSize: isSmallScreen ? 10 : 11,
  },
  pageFold: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    backgroundColor: '#E8D5C4',
    borderBottomLeftRadius: BorderRadius.md,
    opacity: 0.3,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.huge,
  },
  emptyTitle: {
    ...Typography.heading,
    color: INK_COLOR,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  emptySubtitle: {
    ...Typography.secondary,
    color: '#A0522D',
    textAlign: 'center',
    marginBottom: Spacing.xl,
    fontFamily: 'Inter-Medium',
  },
  startWritingButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  startWritingText: {
    ...Typography.paragraph,
    color: '#F5DEB3',
    fontFamily: 'Inter-Bold',
  },
  modalContainer: {
    flex: 1,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C4',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    ...Typography.heading,
    color: INK_COLOR,
    fontFamily: 'Inter-Bold',
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
  writingPaper: {
    backgroundColor: PAPER_COLOR,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    position: 'relative',
    minHeight: 500,
    ...Shadow.medium,
  },
  writingLine: {
    position: 'absolute',
    left: 60,
    right: 20,
    height: 1,
    backgroundColor: RULED_LINE_COLOR,
    opacity: 0.3,
  },
  writingMargin: {
    position: 'absolute',
    left: 50,
    top: 20,
    bottom: 20,
    width: 1,
    backgroundColor: MARGIN_COLOR,
    opacity: 0.4,
  },
  writingDate: {
    ...Typography.small,
    color: '#8B4513',
    marginBottom: Spacing.lg,
    fontFamily: 'Inter-Medium',
    textAlign: 'right',
  },
  titleInput: {
    ...Typography.paragraph,
    color: INK_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C4',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
    fontFamily: 'Inter-Bold',
    fontSize: isSmallScreen ? 16 : 18,
  },
  moodSelector: {
    marginBottom: Spacing.xl,
  },
  moodLabel: {
    ...Typography.secondary,
    color: '#8B4513',
    marginBottom: Spacing.md,
    fontFamily: 'Inter-Medium',
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  moodOption: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E8D5C4',
    minWidth: 60,
  },
  selectedMoodOption: {
    backgroundColor: '#DEB887',
    borderColor: '#8B4513',
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodOptionLabel: {
    ...Typography.caption,
    color: '#8B4513',
    fontFamily: 'Inter-Medium',
    fontSize: isSmallScreen ? 9 : 10,
  },
  contentInput: {
    ...Typography.paragraph,
    color: INK_COLOR,
    minHeight: 200,
    textAlignVertical: 'top',
    fontFamily: 'Inter-Regular',
    lineHeight: 28,
    fontSize: isSmallScreen ? 14 : 15,
  },
  writingTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DEB887',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: '#8B4513',
  },
  tipText: {
    ...Typography.small,
    color: '#8B4513',
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 18,
    fontFamily: 'Inter-Medium',
  },
});