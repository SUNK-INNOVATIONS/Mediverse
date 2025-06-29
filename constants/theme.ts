export const Colors = {
  // Primary Colors - Updated for Mediverse
  white: '#FFFFFF',
  black: '#2D3748',
  primary: '#6C63FF', // Lavender
  
  // Calming palette
  lavender: '#6C63FF',
  softMint: '#B8F2E6',
  pastelBlue: '#AED9E0',
  lightLavender: '#E6E3FF',
  warmGray: '#F5F5F5',
  
  // Secondary Colors
  green: '#68D391',
  pink: '#F687B3',
  yellow: '#F6E05E',
  orange: '#FBB6CE',
  
  // Neutrals and Grays
  gray50: '#F9FAFB',
  gray100: '#F7FAFC',
  gray200: '#EDF2F7',
  gray300: '#E2E8F0',
  gray400: '#CBD5E0',
  gray500: '#A0AEC0',
  gray600: '#718096',
  gray700: '#4A5568',
  gray800: '#2D3748',
  gray900: '#1A202C',
  
  // Semantic Colors
  success: '#48BB78',
  warning: '#ED8936',
  error: '#F56565',
  info: '#4299E1',
};

export const Typography = {
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    fontFamily: 'Poppins-Bold',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600' as const,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 32,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600' as const,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 28,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: 'Nunito-Regular',
    lineHeight: 24,
  },
  secondary: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: 'Nunito-Regular',
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: 'Nunito-Regular',
    lineHeight: 16,
  },
  caption: {
    fontSize: 10,
    fontWeight: '400' as const,
    fontFamily: 'Nunito-Regular',
    lineHeight: 14,
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
  round: 50,
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