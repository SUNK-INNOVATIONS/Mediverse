import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Brain, Heart, Lightbulb, MessageCircle, Wrench } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const moodResults = [
  {
    mood: 'overwhelmed',
    emoji: '😰',
    color: Colors.orange,
    message: "You sound a little overwhelmed today",
    insights: [
      "Your language suggests high stress levels",
      "You mentioned work pressures multiple times",
      "Consider taking short breaks throughout the day"
    ]
  },
  {
    mood: 'anxious',
    emoji: '😟',
    color: Colors.yellow,
    message: "I sense some anxiety in your words",
    insights: [
      "Breathing patterns in your voice indicate tension",
      "You're using more uncertain language than usual",
      "Grounding exercises might help right now"
    ]
  },
  {
    mood: 'content',
    emoji: '😊',
    color: Colors.green,
    message: "You're feeling pretty good today!",
    insights: [
      "Your tone is positive and stable",
      "You mentioned several things you're grateful for",
      "Keep up the good energy!"
    ]
  }
];

export default function MoodAnalysisScreen() {
  const [currentResult] = useState(moodResults[0]); // In real app, this would be dynamic
  const [showInsights, setShowInsights] = useState(false);

  const scaleValue = useSharedValue(0);
  const opacityValue = useSharedValue(0);
  const insightsOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate mood result entrance
    scaleValue.value = withSequence(
      withTiming(1.1, { duration: 600 }),
      withTiming(1, { duration: 200 })
    );
    opacityValue.value = withTiming(1, { duration: 800 });

    // Show insights after a delay
    setTimeout(() => {
      setShowInsights(true);
      insightsOpacity.value = withTiming(1, { duration: 600 });
    }, 1500);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const insightsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: insightsOpacity.value,
  }));

  const handleGetHelp = () => {
    router.push('/toolbox');
  };

  const handleChatWithAI = () => {
    router.push('/(tabs)/chat');
  };

  const handleViewHistory = () => {
    router.push('/mood-trends');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood Analysis</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Mood Result */}
        <Animated.View style={[styles.moodCard, animatedStyle]}>
          <View style={[styles.moodIndicator, { backgroundColor: currentResult.color + '20' }]}>
            <Text style={styles.moodEmoji}>{currentResult.emoji}</Text>
          </View>
          
          <Text style={styles.moodMessage}>{currentResult.message}</Text>
          
          <View style={styles.analysisInfo}>
            <Brain size={20} color={Colors.lavender} />
            <Text style={styles.analysisText}>AI Analysis Complete</Text>
          </View>
        </Animated.View>

        {/* Insights */}
        {showInsights && (
          <Animated.View style={[styles.insightsContainer, insightsAnimatedStyle]}>
            <View style={styles.insightsHeader}>
              <Lightbulb size={20} color={Colors.yellow} />
              <Text style={styles.insightsTitle}>Key Insights</Text>
            </View>
            
            {currentResult.insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <View style={styles.insightDot} />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>What would you like to do next?</Text>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleGetHelp}>
            <Wrench size={20} color={Colors.white} />
            <Text style={styles.primaryButtonText}>Get Wellness Tools</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleChatWithAI}>
            <MessageCircle size={20} color={Colors.lavender} />
            <Text style={styles.secondaryButtonText}>Chat with AI Companion</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewHistory}>
            <Heart size={20} color={Colors.lavender} />
            <Text style={styles.secondaryButtonText}>View Mood History</Text>
          </TouchableOpacity>
        </View>

        {/* Confidence Score */}
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Analysis Confidence</Text>
          <View style={styles.confidenceBar}>
            <View style={[styles.confidenceFill, { width: '87%', backgroundColor: currentResult.color }]} />
          </View>
          <Text style={styles.confidenceText}>87% confident</Text>
        </View>
      </View>
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
    paddingTop: Spacing.xl,
  },
  moodCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.huge,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadow.medium,
  },
  moodIndicator: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  moodEmoji: {
    fontSize: 48,
  },
  moodMessage: {
    ...Typography.subtitle,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  analysisInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightLavender,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  analysisText: {
    ...Typography.secondary,
    color: Colors.lavender,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  insightsContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  insightsTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.lavender,
    marginTop: 8,
    marginRight: Spacing.md,
  },
  insightText: {
    ...Typography.secondary,
    color: Colors.gray700,
    flex: 1,
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: Spacing.xl,
  },
  actionsTitle: {
    ...Typography.heading,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  primaryButton: {
    backgroundColor: Colors.lavender,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadow.medium,
  },
  primaryButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.gray200,
  },
  secondaryButtonText: {
    ...Typography.paragraph,
    color: Colors.lavender,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  confidenceContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadow.small,
  },
  confidenceLabel: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginBottom: Spacing.sm,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    ...Typography.small,
    color: Colors.gray600,
    textAlign: 'right',
  },
});