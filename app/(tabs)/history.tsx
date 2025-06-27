import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, TrendingUp, MessageCircle, BookOpen, Filter } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const { width } = Dimensions.get('window');

const mockData = {
  moodEntries: [
    { date: '2024-03-15', mood: 4, emoji: '😊', factors: ['Work/School', 'Exercise'] },
    { date: '2024-03-14', mood: 5, emoji: '🤩', factors: ['Relationships', 'Health'] },
    { date: '2024-03-13', mood: 3, emoji: '😐', factors: ['Sleep', 'Weather'] },
    { date: '2024-03-12', mood: 4, emoji: '😊', factors: ['Exercise', 'Family'] },
    { date: '2024-03-11', mood: 2, emoji: '😢', factors: ['Work/School', 'Money'] },
  ],
  journalEntries: [
    { date: '2024-03-15', title: 'A Good Day', excerpt: 'Today was really productive...' },
    { date: '2024-03-13', title: 'Feeling Reflective', excerpt: 'Been thinking about my goals...' },
    { date: '2024-03-10', title: 'Challenges', excerpt: 'Some difficult moments today...' },
  ],
  chatSessions: [
    { date: '2024-03-15', duration: '15 min', topic: 'Work Stress' },
    { date: '2024-03-14', duration: '22 min', topic: 'Relationship Goals' },
    { date: '2024-03-12', duration: '8 min', topic: 'Daily Check-in' },
  ],
};

type TabType = 'mood' | 'journal' | 'chat';

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('mood');

  const getMoodColor = (mood: number) => {
    if (mood >= 4) return Colors.green;
    if (mood === 3) return Colors.yellow;
    return Colors.pink;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderMoodHistory = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Mood Trend</Text>
        <View style={styles.moodChart}>
          {mockData.moodEntries.map((entry, index) => (
            <View key={index} style={styles.chartBar}>
              <View
                style={[
                  styles.moodBar,
                  {
                    height: (entry.mood / 5) * 100,
                    backgroundColor: getMoodColor(entry.mood),
                  }
                ]}
              />
              <Text style={styles.chartDate}>{formatDate(entry.date)}</Text>
            </View>
          ))}
        </View>
      </View>

      {mockData.moodEntries.map((entry, index) => (
        <View key={index} style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <View style={styles.historyDate}>
              <Calendar size={16} color={Colors.purple} />
              <Text style={styles.historyDateText}>{formatDate(entry.date)}</Text>
            </View>
            <Text style={styles.moodEmoji}>{entry.emoji}</Text>
          </View>
          
          <View style={styles.moodFactors}>
            {entry.factors.map((factor, factorIndex) => (
              <View key={factorIndex} style={styles.factorTag}>
                <Text style={styles.factorText}>{factor}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderJournalHistory = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {mockData.journalEntries.map((entry, index) => (
        <TouchableOpacity key={index} style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <View style={styles.historyDate}>
              <BookOpen size={16} color={Colors.yellow} />
              <Text style={styles.historyDateText}>{formatDate(entry.date)}</Text>
            </View>
          </View>
          
          <Text style={styles.journalTitle}>{entry.title}</Text>
          <Text style={styles.journalExcerpt}>{entry.excerpt}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderChatHistory = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {mockData.chatSessions.map((session, index) => (
        <TouchableOpacity key={index} style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <View style={styles.historyDate}>
              <MessageCircle size={16} color={Colors.green} />
              <Text style={styles.historyDateText}>{formatDate(session.date)}</Text>
            </View>
            <Text style={styles.sessionDuration}>{session.duration}</Text>
          </View>
          
          <Text style={styles.sessionTopic}>{session.topic}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your History</Text>
        <TouchableOpacity>
          <Filter size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mood' && styles.activeTab]}
          onPress={() => setActiveTab('mood')}
        >
          <Text style={[styles.tabText, activeTab === 'mood' && styles.activeTabText]}>
            Mood
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'journal' && styles.activeTab]}
          onPress={() => setActiveTab('journal')}
        >
          <Text style={[styles.tabText, activeTab === 'journal' && styles.activeTabText]}>
            Journal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
            Chat
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'mood' && renderMoodHistory()}
        {activeTab === 'journal' && renderJournalHistory()}
        {activeTab === 'chat' && renderChatHistory()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
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
    ...Typography.subtitle,
    color: Colors.black,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.purple,
  },
  tabText: {
    ...Typography.secondary,
    color: Colors.gray600,
  },
  activeTabText: {
    color: Colors.purple,
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  chartContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  chartTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  moodChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  moodBar: {
    width: 20,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  chartDate: {
    ...Typography.small,
    color: Colors.gray600,
    transform: [{ rotate: '-45deg' }],
    width: 40,
  },
  historyCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadow.small,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  historyDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDateText: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginLeft: Spacing.sm,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodFactors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  factorTag: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xl,
    margin: Spacing.xs,
  },
  factorText: {
    ...Typography.small,
    color: Colors.gray700,
  },
  journalTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginBottom: Spacing.sm,
  },
  journalExcerpt: {
    ...Typography.secondary,
    color: Colors.gray600,
    lineHeight: 20,
  },
  sessionDuration: {
    ...Typography.small,
    color: Colors.purple,
    fontFamily: 'Inter-Bold',
  },
  sessionTopic: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
  },
});