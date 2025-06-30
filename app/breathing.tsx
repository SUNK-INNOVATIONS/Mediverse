// File: BreathingScreen.tsx

import { useEffect, useRef, useState, useCallback } from 'react';
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
  Easing,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import RandomGradient from '@/components/RandomGradient';

const BREATHING_PHASES = {
  INHALE: 'Breathe In',
  HOLD: 'Hold',
  EXHALE: 'Breathe Out',
  PAUSE: 'Pause',
};

const PHASE_ORDER = [
  BREATHING_PHASES.INHALE,
  BREATHING_PHASES.HOLD,
  BREATHING_PHASES.EXHALE,
  BREATHING_PHASES.PAUSE,
];

const PHASE_DURATIONS = {
  [BREATHING_PHASES.INHALE]: 4,
  [BREATHING_PHASES.HOLD]: 7,
  [BREATHING_PHASES.EXHALE]: 8,
  [BREATHING_PHASES.PAUSE]: 1,
};

export default function BreathingScreen() {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(BREATHING_PHASES.INHALE);
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(PHASE_DURATIONS[BREATHING_PHASES.INHALE]);

  const scaleValue = useSharedValue(1);
  const opacityValue = useSharedValue(0.7);
  const gradientOpacity = useSharedValue(0.3);
  const controlsScale = useSharedValue(1);
  const controlsOpacity = useSharedValue(1);

  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const animatePhase = (phase: string, durationMs: number) => {
    switch (phase) {
      case BREATHING_PHASES.INHALE:
        scaleValue.value = withTiming(1.4, { duration: durationMs, easing: Easing.inOut(Easing.ease) });
        opacityValue.value = withTiming(1, { duration: durationMs });
        gradientOpacity.value = withTiming(0.8, { duration: durationMs });
        break;
      case BREATHING_PHASES.HOLD:
        gradientOpacity.value = withSequence(
          withTiming(0.6, { duration: durationMs / 2 }),
          withTiming(0.8, { duration: durationMs / 2 }),
        );
        break;
      case BREATHING_PHASES.EXHALE:
        scaleValue.value = withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.ease) });
        opacityValue.value = withTiming(0.7, { duration: durationMs });
        gradientOpacity.value = withTiming(0.4, { duration: durationMs });
        break;
      case BREATHING_PHASES.PAUSE:
        gradientOpacity.value = withTiming(0.3, { duration: durationMs });
        break;
    }
  };

  const startCountdown = useCallback((duration: number) => {
    setTimeRemaining(duration);
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);

    const tick = (time: number) => {
      if (time > 0) {
        countdownTimerRef.current = setTimeout(() => {
          setTimeRemaining(t => t - 1);
          tick(time - 1);
        }, 1000);
      }
    };

    tick(duration);
  }, []);

  const runNextPhase = useCallback((current: string) => {
    const nextIndex = (PHASE_ORDER.indexOf(current) + 1) % PHASE_ORDER.length;
    const nextPhase = PHASE_ORDER[nextIndex];

    if (nextPhase === BREATHING_PHASES.INHALE) {
      setCycleCount(prev => prev + 1);
    }

    runPhase(nextPhase);
  }, []);

  const runPhase = useCallback((phase: string) => {
    if (!isActive) return;

    setCurrentPhase(phase);
    const duration = PHASE_DURATIONS[phase];
    const durationMs = duration * 1000;

    startCountdown(duration);
    animatePhase(phase, durationMs);

    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    phaseTimerRef.current = setTimeout(() => {
      runNextPhase(phase);
    }, durationMs);
  }, [isActive, startCountdown, runNextPhase]);

  const startBreathingCycle = () => {
    if (isActive) return;

    setIsActive(true);
    setCycleCount(0);
    controlsScale.value = withTiming(0.7, { duration: 800 });
    controlsOpacity.value = withTiming(0.6, { duration: 800 });

    runPhase(BREATHING_PHASES.INHALE);
  };

  const stopBreathing = () => {
    setIsActive(false);
    clearTimeout(countdownTimerRef.current!);
    clearTimeout(phaseTimerRef.current!);

    setTimeRemaining(0);
    setCurrentPhase(BREATHING_PHASES.INHALE);

    scaleValue.value = withTiming(1, { duration: 500 });
    opacityValue.value = withTiming(0.7, { duration: 500 });
    gradientOpacity.value = withTiming(0.3, { duration: 500 });
    controlsScale.value = withTiming(1, { duration: 800 });
    controlsOpacity.value = withTiming(1, { duration: 800 });
  };

  const resetBreathing = () => {
    stopBreathing();
    setCycleCount(0);
  };

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const gradientAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gradientOpacity.value,
  }));

  const controlsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: controlsScale.value }],
    opacity: controlsOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, gradientAnimatedStyle]}>
        <RandomGradient />
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Breathing Exercise</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          {!isActive && (
            <View style={styles.infoCard}>
              <Text style={styles.techniqueTitle}>4-7-8 Breathing Technique</Text>
              <Text style={styles.techniqueDescription}>
                This technique helps reduce anxiety and promote relaxation by regulating your nervous system
              </Text>
            </View>
          )}

          <View style={styles.breathingContainer}>
            <Animated.View style={[
              styles.breathingCircle,
              { backgroundColor: getPhaseColor() + '40' },
              animatedStyle
            ]}>
              <View style={[styles.innerCircle, { backgroundColor: getPhaseColor() }]}>
                {timeRemaining > 0 && (
                  <Text style={styles.countdownText}>{timeRemaining}</Text>
                )}
              </View>
            </Animated.View>

            <Text style={styles.phaseText}>{currentPhase}</Text>
            <Text style={styles.instructionText}>{getInstructions()}</Text>
          </View>

          <Animated.View style={[styles.statsContainer, controlsAnimatedStyle]}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{cycleCount}</Text>
              <Text style={styles.statLabel}>Cycles</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {cycleCount * Object.values(PHASE_DURATIONS).reduce((a, b) => a + b, 0)}
              </Text>
              <Text style={styles.statLabel}>Seconds</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.controlsContainer, controlsAnimatedStyle]}>
            {!isActive ? (
              <TouchableOpacity style={styles.playButton} onPress={startBreathingCycle}>
                <Play size={24} color={Colors.white} />
                <Text style={styles.playButtonText}>Start Breathing</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.pauseButton} onPress={stopBreathing}>
                <Pause size={20} color={Colors.white} />
                <Text style={styles.pauseButtonText}>Pause</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.resetButton} onPress={resetBreathing}>
              <RotateCcw size={16} color={Colors.gray600} />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </Animated.View>

          {!isActive && (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>💡 Breathing Tips</Text>
              <Text style={styles.tipText}>
                • Find a comfortable position{'\n'}
                • Focus on the circle's movement{'\n'}
                • Don't force your breath{'\n'}
                • Practice regularly for best results
              </Text>
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    flex: 1,
    justifyContent: 'center',
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
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  instructionText: {
    ...Typography.secondary,
    color: Colors.gray700,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.heading,
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
    marginHorizontal: Spacing.md,
  },
  controlsContainer: {
    marginBottom: Spacing.lg,
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
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadow.medium,
  },
  pauseButtonText: {
    ...Typography.secondary,
    color: Colors.white,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  resetButtonText: {
    ...Typography.small,
    color: Colors.gray600,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
