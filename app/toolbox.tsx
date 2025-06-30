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
import { ArrowLeft, Wind, Music, Heart, Brain, Sparkles, Clock } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const tools = [
  {
    id: 'breathing',
    title: 'Breathing Exercise',
    subtitle: '4-7-8 technique for instant calm',
    icon: Wind,
    color: Colors.pastelBlue,
    duration: '3 min',
    route: '/breathing'
  },
  {
    id: 'music',
    title: 'Calming Music',
    subtitle: 'Curated playlist for your mood',
    icon: Music,
    color: Colors.softMint,
    duration: '15 min',
    route: '/music-player'
  },
  {
    id: 'affirmations',
    title: 'Daily Affirmations',
    subtitle: 'Positive thoughts for your day',
    icon: Sparkles,
    color: Colors.yellow,
    duration: '2 min',
    route: '/affirmations'
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness Session',
    subtitle: 'Guided meditation for clarity',
    icon: Brain,
    color: Colors.pink,
    duration: '10 min',
    route: '/mindfulness'
  }
];

export default function ToolboxScreen() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const ToolCard = ({ tool, index }: { tool: any; index: number }) => {
    const scaleValue = useSharedValue(1);
    const isSelected = selectedTool === tool.id;

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleValue.value }],
    }));

    const handlePress = () => {
      setSelectedTool(tool.id);
      scaleValue.value = withSpring(0.95, {}, () => {
        scaleValue.value = withSpring(1);
      });
      
      setTimeout(() => {
        router.push(tool.route);
      }, 200);
    };

    return (
      <Animated.View style={[animatedStyle, { marginBottom: Spacing.lg }]}>
        <TouchableOpacity
          style={[
            styles.toolCard,
            { backgroundColor: tool.color + '20' },
            isSelected && styles.selectedCard
          ]}
          onPress={handlePress}
        >
          <View style={styles.toolHeader}>
            <View style={[styles.iconContainer, { backgroundColor: tool.color }]}>
              <tool.icon size={24} color={Colors.white} />
            </View>
            <View style={styles.durationBadge}>
              <Clock size={12} color={Colors.gray600} />
              <Text style={styles.durationText}>{tool.duration}</Text>
            </View>
          </View>
          
          <Text style={styles.toolTitle}>{tool.title}</Text>
          <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
          
          <View style={styles.toolFooter}>
            <Text style={[styles.startText, { color: tool.color }]}>
              Tap to start →
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wellness Toolbox</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Heart size={32} color={Colors.lavender} />
          <Text style={styles.introTitle}>Choose Your Tool</Text>
          <Text style={styles.introText}>
            Select a wellness activity that feels right for you in this moment
          </Text>
        </View>

        <View style={styles.toolsContainer}>
          {tools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Pro Tip</Text>
          <Text style={styles.tipText}>
            Try different tools at different times of day to see what works best for your routine
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
  introCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  introTitle: {
    ...Typography.subtitle,
    color: Colors.black,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  introText: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
  toolsContainer: {
    marginBottom: Spacing.xl,
  },
  toolCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadow.medium,
  },
  selectedCard: {
    borderColor: Colors.lavender,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  durationText: {
    ...Typography.small,
    color: Colors.gray600,
    marginLeft: Spacing.xs,
    fontFamily: 'Poppins-SemiBold',
  },
  toolTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  toolSubtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  toolFooter: {
    alignItems: 'flex-end',
  },
  startText: {
    ...Typography.secondary,
    fontFamily: 'Poppins-SemiBold',
  },
  tipCard: {
    backgroundColor: Colors.lightLavender,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.huge,
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