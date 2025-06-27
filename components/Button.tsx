import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      default:
        baseStyle.push(styles.primary);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.secondaryText);
        break;
      case 'outline':
        baseStyle.push(styles.outlineText);
        break;
      default:
        baseStyle.push(styles.primaryText);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  
  // Sizes
  small: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  medium: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  large: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.purple,
  },
  secondary: {
    backgroundColor: Colors.gray200,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.purple,
  },
  disabled: {
    backgroundColor: Colors.gray400,
    opacity: 0.6,
  },
  
  // Text styles
  text: {
    fontFamily: 'Indivisible-Bold',
    textAlign: 'center',
  },
  smallText: {
    ...Typography.small,
  },
  mediumText: {
    ...Typography.secondary,
  },
  largeText: {
    ...Typography.paragraph,
  },
  
  // Text colors
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.black,
  },
  outlineText: {
    color: Colors.purple,
  },
  disabledText: {
    color: Colors.gray600,
  },
});