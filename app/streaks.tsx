import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Flame, Trophy, Target, Calendar, Star, Award } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withSpring
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const streaks = [
  {
    id: 'mood-tracking',
    title: 'Mood Tracking',
    description: 'Daily mood check-ins',
    currentStreak: 7,
    bestStreak: 15,
    icon: Target,
    color: Colors.lavender,
    isActive: true,
  },
  {
    id: 'meditation',
    title: 'Meditation',
    description: 'Mindfulness sessions',
    currentStreak: 3,
    bestStreak: 8,
    icon: Star,
    color: Colors.pastelBlue,
    isActive: true,
  },
  {
    id: 'journaling',
    title: 'Journaling',
    description: 'Writing thoughts',
    currentStreak: 0,
    bestStreak: 12,
    icon: Calendar,
    color: Colors.yellow,
    isActive: false,
  },
  {
    id: 'breathing',
    title: 'Breathing Exercises',
    description: 'Daily breathing practice',
    currentStreak: 5,
    bestStreak: 10,
    icon: Award,
    color: Colors.softMint,
    isActive: true,
  },
];

const achievements = [
  {
    id: 'first-week',
    title: 'First Week',
    description: 'Complete 7 days of mood tracking',
    icon: '🎯',
    unlocked: true,
    date: '2024-01-07',
  },
  {
    id: 'meditation-master',
    title: 'Meditation Master',
    description: 'Complete 10 meditation sessions',
    icon: '🧘‍♀️',
    unlocked: true,
    date: '2024-01-10',
  },
  {
    id: 'consistency-king',
    title: 'Consistency King',
    description: 'Maintain a 30-day streak',
    icon: '👑',
    unlocked: false,
    progress: 23,
    total: 30,
  },
  {
    id: 'wellness-warrior',
    title: 'Wellness Warrior',
    description: 'Use all wellness tools in one day',
    icon: '⚡',
    unlocked: false,
    progress: 3,
    total: 4,
  },
];

export default function StreaksScreen() {
  const [selectedTab, setSelectedTab] = useState<'streaks' | 'achievements'>('streaks');

  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handleStreakPress = (streak: any) => {
    scaleValue.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 8, stiffness: 100 })
    );
  };

  const StreakCard = ({ streak }: { streak: any }) => {
    const Icon = streak.icon;
    const streakPercentage = streak.bestStreak > 0 ? (streak.currentStreak / streak.bestStreak) * 100 : 0;

    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[
            styles.streakCard,
            !streak.isActive && styles.inactiveCard
          ]}
          onPress={() => handleStreakPress(streak)}
        >
          <View style={styles.streakHeader}>
            <View style={[styles.streakIcon, { backgroundColor: streak.color + '20' }]}>
              <Icon size={24} color={streak.color} />
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.streakTitle}>{streak.title}</Text>
              <Text style={styles.streakDescription}>{streak.description}</Text>
            </View>
            {streak.isActive && (
              <View style={styles.activeIndicator}>
                <Flame size={20} color={Colors.orange} />
              </View>
            )}
          </View>

          <View style={styles.streakStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: streak.color }]}>
                {streak.currentStreak}
              </Text>
              <Text style={styles.statLabel}>Current</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{streak.bestStreak}</Text>
              <Text style={styles.statLabel}>Best</Text>
            </View>
          </View>

          {streak.bestStreak > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(streakPercentage, 100)}%`,
                      backgroundColor: streak.color,
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(streakPercentage)}% of best streak
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const AchievementCard = ({ achievement }: { achievement: any }) => (
    <View style={[
      styles.achievementCard,
      achievement.unlocked && styles.unlockedAchievement
    ]}>
      <View style={styles.achievementHeader}>
        <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
        <View style={styles.achievementInfo}>
          <Text style={[
            styles.achievementTitle,
            !achievement.unlocked && styles.lockedText
          ]}>
            {achievement.title}
          </Text>
          <Text style={[
            styles.achievementDescription,
            !achievement.unlocked && styles.lockedText
          ]}>
            {achievement.description}
          </Text>
        </View>
        {achievement.unlocked && (
          <View style={styles.unlockedBadge}>
            <Trophy size={16} color={Colors.yellow} />
          </View>
        )}
      </View>

      {achievement.unlocked ? (
        <Text style={styles.achievementDate}>
          Unlocked on {new Date(achievement.date).toLocaleDateString()}
        </Text>
      ) : (
        <View style={styles.achievementProgress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(achievement.progress / achievement.total) * 100}%`,
                  backgroundColor: Colors.lavender,
                }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {achievement.progress}/{achievement.total}
          </Text>
        </View>
      )}
    </View>
  );

  const totalCurrentStreaks = streaks.filter(s => s.isActive).length;
  const longestStreak = Math.max(...streaks.map(s => s.currentStreak));
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Streaks & Achievements</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Flame size={24} color={Colors.orange} />
            <Text style={styles.summaryNumber}>{totalCurrentStreaks}</Text>
            <Text style={styles.summaryLabel}>Active Streaks</Text>
          </View>
          <View style={styles.summaryCard}>
            <Target size={24} color={Colors.lavender} />
            <Text style={styles.summaryNumber}>{longestStreak}</Text>
            <Text style={styles.summaryLabel}>Longest Current</Text>
          </View>
          <View style={styles.summaryCard}>
            <Trophy size={24} color={Colors.yellow} />
            <Text style={styles.summaryNumber}>{unlockedAchievements}</Text>
            <Text style={styles.summaryLabel}>Achievements</Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'streaks' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('streaks')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'streaks' && styles.activeTabText
            ]}>
              Streaks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'achievements' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('achievements')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'achievements' && styles.activeTabText
            ]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {selectedTab === 'streaks' ? (
          <View style={styles.streaksContainer}>
            <Text style={styles.sectionTitle}>Your Streaks</Text>
            <Text style={styles.sectionDescription}>
              Keep up your daily habits to maintain your streaks!
            </Text>
            {streaks.map((streak) => (
              <StreakCard key={streak.id} streak={streak} />
            ))}
          </View>
        ) : (
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <Text style={styles.sectionDescription}>
              Unlock badges by reaching wellness milestones
            </Text>
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </View>
        )}

        {/* Motivation Card */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>🎯 Keep Going!</Text>
          <Text style={styles.motivationText}>
            Consistency is key to building healthy habits. Every day you show up for yourself matters!
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
    ...Shadow.small,
  },
  summaryNumber: {
    ...Typography.title,
    color: Colors.black,
    fontFamily: 'Poppins-Bold',
    marginTop: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.small,
    color: Colors.gray600,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xs,
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  activeTab: {
    backgroundColor: Colors.lavender,
  },
  tabText: {
    ...Typography.secondary,
    color: Colors.gray600,
    fontFamily: 'Poppins-SemiBold',
  },
  activeTabText: {
    color: Colors.white,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  streaksContainer: {
    marginBottom: Spacing.xl,
  },
  streakCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  inactiveCard: {
    opacity: 0.6,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  streakIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.xs,
  },
  streakDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
  },
  activeIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.orange + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakStats: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.title,
    color: Colors.black,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    ...Typography.small,
    color: Colors.gray600,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray200,
    marginHorizontal: Spacing.lg,
  },
  progressContainer: {
    marginTop: Spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    ...Typography.small,
    color: Colors.gray600,
    textAlign: 'center',
  },
  achievementsContainer: {
    marginBottom: Spacing.xl,
  },
  achievementCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  unlockedAchievement: {
    backgroundColor: Colors.yellow + '10',
    borderWidth: 2,
    borderColor: Colors.yellow + '40',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  achievementEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.xs,
  },
  achievementDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
  },
  lockedText: {
    opacity: 0.6,
  },
  unlockedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.yellow + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementDate: {
    ...Typography.small,
    color: Colors.yellow,
    fontFamily: 'Poppins-SemiBold',
  },
  achievementProgress: {
    marginTop: Spacing.md,
  },
  motivationCard: {
    backgroundColor: Colors.lightLavender,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.huge,
    borderLeftWidth: 4,
    borderLeftColor: Colors.lavender,
  },
  motivationTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  motivationText: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
  },
});