import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export const Colors = {
  // Primary Colors
  white: '#FFFFFF',
  black: '#0A0A0B',
  purple: '#6366F1',
  
  // Secondary Colors
  green: '#10B981',
  pink: '#EC4899',
  yellow: '#F59E0B',
  blue: '#3B82F6',
  
  // Neutrals and Grays
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Gradients
  gradientPurple: ['#8B5CF6', '#6366F1'],
  gradientBlue: ['#3B82F6', '#1D4ED8'],
  gradientGreen: ['#10B981', '#059669'],
  gradientPink: ['#EC4899', '#BE185D'],
};

export const Typography = {
  title: {
    fontSize: isSmallScreen ? 28 : 32,
    fontWeight: '700' as const,
    fontFamily: 'Inter-Bold',
    lineHeight: isSmallScreen ? 36 : 40,
  },
  subtitle: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: '600' as const,
    fontFamily: 'Inter-Bold',
    lineHeight: isSmallScreen ? 28 : 32,
  },
  heading: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '600' as const,
    fontFamily: 'Inter-Bold',
    lineHeight: isSmallScreen ? 24 : 28,
  },
  paragraph: {
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '500' as const,
    fontFamily: 'Inter-Medium',
    lineHeight: isSmallScreen ? 22 : 24,
  },
  secondary: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '500' as const,
    fontFamily: 'Inter-Medium',
    lineHeight: isSmallScreen ? 18 : 20,
  },
  small: {
    fontSize: isSmallScreen ? 11 : 12,
    fontWeight: '500' as const,
    fontFamily: 'Inter-Medium',
    lineHeight: isSmallScreen ? 14 : 16,
  },
  caption: {
    fontSize: isSmallScreen ? 10 : 11,
    fontWeight: '400' as const,
    fontFamily: 'Inter-Regular',
    lineHeight: isSmallScreen ? 12 : 14,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  huge: 32,
  massive: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadow = {
  small: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
  },
};

export const Animation = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Mobile-specific constants
export const Mobile = {
  isSmallScreen,
  minTouchTarget: 44,
  safeHitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
};