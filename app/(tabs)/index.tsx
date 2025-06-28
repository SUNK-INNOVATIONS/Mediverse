import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
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
  ChevronRight,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import AnimatedCard from '@/components/AnimatedCard';
import FloatingActionButton from '@/components/FloatingActionButton';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;
const cardPadding = isSmallScreen ? Spacing.md : Spacing.lg;

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
          bounces={true}
          scrollEventThrottle={16}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.userName}>Sarah ✨</Text>
            </View>
            <TouchableOpacity 
              style={styles.notificationButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={styles.notificationBadge}>
                <Bell size={20} color={Colors.gray600} />
                <View style={styles.badge} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Mood Status Card */}
          <AnimatedCard style={styles.moodCard} delay={100}>
            <TouchableOpacity 
              onPress={() => router.push('/mood')}
              activeOpacity={0.95}
              style={styles.moodCardTouchable}
            >
              <LinearGradient
                colors={Colors.gradientPurple}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.moodGradient}
              >
                <View style={styles.moodHeader}>
                  <View style={styles.moodTextContainer}>
                    <Text style={styles.moodTitle}>How are you feeling?</Text>
                    <Text style={styles.moodSubtitle}>Track your emotional journey</Text>
                  </View>
                  <View style={styles.moodEmoji}>
                    <Text style={styles.currentMood}>{currentMood}</Text>
                  </View>
                </View>
                <View style={styles.trackMoodButton}>
                  <Sparkles size={16} color={Colors.purple} />
                  <Text style={styles.trackMoodButtonText}>Track Your Mood</Text>
                  <ChevronRight size={16} color={Colors.purple} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </AnimatedCard>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <AnimatedCard key={stat.label} style={styles.statCard} delay={200} index={index}>
                <TouchableOpacity 
                  style={styles.statContent}
                  activeOpacity={0.8}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                    <stat.icon size={18} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </TouchableOpacity>
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
                      <action.icon size={22} color={Colors.white} />
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
              <TouchableOpacity 
                onPress={() => router.push('/suggestions')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsContainer}
              decelerationRate="fast"
              snapToInterval={220}
              snapToAlignment="start"
            >
              {suggestions.map((suggestion, index) => (
                <AnimatedCard key={suggestion.id} style={styles.suggestionCard} delay={400} index={index}>
                  <TouchableOpacity 
                    activeOpacity={0.9}
                    style={styles.suggestionTouchable}
                  >
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
    paddingBottom: Platform.OS === 'ios' ? 140 : 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
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
    borderRadius: 20,
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
  moodCardTouchable: {
    borderRadius: BorderRadius.lg,
  },
  moodGradient: {
    padding: cardPadding,
    borderRadius: BorderRadius.lg,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  moodTextContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  moodTitle: {
    ...Typography.heading,
    color: Colors.white,
    marginBottom: 4,
    fontSize: isSmallScreen ? 18 : 20,
  },
  moodSubtitle: {
    ...Typography.secondary,
    color: Colors.white,
    opacity: 0.9,
    fontSize: isSmallScreen ? 13 : 14,
  },
  moodEmoji: {
    width: isSmallScreen ? 50 : 60,
    height: isSmallScreen ? 50 : 60,
    borderRadius: isSmallScreen ? 25 : 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentMood: {
    fontSize: isSmallScreen ? 24 : 28,
  },
  trackMoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    minHeight: 44, // Minimum touch target
  },
  trackMoodButtonText: {
    ...Typography.secondary,
    color: Colors.purple,
    fontFamily: 'Inter-Bold',
    fontSize: isSmallScreen ? 13 : 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: cardPadding,
    minHeight: 80,
  },
  statContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  statIcon: {
    width: isSmallScreen ? 32 : 40,
    height: isSmallScreen ? 32 : 40,
    borderRadius: isSmallScreen ? 16 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: 2,
    fontSize: isSmallScreen ? 16 : 20,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.gray600,
    textAlign: 'center',
    fontSize: isSmallScreen ? 10 : 11,
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
    fontSize: isSmallScreen ? 18 : 20,
  },
  seeAllText: {
    ...Typography.secondary,
    color: Colors.purple,
    fontFamily: 'Inter-Bold',
    fontSize: isSmallScreen ? 13 : 14,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  quickActionCard: {
    width: (width - Spacing.lg * 2 - Spacing.sm) / 2,
    padding: 0,
    minHeight: isSmallScreen ? 100 : 120,
  },
  quickActionContent: {
    padding: cardPadding,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 44, // Minimum touch target
  },
  quickActionIcon: {
    width: isSmallScreen ? 48 : 56,
    height: isSmallScreen ? 48 : 56,
    borderRadius: isSmallScreen ? 24 : 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quickActionText: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    fontSize: isSmallScreen ? 13 : 14,
  },
  suggestionsContainer: {
    paddingLeft: Spacing.xl,
    paddingRight: Spacing.md,
    gap: Spacing.md,
  },
  suggestionCard: {
    width: isSmallScreen ? 180 : 200,
    padding: 0,
    overflow: 'hidden',
  },
  suggestionTouchable: {
    borderRadius: BorderRadius.lg,
  },
  suggestionImageContainer: {
    position: 'relative',
    height: isSmallScreen ? 100 : 120,
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
    fontSize: 10,
  },
  suggestionContent: {
    padding: cardPadding,
  },
  suggestionTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
    fontSize: isSmallScreen ? 14 : 16,
  },
  suggestionSubtitle: {
    ...Typography.small,
    color: Colors.gray600,
    fontSize: isSmallScreen ? 11 : 12,
  },
  bottomSpacing: {
    height: 20,
  },
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 110 : 90,
    right: Spacing.xl,
  },
});