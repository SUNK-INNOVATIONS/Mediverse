import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { Colors, Typography, Spacing } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);
  const particleAnimations = Array.from({ length: 6 }, () => ({
    x: useSharedValue(Math.random() * width),
    y: useSharedValue(Math.random() * height),
    scale: useSharedValue(0),
    opacity: useSharedValue(0),
  }));

  useEffect(() => {
    // Background fade in
    backgroundOpacity.value = withTiming(1, { duration: 800 });

    // Particles animation
    particleAnimations.forEach((particle, index) => {
      particle.scale.value = withDelay(
        index * 200,
        withSpring(1, { damping: 15, stiffness: 100 })
      );
      particle.opacity.value = withDelay(
        index * 200,
        withTiming(0.6, { duration: 800 })
      );
    });

    // Logo entrance
    logoScale.value = withDelay(
      400,
      withSequence(
        withSpring(1.2, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      )
    );
    logoOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    
    // Text entrance
    textOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));

    // Navigate to onboarding
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      {
        translateY: interpolate(
          textOpacity.value,
          [0, 1],
          [20, 0]
        )
      }
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, backgroundStyle]}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Floating Particles */}
      {particleAnimations.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              left: particle.x.value,
              top: particle.y.value,
            },
            useAnimatedStyle(() => ({
              transform: [{ scale: particle.scale.value }],
              opacity: particle.opacity.value,
            })),
          ]}
        />
      ))}
      
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
            style={styles.logo}
          >
            <Text style={styles.logoText}>🧠</Text>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Text style={styles.title}>Mediverse</Text>
          <Text style={styles.subtitle}>Your Mental Health Companion</Text>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.purple,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.huge,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
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
    color: Colors.white,
    marginBottom: Spacing.sm,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    ...Typography.secondary,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  particle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});