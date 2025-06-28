import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import RandomGradient from '@/components/RandomGradient';

const calmingColors = ['#a8dadc', '#457b9d', '#1d3557', '#f1faee'];

export default function BreathingExerciseScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [step, setStep] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
useEffect(() => {
  let mounted = true;

  const loop = () => {
    if (!mounted) return;

    setStep('Inhale');
    Animated.timing(scaleAnim, {
      toValue: 1.4,
      duration: 4000, // Inhale: 4 seconds
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setStep('Hold');
      setTimeout(() => {
        setStep('Exhale');
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 8000, // Exhale: 8 seconds
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          setTimeout(loop, 1000); // Optional 1-second pause before repeating
        });
      }, 7000); // Hold: 7 seconds
    });
  };

  loop();

  return () => {
    mounted = false;
  };
}, []);


  const handleNext = () => {
    router.push('/(tabs)/context');
  };

  return (
    <View style={{ flex: 1 }}>
      <RandomGradient />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
            <ArrowLeft size={24} color={Colors.black} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
            <X size={24} color={Colors.gray600} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={{ position: 'relative', width: 220, height: 220, alignItems: 'center', justifyContent: 'center' }}>
            {/* Outermost circle */}
            <Animated.View
              style={[
          {
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: 110,
            opacity: 0.18,
            zIndex: 1,
            backgroundColor: Colors.purple + '33',
            overflow: 'hidden',
            transform: [{ scale: Animated.multiply(scaleAnim, 1.2) }],
            // mixBlendMode: 'screen', // ignored on native
          },
              ]}
            >
              <RandomGradient />
            </Animated.View>
            {/* Middle circle */}
            <Animated.View
              style={[
          {
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            opacity: 0.28,
            zIndex: 2,
            backgroundColor: Colors.purple + '55',
            overflow: 'hidden',
            transform: [{ scale: Animated.multiply(scaleAnim, 1.1) }],
            // mixBlendMode: 'screen',
          },
              ]}
            >
              <RandomGradient />
            </Animated.View>
            {/* Innermost circle */}
            <Animated.View
              style={[
          {
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: 90,
            opacity: 0.7,
            zIndex: 3,
            backgroundColor: Colors.purple + '99',
            overflow: 'hidden',
            transform: [{ scale: scaleAnim }],
            // mixBlendMode: 'screen',
          },
          styles.pulseCircle,
              ]}
            >
              <RandomGradient />
            </Animated.View>
          </View>
          <Text style={styles.stepText}>{step}</Text>
          <Text style={styles.instruction}>Follow the rhythm of your breath</Text>
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: 'transparent',
  },
  headerIcon: {
    padding: Spacing.xs,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.lg,
  },
  progressBarFill: {
    width: '50%',
    height: '100%',
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.sm,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.purple, // translucent purple
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  stepText: {
    ...Typography.heading,
    marginTop: Spacing.xxl,
    color: Colors.black,
    letterSpacing: 1,
    textAlign: 'center',
  },
  instruction: {
    ...Typography.secondary,
    marginTop: Spacing.md,
    color: Colors.gray600,
    textAlign: 'center',
    maxWidth: 260,
  },
  nextButton: {
    backgroundColor: Colors.purple,
    marginHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadow.medium,
  },
  nextButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
});
