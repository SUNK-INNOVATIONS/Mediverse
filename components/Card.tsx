import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Shadow, Spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
  boxShadow?: keyof typeof Shadow;
}

export default function Card({ 
  children, 
  style, 
  padding = 'lg',
  boxShadow = 'small' 
}: CardProps) {
  return (
    <View style={[
      styles.card,
      { padding: Spacing[padding] },
      Shadow[boxShadow],
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
  },
});
