import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 800 }),
      withTiming(1, { duration: 200 })
    );
    logoOpacity.value = withTiming(1, { duration: 800 });
    textOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));

    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🧠</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={styles.title}>Mediverse</Text>
        <Text style={styles.subtitle}>Your Mental Health Companion</Text>
      </Animated.View>

      <View style={styles.madeWithContainer}>
        <Text style={styles.madeWithText}>
          Made with <Text style={styles.bolt}>⚡</Text> Bolt
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  logoContainer: {
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 130,
    height: 130,
    backgroundColor: Colors.purple,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  logoText: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    ...Typography.title,
    color: Colors.black,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    fontSize: 16,
    textAlign: 'center',
  },
  madeWithContainer: {
    position: 'absolute',
    bottom: Spacing.xl,
    alignItems: 'center',
  },
  madeWithText: {
    color: Colors.gray500,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  bolt: {
    color: Colors.purple,
    fontWeight: 'bold',
  },
});
