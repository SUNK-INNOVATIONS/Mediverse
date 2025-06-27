import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import FeelingsComponent from '@/components/FeelingsComponent';
import Slider from '@react-native-community/slider';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import FeelingGrid from '@/components/FeelingsComponent';

const { width } = Dimensions.get('window');

const ITEM_WIDTH = width * 0.41; // 41% of screen width
const ITEM_SPACING = Spacing.md;
const ITEM_TOTAL_WIDTH = ITEM_WIDTH + ITEM_SPACING * 2; // Real width including margin/padding
// Adjusted to center items in the FlatList
const ITEM_MARGIN = Spacing.md; // Margin between items


const emotions = [
  { id: 'shame', label: 'Shame', image: require('@/assets/images/shame-emoji.png') },
  { id: 'sad', label: 'Sad', image: require('@/assets/images/sad-emoji.png') },
  { id: 'angry', label: 'Angry', image: require('@/assets/images/angry-emoji.png') },
  { id: 'happy', label: 'Happy', image: require('@/assets/images/happy-emoji.png') },
];

export default function MoodTrackerScreen() {
  const [selectedEmotionId, setSelectedEmotionId] = useState<string>(emotions[0].id);
  const [discomfortIntensity, setDiscomfortIntensity] = useState<number>(0.5);
  const scrollRef = useRef<FlatList>(null);

  const handleNext = () => {
    router.push('/(tabs)/feelings');
  };

  const selectedEmotion = emotions.find(e => e.id === selectedEmotionId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFill} />
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <X size={24} color={Colors.gray600} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Feelings</Text>
        
        <Text style={styles.questionText}>How did you feel at the moment?</Text>


  {/* Add this */}
  <FeelingGrid onSelect={(feeling: string) => console.log('Selected feeling:', feeling)} />

  <TouchableOpacity
    style={styles.nextButton}
    onPress={handleNext}
  >
    <Text style={styles.nextButtonText}>Next</Text>
  </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
  },
  headerIcon: {
    padding: Spacing.xs,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.lg,
  },
  progressBarFill: {
    width: '50%',
    height: '100%',
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.sm,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  questionText: {
    ...Typography.paragraph,
    color: Colors.black,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  content: {
    flex: 1,
    paddingVertical: Spacing.lg,
  },
  emotionCarousel: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
  },
  emotionOption: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: ITEM_MARGIN,
  },
  emotionImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  selectedEmotionLabel: {
    ...Typography.heading,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  slider: {
    width: '90%',
    alignSelf: 'center',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  sliderLabel: {
    ...Typography.small,
    color: Colors.gray600,
  },
  nextButton: {
    backgroundColor: Colors.purple,
    marginHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadow.medium,
  },
  nextButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
});
