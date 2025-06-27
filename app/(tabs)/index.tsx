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
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function HomeScreen() {
  const [currentMood, setCurrentMood] = useState('😊');
  
  const quickActions = [
    { id: 1, title: 'Track Mood', icon: Heart, color: Colors.pink, route: '/mood' },
    { id: 2, title: 'AI Chat', icon: MessageCircle, color: Colors.purple, route: '/chat' },
    { id: 3, title: 'Voice Input', icon: Mic, color: Colors.green, route: '/voice' },
    { id: 4, title: 'Journal', icon: BookOpen, color: Colors.yellow, route: '/journal' },
  ];

  const suggestions = [
    {
      id: 1,
      title: 'Morning Meditation',
      subtitle: 'Start your day with mindfulness',
      image: 'https://images.pexels.com/photos/3094230/pexels-photo-3094230.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'meditation',
    },
    {
      id: 2,
      title: 'Calming Music',
      subtitle: 'Relax with soothing sounds',
      image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'music',
    },
    {
      id: 3,
      title: 'Breathing Exercise',
      subtitle: '5-minute stress relief',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'breathing',
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
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors.gray600} />
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
            onPress={() => router.push('/mood')}
          >
            <Text style={styles.trackMoodButtonText}>Track Your Mood</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: action.color }]}
                onPress={() => router.push(action.route as any)}
              >
                <action.icon size={32} color={Colors.white} />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggested for You</Text>
            <TouchableOpacity onPress={() => router.push('/suggestions')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {suggestions.map((suggestion) => (
              <TouchableOpacity key={suggestion.id} style={styles.suggestionCard}>
                <Image source={{ uri: suggestion.image }} style={styles.suggestionImage} />
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
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressItem}>
              <TrendingUp size={24} color={Colors.purple} />
              <View style={styles.progressText}>
                <Text style={styles.progressNumber}>7</Text>
                <Text style={styles.progressLabel}>Days Streak</Text>
              </View>
            </View>
            <View style={styles.progressItem}>
              <Heart size={24} color={Colors.pink} />
              <View style={styles.progressText}>
                <Text style={styles.progressNumber}>85%</Text>
                <Text style={styles.progressLabel}>Mood Score</Text>
              </View>
            </View>
            <View style={styles.progressItem}>
              <BookOpen size={24} color={Colors.yellow} />
              <View style={styles.progressText}>
                <Text style={styles.progressNumber}>12</Text>
                <Text style={styles.progressLabel}>Journal Entries</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
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
    padding: Spacing.sm,
  },
  moodCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
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
    backgroundColor: Colors.purple,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  trackMoodButtonText: {
    ...Typography.secondary,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
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
    color: Colors.purple,
    fontFamily: 'Inter-Bold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
  },
  quickActionCard: {
    width: '45%',
    aspectRatio: 1,
    margin: Spacing.sm,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.small,
  },
  quickActionText: {
    ...Typography.secondary,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    marginTop: Spacing.sm,
  },
  suggestionCard: {
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginLeft: Spacing.xl,
    overflow: 'hidden',
    ...Shadow.small,
  },
  suggestionImage: {
    width: '100%',
    height: 120,
  },
  suggestionContent: {
    padding: Spacing.lg,
  },
  suggestionTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginBottom: Spacing.xs,
  },
  suggestionSubtitle: {
    ...Typography.small,
    color: Colors.gray600,
  },
  progressCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadow.small,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  progressText: {
    marginLeft: Spacing.lg,
  },
  progressNumber: {
    ...Typography.subtitle,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
  },
  progressLabel: {
    ...Typography.small,
    color: Colors.gray600,
  },
});