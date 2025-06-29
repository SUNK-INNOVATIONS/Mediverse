import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const BREATHING_PHASES = {
  INHALE: 'Breathe In',
  HOLD: 'Hold',
  EXHALE: 'Breathe Out',
  PAUSE: 'Pause'
};

const PHASE_DURATIONS = {
  INHALE: 4000,
  HOLD: 7000,
  EXHALE: 8000,
  PAUSE: 1000
};

export default function BreathingScreen() {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(BREATHING_PHASES.INHALE);
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const scaleValue = useSharedValue(1);
  const opacityValue = useSharedValue(0.7);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const startBreathingCycle = () => {
    if (isActive) return;
    
    setIsActive(true);
    setCycleCount(0);
    runBreathingPhase(BREATHING_PHASES.INHALE);
  };

  const stopBreathing = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    
    scaleValue.value = withTiming(1, { duration: 500 });
    opacityValue.value = withTiming(0.7, { duration: 500 });
    setCurrentPhase(BREATHING_PHASES.INHALE);
    setTimeRemaining(0);
  };

  const resetBreathing = () => {
    stopBreathing();
    setCycleCount(0);
  };

  const runBreathingPhase = (phase: string) => {
    setCurrentPhase(phase);
    const duration = PHASE_DURATIONS[phase as keyof typeof PHASE_DURATIONS];
    setTimeRemaining(Math.ceil(duration / 1000));

    // Start countdown
    const countdown = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Animate based on phase
    switch (phase) {
      case BREATHING_PHASES.INHALE:
        scaleValue.value = withTiming(1.4, { 
          duration: duration, 
          easing: Easing.inOut(Easing.ease) 
        });
        opacityValue.value = withTiming(1, { duration: duration });
        break;
      case BREATHING_PHASES.HOLD:
        // Keep current scale
        break;
      case BREATHING_PHASES.EXHALE:
        scaleValue.value = withTiming(1, { 
          duration: duration, 
          easing: Easing.inOut(Easing.ease) 
        });
        opacityValue.value = withTiming(0.7, { duration: duration });
        break;
      case BREATHING_PHASES.PAUSE:
        // Keep current scale
        break;
    }

    // Move to next phase
    phaseTimeoutRef.current = setTimeout(() => {
      if (!isActive) return;

      switch (phase) {
        case BREATHING_PHASES.INHALE:
          runBreathingPhase(BREATHING_PHASES.HOLD);
          break;
        case BREATHING_PHASES.HOLD:
          runBreathingPhase(BREATHING_PHASES.EXHALE);
          break;
        case BREATHING_PHASES.EXHALE:
          runBreathingPhase(BREATHING_PHASES.PAUSE);
          break;
        case BREATHING_PHASES.PAUSE:
          setCycleCount(prev => prev + 1);
          runBreathingPhase(BREATHING_PHASES.INHALE);
          break;
      }
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    };
  }, []);

  const getPhaseColor = () => {
    switch (currentPhase) {
      case BREATHING_PHASES.INHALE:
        return Colors.pastelBlue;
      case BREATHING_PHASES.HOLD:
        return Colors.lavender;
      case BREATHING_PHASES.EXHALE:
        return Colors.softMint;
      case BREATHING_PHASES.PAUSE:
        return Colors.yellow;
      default:
        return Colors.pastelBlue;
    }
  };

  const getInstructions = () => {
    switch (currentPhase) {
      case BREATHING_PHASES.INHALE:
        return 'Slowly breathe in through your nose';
      case BREATHING_PHASES.HOLD:
        return 'Hold your breath gently';
      case BREATHING_PHASES.EXHALE:
        return 'Slowly exhale through your mouth';
      case BREATHING_PHASES.PAUSE:
        return 'Rest and prepare for the next breath';
      default:
        return 'Tap play to begin the 4-7-8 breathing technique';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Breathing Exercise</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.techniqueTitle}>4-7-8 Breathing Technique</Text>
          <Text style={styles.techniqueDescription}>
            This technique helps reduce anxiety and promote relaxation by regulating your nervous system
          </Text>
        </View>

        <View style={styles.breathingContainer}>
          <Animated.View 
            style={[
              styles.breathingCircle, 
              { backgroundColor: getPhaseColor() + '40' },
              animatedStyle
            ]}
          >
            <View style={[styles.innerCircle, { backgroundColor: getPhaseColor() }]}>
              {timeRemaining > 0 && (
                <Text style={styles.countdownText}>{timeRemaining}</Text>
              )}
            </View>
          </Animated.View>

          <Text style={styles.phaseText}>{currentPhase}</Text>
          <Text style={styles.instructionText}>{getInstructions()}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{cycleCount}</Text>
            <Text style={styles.statLabel}>Cycles</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{Math.ceil(cycleCount * 0.5)}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          {!isActive ? (
            <TouchableOpacity style={styles.playButton} onPress={startBreathingCycle}>
              <Play size={24} color={Colors.white} />
              <Text style={styles.playButtonText}>Start Breathing</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.pauseButton} onPress={stopBreathing}>
              <Pause size={24} color={Colors.white} />
              <Text style={styles.pauseButtonText}>Pause</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.resetButton} onPress={resetBreathing}>
            <RotateCcw size={20} color={Colors.gray600} />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Breathing Tips</Text>
          <Text style={styles.tipText}>
            • Find a comfortable position{'\n'}
            • Focus on the circle's movement{'\n'}
            • Don't force your breath{'\n'}
            • Practice regularly for best results
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
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  techniqueTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  techniqueDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    lineHeight: 20,
  },
  breathingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.medium,
  },
  countdownText: {
    ...Typography.title,
    color: Colors.white,
    fontFamily: 'Poppins-Bold',
  },
  phaseText: {
    ...Typography.subtitle,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  instructionText: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.title,
    color: Colors.lavender,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    ...Typography.small,
    color: Colors.gray600,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray200,
    marginHorizontal: Spacing.lg,
  },
  controlsContainer: {
    marginBottom: Spacing.xl,
  },
  playButton: {
    backgroundColor: Colors.lavender,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadow.medium,
  },
  playButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  pauseButton: {
    backgroundColor: Colors.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadow.medium,
  },
  pauseButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  resetButton: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.gray200,
  },
  resetButtonText: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
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