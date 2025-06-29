import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Heart,
  MessageCircle,
  Mic,
  BookOpen,
  Music,
  Wind,
  TrendingUp,
  Bell,
  Sparkles,
  Target,
  Plus,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function HomeScreen() {
  const [currentMood, setCurrentMood] = useState('😊');
  
  const quickActions = [
    { id: 1, title: 'Track Mood', icon: Heart, color: Colors.pink, route: '/mood-check-in' },
    { id: 2, title: 'AI Chat', icon: MessageCircle, color: Colors.lavender, route: '/chat' },
    { id: 3, title: 'Voice Input', icon: Mic, color: Colors.green, route: '/voice-entry' },
    { id: 4, title: 'Journal', icon: BookOpen, color: Colors.yellow, route: '/journal' },
  ];

  const suggestions = [
    {
      id: 1,
      title: 'Morning Meditation',
      subtitle: 'Start your day with mindfulness',
      image: 'https://images.pexels.com/photos/3094230/pexels-photo-3094230.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'meditation',
      route: '/mindfulness',
    },
    {
      id: 2,
      title: 'Calming Music',
      subtitle: 'Relax with soothing sounds',
      image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'music',
      route: '/music-player',
    },
    {
      id: 3,
      title: 'Breathing Exercise',
      subtitle: '5-minute stress relief',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'breathing',
      route: '/breathing',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.userName}>Sarah</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={24} color={Colors.gray600} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Mood Status Card */}
        <View style={styles.moodCard}>
          <View style={styles.moodHeader}>
            <Text style={styles.moodTitle}>How are you feeling today?</Text>
            <Text style={styles.currentMood}>{currentMood}</Text>
          </View>
          <Text style={styles.moodSubtitle}>You're doing great! Keep it up.</Text>
          <TouchableOpacity 
            style={styles.trackMoodButton}
            onPress={() => router.push('/mood-check-in')}
          >
            <Plus size={20} color={Colors.white} />
            <Text style={styles.trackMoodButtonText}>Start Daily Check-in</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: action.color + '20' }]}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
                  <action.icon size={24} color={Colors.white} />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggested for You</Text>
            <TouchableOpacity onPress={() => router.push('/toolbox')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {suggestions.map((suggestion) => (
              <TouchableOpacity 
                key={suggestion.id} 
                style={styles.suggestionCard}
                onPress={() => router.push(suggestion.route as any)}
              >
                <Image source={{ uri: suggestion.image }} style={styles.suggestionImage} />
                <View style={styles.suggestionOverlay}>
                  <Sparkles size={20} color={Colors.white} />
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                  <Text style={styles.suggestionSubtitle}>{suggestion.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Progress Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <TouchableOpacity onPress={() => router.push('/streaks')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressCard}>
            <TouchableOpacity 
              style={styles.progressItem}
              onPress={() => router.push('/streaks')}
            >
              <Target size={24} color={Colors.lavender} />
              <View style={styles.progressText}>
                <Text style={styles.progressNumber}>7</Text>
                <Text style={styles.progressLabel}>Days Streak</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.progressItem}
              onPress={() => router.push('/mood-trends')}
            >
              <Heart size={24} color={Colors.pink} />
              <View style={styles.progressText}>
                <Text style={styles.progressNumber}>85%</Text>
                <Text style={styles.progressLabel}>Mood Score</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.progressItem}
              onPress={() => router.push('/journal')}
            >
              <BookOpen size={24} color={Colors.yellow} />
              <View style={styles.progressText}>
                <Text style={styles.progressNumber}>12</Text>
                <Text style={styles.progressLabel}>Journal Entries</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Daily Wellness Tip</Text>
          <Text style={styles.tipText}>
            Practice gratitude by writing down three things you're thankful for each day. 
            This simple habit can significantly improve your mood and outlook.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmGray,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  greeting: {
    ...Typography.secondary,
    color: Colors.gray600,
  },
  userName: {
    ...Typography.subtitle,
    color: Colors.black,
  },
  notificationButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontFamily: 'Poppins-Bold',
  },
  moodCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    ...Shadow.medium,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  moodTitle: {
    ...Typography.heading,
    color: Colors.black,
    flex: 1,
  },
  currentMood: {
    fontSize: 32,
  },
  moodSubtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginBottom: Spacing.lg,
  },
  trackMoodButton: {
    backgroundColor: Colors.lavender,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  trackMoodButtonText: {
    ...Typography.secondary,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  seeAllText: {
    ...Typography.secondary,
    color: Colors.lavender,
    fontFamily: 'Poppins-SemiBold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  quickActionCard: {
    width: '47%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadow.small,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quickActionText: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  suggestionCard: {
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    marginLeft: Spacing.xl,
    overflow: 'hidden',
    ...Shadow.medium,
  },
  suggestionImage: {
    width: '100%',
    height: 120,
  },
  suggestionOverlay: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lavender + '80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionContent: {
    padding: Spacing.lg,
  },
  suggestionTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.xs,
  },
  suggestionSubtitle: {
    ...Typography.small,
    color: Colors.gray600,
  },
  progressCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadow.small,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  progressText: {
    marginLeft: Spacing.lg,
  },
  progressNumber: {
    ...Typography.subtitle,
    color: Colors.black,
    fontFamily: 'Poppins-Bold',
  },
  progressLabel: {
    ...Typography.small,
    color: Colors.gray600,
  },
  tipCard: {
    backgroundColor: Colors.lightLavender,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.huge,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.lavender,
  },
  tipTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  tipText: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
  },
});