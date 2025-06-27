export const Colors = {
  // Primary Colors
  white: '#FFFFFF',
  black: '#010138',
  purple: '#4D4DE9',
  
  // Secondary Colors
  green: '#BDF6CC',
  pink: '#F9B9D9',
  yellow: '#FFDD99',
  
  // Neutrals and Grays
  gray100: '#F8F9FA',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',
  
  // Semantic Colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
};

export const Typography = {
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    fontFamily: 'Inter-Bold',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    fontFamily: 'Inter-Bold',
  },
  paragraph: {
    fontSize: 16,
    fontWeight: '500' as const,
    fontFamily: 'Inter-Medium',
  },
  secondary: {
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily: 'Inter-Medium',
  },
  small: {
    fontSize: 12,
    fontWeight: '500' as const,
    fontFamily: 'Inter-Medium',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 26,
  xxl: 36,
  huge: 70,
  massive: 96,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const Shadow = {
  small: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};