import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Mic, TrendingUp } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    icon: Heart,
    title: 'Track Your Mood',
    description: 'Monitor your emotional well-being with our intelligent mood tracking system that learns your patterns.',
    gradient: Colors.gradientPink,
  },
  {
    id: 2,
    icon: MessageCircle,
    title: 'AI Companion',
    description: 'Chat with our empathetic AI assistant that provides personalized support and guidance 24/7.',
    gradient: Colors.gradientPurple,
  },
  {
    id: 3,
    icon: Mic,
    title: 'Voice Analysis',
    description: 'Speak your thoughts and let our voice analysis detect emotional cues to better understand your mental state.',
    gradient: Colors.gradientGreen,
  },
  {
    id: 4,
    icon: TrendingUp,
    title: 'Personal Growth',
    description: 'Get personalized recommendations for meditation, breathing exercises, and wellness content.',
    gradient: Colors.gradientBlue,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      router.replace('/auth/login');
    }
  };

  const handleSkip = () => {
    router.replace('/auth/login');
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.scrollView}
        >
          {onboardingData.map((item) => (
            <View key={item.id} style={styles.slide}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={item.gradient}
                  style={styles.iconGradient}
                >
                  <item.icon size={80} color={Colors.white} strokeWidth={1.5} />
                </LinearGradient>
              </View>
              
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <LinearGradient
              colors={Colors.gradientPurple}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  skipText: {
    ...Typography.secondary,
    color: Colors.gray600,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.huge,
  },
  iconContainer: {
    marginBottom: Spacing.huge,
  },
  iconGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    ...Typography.title,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  description: {
    ...Typography.paragraph,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray300,
    marginHorizontal: Spacing.xs,
  },
  activeDot: {
    backgroundColor: Colors.purple,
    width: 24,
  },
  nextButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  nextButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
});