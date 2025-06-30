import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  Easing
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const sessions = [
  {
    id: 1,
    title: 'Body Scan Meditation',
    duration: 600, // 10 minutes in seconds
    description: 'Release tension and connect with your body',
    steps: [
      'Find a comfortable position',
      'Close your eyes and breathe naturally',
      'Start by noticing your toes',
      'Slowly move your attention up your body',
      'Notice any tension without judgment',
      'Breathe into areas of tension',
      'Continue until you reach the top of your head'
    ]
  },
  {
    id: 2,
    title: 'Loving Kindness',
    duration: 480, // 8 minutes
    description: 'Cultivate compassion for yourself and others',
    steps: [
      'Sit comfortably and close your eyes',
      'Begin with yourself: "May I be happy"',
      'Extend to loved ones',
      'Include neutral people',
      'Embrace difficult relationships',
      'Expand to all beings everywhere'
    ]
  }
];

export default function MindfulnessScreen() {
  const [currentSession] = useState(sessions[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const pulseValue = useSharedValue(1);
  const waveOpacity = useSharedValue(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentSession.duration) {
            setIsPlaying(false);
            return currentSession.duration;
          }
          return prev + 1;
        });
      }, 1000);

      // Animate meditation visual
      pulseValue.value = withRepeat(
        withTiming(1.2, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      waveOpacity.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        true
      );
    } else {
      pulseValue.value = withTiming(1);
      waveOpacity.value = withTiming(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Update current step based on time
  useEffect(() => {
    const stepDuration = currentSession.duration / currentSession.steps.length;
    const newStep = Math.floor(currentTime / stepDuration);
    setCurrentStep(Math.min(newStep, currentSession.steps.length - 1));
  }, [currentTime]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    opacity: waveOpacity.value,
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    setCurrentTime(prev => Math.min(prev + 30, currentSession.duration));
  };

  const handleSkipBack = () => {
    setCurrentTime(prev => Math.max(prev - 30, 0));
  };

  const progress = (currentTime / currentSession.duration) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mindfulness</Text>
        <TouchableOpacity>
          <Volume2 size={24} color={Colors.gray600} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.sessionCard}>
          <Text style={styles.sessionTitle}>{currentSession.title}</Text>
          <Text style={styles.sessionDescription}>{currentSession.description}</Text>
          <Text style={styles.sessionDuration}>
            {formatTime(currentSession.duration)} session
          </Text>
        </View>

        <View style={styles.visualContainer}>
          <Animated.View style={[styles.outerRing, waveStyle]} />
          <Animated.View style={[styles.middleRing, waveStyle]} />
          <Animated.View style={[styles.meditationCircle, pulseStyle]}>
            <View style={styles.innerCircle}>
              <Text style={styles.breatheText}>
                {isPlaying ? 'Breathe' : 'Ready'}
              </Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(currentSession.duration)}</Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Current Step</Text>
          <Text style={styles.stepText}>
            {currentSession.steps[currentStep]}
          </Text>
          <Text style={styles.stepCounter}>
            {currentStep + 1} of {currentSession.steps.length}
          </Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={handleSkipBack}>
            <SkipBack size={24} color={Colors.gray600} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            {isPlaying ? (
              <Pause size={32} color={Colors.white} />
            ) : (
              <Play size={32} color={Colors.white} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleSkipForward}>
            <SkipForward size={24} color={Colors.gray600} />
          </TouchableOpacity>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>🧘‍♀️ Meditation Tips</Text>
          <Text style={styles.tipText}>
            • There's no "perfect" way to meditate{'\n'}
            • It's normal for your mind to wander{'\n'}
            • Gently return focus when you notice distraction{'\n'}
            • Be patient and kind with yourself
          </Text>
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
  sessionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    ...Shadow.small,
  },
  sessionTitle: {
    ...Typography.subtitle,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  sessionDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  sessionDuration: {
    ...Typography.small,
    color: Colors.lavender,
    fontFamily: 'Poppins-SemiBold',
  },
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: Colors.lavender + '40',
  },
  middleRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: Colors.lavender + '60',
  },
  meditationCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.lavender + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.medium,
  },
  breatheText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  progressContainer: {
    marginBottom: Spacing.xl,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.lavender,
    borderRadius: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    ...Typography.small,
    color: Colors.gray600,
    fontFamily: 'Poppins-SemiBold',
  },
  stepContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  stepTitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginBottom: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  stepText: {
    ...Typography.paragraph,
    color: Colors.black,
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  stepCounter: {
    ...Typography.small,
    color: Colors.lavender,
    fontFamily: 'Poppins-SemiBold',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    ...Shadow.small,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.medium,
  },
  tipCard: {
    backgroundColor: Colors.lightLavender,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
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