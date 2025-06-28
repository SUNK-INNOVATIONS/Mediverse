import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence
} from 'react-native-reanimated';
import { Colors, Shadow } from '@/constants/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function FloatingActionButton({ 
  onPress, 
  children, 
  style,
  colors = Colors.gradientPurple 
}: FloatingActionButtonProps) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 15, stiffness: 200 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle, style]}
      onPress={handlePress}
      activeOpacity={0.8}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    borderRadius: 28,
    ...Shadow.large,
    // Ensure proper elevation on Android
    elevation: Platform.OS === 'android' ? 8 : undefined,
  },
  gradient: {
    flex: 1,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});