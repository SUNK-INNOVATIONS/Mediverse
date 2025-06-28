import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  MessageCircle,
  Mic,
  BookOpen,
  TrendingUp,
  Bell,
  Plus,
  Sparkles,
  Calendar,
  Target,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import AnimatedCard from '@/components/AnimatedCard';
import FloatingActionButton from '@/components/FloatingActionButton';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentMood, setCurrentMood] = useState('😊');
  
  const quickActions = [
    { id: 1, title: 'Track Mood', icon: Heart, color: Colors.gradientPink, route: '/mood' },
    { id: 2, title: 'AI Chat', icon: MessageCircle, color: Colors.gradientPurple, route: '/chat' },
    { id: 3, title: 'Voice Input', icon: Mic, color: Colors.gradientGreen, route: '/voice' },
    { id: 4, title: 'Journal', icon: BookOpen, color: Colors.gradientBlue, route: '/journal' },
  ];

  const suggestions = [
    {
      id: 1,
      title: 'Morning Meditation',
      subtitle: 'Start your day mindfully',
      image: 'https://images.pexels.com/photos/3094230/pexels-photo-3094230.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '5 min',
      type: 'meditation',
    },
    {
      id: 2,
      title: 'Breathing Exercise',
      subtitle: 'Quick stress relief',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '3 min',
      type: 'breathing',
    },
    {
      id: 3,
      title: 'Calming Sounds',
      subtitle: 'Nature soundscape',
      image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '10 min',
      type: 'music',
    },
  ];

  const stats = [
    { label: 'Day Streak', value: '7', icon: Calendar, color: Colors.purple },
    { label: 'Mood Score', value: '85%', icon: TrendingUp, color: Colors.green },
    { label: 'Goals Met', value: '3/4', icon: Target, color: Colors.blue },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.userName}>Sarah ✨</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <View style={styles.notificationBadge}>
                <Bell size={20} color={Colors.gray600} />
                <View style={styles.badge} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Mood Status Card */}
          <AnimatedCard style={styles.moodCard} delay={100}>
            <LinearGradient
              colors={Colors.gradientPurple}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.moodGradient}
            >
              <View style={styles.moodHeader}>
                <View>
                  <Text style={styles.moodTitle}>How are you feeling?</Text>
                  <Text style={styles.moodSubtitle}>Track your emotional journey</Text>
                </View>
                <View style={styles.moodEmoji}>
                  <Text style={styles.currentMood}>{currentMood}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.trackMoodButton}
                onPress={() => router.push('/mood')}
              >
                <Sparkles size={16} color={Colors.purple} />
                <Text style={styles.trackMoodButtonText}>Track Your Mood</Text>
              </TouchableOpacity>
            </LinearGradient>
          </AnimatedCard>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <AnimatedCard key={stat.label} style={styles.statCard} delay={200} index={index}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                  <stat.icon size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </AnimatedCard>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <AnimatedCard key={action.id} style={styles.quickActionCard} delay={300} index={index}>
                  <TouchableOpacity
                    style={styles.quickActionContent}
                    onPress={() => router.push(action.route as any)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={action.color}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.quickActionIcon}
                    >
                      <action.icon size={24} color={Colors.white} />
                    </LinearGradient>
                    <Text style={styles.quickActionText}>{action.title}</Text>
                  </TouchableOpacity>
                </AnimatedCard>
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
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsContainer}
            >
              {suggestions.map((suggestion, index) => (
                <AnimatedCard key={suggestion.id} style={styles.suggestionCard} delay={400} index={index}>
                  <TouchableOpacity activeOpacity={0.9}>
                    <View style={styles.suggestionImageContainer}>
                      <Image source={{ uri: suggestion.image }} style={styles.suggestionImage} />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        style={styles.suggestionOverlay}
                      />
                      <View style={styles.suggestionBadge}>
                        <Text style={styles.suggestionDuration}>{suggestion.duration}</Text>
                      </View>
                    </View>
                    <View style={styles.suggestionContent}>
                      <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                      <Text style={styles.suggestionSubtitle}>{suggestion.subtitle}</Text>
                    </View>
                  </TouchableOpacity>
                </AnimatedCard>
              ))}
            </ScrollView>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Floating Action Button */}
        <View style={styles.fabContainer}>
          <FloatingActionButton onPress={() => router.push('/mood')}>
            <Plus size={24} color={Colors.white} />
          </FloatingActionButton>
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
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
    marginTop: 2,
  },
  notificationButton: {
    padding: Spacing.sm,
  },
  notificationBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  moodCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    padding: 0,
    overflow: 'hidden',
  },
  moodGradient: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  moodTitle: {
    ...Typography.heading,
    color: Colors.white,
    marginBottom: 4,
  },
  moodSubtitle: {
    ...Typography.secondary,
    color: Colors.white,
    opacity: 0.9,
  },
  moodEmoji: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentMood: {
    fontSize: 28,
  },
  trackMoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  trackMoodButtonText: {
    ...Typography.secondary,
    color: Colors.purple,
    fontFamily: 'Inter-Bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.gray600,
    textAlign: 'center',
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
    gap: Spacing.md,
  },
  quickActionCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    padding: 0,
  },
  quickActionContent: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quickActionText: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  suggestionsContainer: {
    paddingLeft: Spacing.xl,
    gap: Spacing.md,
  },
  suggestionCard: {
    width: 200,
    padding: 0,
    overflow: 'hidden',
  },
  suggestionImageContainer: {
    position: 'relative',
    height: 120,
  },
  suggestionImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  suggestionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  suggestionBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  suggestionDuration: {
    ...Typography.caption,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  suggestionContent: {
    padding: Spacing.lg,
  },
  suggestionTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  suggestionSubtitle: {
    ...Typography.small,
    color: Colors.gray600,
  },
  bottomSpacing: {
    height: 100,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.xl,
  },
});