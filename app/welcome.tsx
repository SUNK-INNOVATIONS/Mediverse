import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { Heart, Sparkles } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);

  useEffect(() => {
    // Animate logo entrance
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 800, easing: Easing.out(Easing.back(1.7)) }),
      withTiming(1, { duration: 200 })
    );
    logoOpacity.value = withTiming(1, { duration: 800 });
    
    // Animate text entrance
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    buttonOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));

    // Continuous sparkle rotation
    sparkleRotation.value = withTiming(360, { 
      duration: 3000, 
      easing: Easing.linear 
    });
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const handleGetStarted = () => {
    router.push('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Decorative elements */}
        <Animated.View style={[styles.sparkle, styles.sparkle1, sparkleAnimatedStyle]}>
          <Sparkles size={20} color={Colors.lavender} />
        </Animated.View>
        <Animated.View style={[styles.sparkle, styles.sparkle2, sparkleAnimatedStyle]}>
          <Sparkles size={16} color={Colors.softMint} />
        </Animated.View>
        <Animated.View style={[styles.sparkle, styles.sparkle3, sparkleAnimatedStyle]}>
          <Sparkles size={18} color={Colors.pink} />
        </Animated.View>

        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logo}>
            <Heart size={60} color={Colors.white} fill={Colors.white} />
          </View>
        </Animated.View>
        
        {/* Title */}
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={styles.title}>Mediverse</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={[styles.subtitleContainer, subtitleAnimatedStyle]}>
          <Text style={styles.subtitle}>Your mood-aware mental health companion</Text>
        </Animated.View>

        {/* Features preview */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>AI-powered mood detection</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Personalized wellness tools</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>24/7 emotional support</Text>
          </View>
        </View>

        {/* Get Started Button */}
        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Built with ❤️ for your wellbeing</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: height * 0.15,
    right: width * 0.15,
  },
  sparkle2: {
    top: height * 0.25,
    left: width * 0.1,
  },
  sparkle3: {
    bottom: height * 0.3,
    right: width * 0.2,
  },
  logoContainer: {
    marginBottom: Spacing.huge,
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: Colors.lavender,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.large,
  },
  titleContainer: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.title,
    color: Colors.black,
    textAlign: 'center',
  },
  subtitleContainer: {
    marginBottom: Spacing.huge,
  },
  subtitle: {
    ...Typography.paragraph,
    color: Colors.gray600,
    textAlign: 'center',
    maxWidth: 280,
  },
  featuresContainer: {
    marginBottom: Spacing.huge,
    alignItems: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lavender,
    marginRight: Spacing.md,
  },
  featureText: {
    ...Typography.secondary,
    color: Colors.gray700,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  getStartedButton: {
    backgroundColor: Colors.lavender,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadow.medium,
  },
  getStartedText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...Typography.small,
    color: Colors.gray500,
  },
});