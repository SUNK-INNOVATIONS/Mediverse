import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function SelectedActivityScreen() {
  const [timer, setTimer] = useState(0);
  const [inhale, setInhale] = useState(true);
  const animation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 4000,
 easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
      setInhale((prevInhale) => !prevInhale);
    }, 4000);

    return () => {
      clearInterval(intervalId);
      animation.stopAnimation();
    };
  }, [animation]);

  const orbSize = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 150],
  });

 const handleFinish = () => {
    router.push('/(tabs)/postsupport');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={{ ...styles.progressBarFill, width: '100%' }} />
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <X size={24} color={Colors.gray600} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Breathe with me</Text>
        <Animated.View style={[
          styles.orb,
          {
            width: orbSize,
            height: orbSize,
            borderRadius: orbSize,
          },
        ]} />
        <Text style={styles.timerText}>{inhale ? 'Inhale' : 'Exhale'}</Text>
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinish}
        >
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
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
    height: '100%',
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.sm,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  orb: {
    backgroundColor: Colors.purple,
  },
  timerText: {
    ...Typography.paragraph,
    color: Colors.black,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xxl,
  },
  finishButton: {
    backgroundColor: Colors.purple,
    marginHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadow.medium,
  },
  finishButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
});
