import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay,
  interpolate
} from 'react-native-reanimated';
import { Colors, BorderRadius, Shadow, Spacing } from '@/constants/theme';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
  index?: number;
}

export default function AnimatedCard({ 
  children, 
  style, 
  delay = 0,
  index = 0 
}: AnimatedCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    const animationDelay = delay + (index * 100);
    
    opacity.value = withDelay(animationDelay, withSpring(1, {
      damping: 20,
      stiffness: 90,
    }));
    
    translateY.value = withDelay(animationDelay, withSpring(0, {
      damping: 20,
      stiffness: 90,
    }));
    
    scale.value = withDelay(animationDelay, withSpring(1, {
      damping: 20,
      stiffness: 90,
    }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadow.medium,
  },
});