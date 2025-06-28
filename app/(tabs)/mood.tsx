import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, X, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;
const ITEM_WIDTH = width * (isSmallScreen ? 0.8 : 0.7);
const ITEM_SPACING = Spacing.lg;

const emotions = [
  { 
    id: 'happy', 
    label: 'Happy', 
    image: require('@/assets/images/happy-emoji.png'),
    color: Colors.green,
    description: 'Feeling joyful and content'
  },
  { 
    id: 'sad', 
    label: 'Sad', 
    image: require('@/assets/images/sad-emoji.png'),
    color: Colors.blue,
    description: 'Feeling down or melancholy'
  },
  { 
    id: 'angry', 
    label: 'Angry', 
    image: require('@/assets/images/angry-emoji.png'),
    color: Colors.error,
    description: 'Feeling frustrated or upset'
  },
  { 
    id: 'anxious', 
    label: 'Anxious', 
    image: require('@/assets/images/shame-emoji.png'),
    color: Colors.yellow,
    description: 'Feeling worried or nervous'
  },
];

export default function MoodTrackerScreen() {
  const [selectedEmotionId, setSelectedEmotionId] = useState<string>(emotions[0].id);
  const [intensity, setIntensity] = useState<number>(0.5);
  const scrollRef = useRef<FlatList>(null);
  const progressValue = useSharedValue(0.25);

  const selectedEmotion = emotions.find(e => e.id === selectedEmotionId);

  const handleNext = () => {
    router.push('/(tabs)/context');
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const renderEmotionItem = ({ item, index }: { item: typeof emotions[0], index: number }) => {
    const isSelected = item.id === selectedEmotionId;
    
    return (
      <TouchableOpacity
        style={[styles.emotionCard, { width: ITEM_WIDTH }]}
        onPress={() => {
          setSelectedEmotionId(item.id);
          scrollRef?.current?.scrollToIndex({ index, animated: true });
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isSelected ? [item.color + '20', item.color + '10'] : [Colors.gray50, Colors.white]}
          style={[styles.emotionGradient, isSelected && { borderColor: item.color, borderWidth: 2 }]}
        >
          <View style={styles.emotionImageContainer}>
            <Image source={item.image} style={styles.emotionImage} />
          </View>
          <Text style={[styles.emotionLabel, isSelected && { color: item.color }]}>
            {item.label}
          </Text>
          <Text style={styles.emotionDescription}>
            {item.description}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FAFBFF', '#F0F4FF']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.headerButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={Colors.black} />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, progressStyle]} />
            </View>
            <Text style={styles.progressText}>Step 1 of 4</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.headerButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={24} color={Colors.gray600} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>How are you feeling?</Text>
            <Text style={styles.subtitle}>
              Select the emotion that best describes your current state
            </Text>
          </View>

          {/* Emotions Carousel */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={scrollRef}
              data={emotions}
              renderItem={renderEmotionItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH + ITEM_SPACING}
              decelerationRate="fast"
              contentContainerStyle={styles.carouselContent}
              scrollEventThrottle={16}
              onMomentumScrollEnd={(e) => {
                const offset = e.nativeEvent.contentOffset.x;
                const index = Math.round(offset / (ITEM_WIDTH + ITEM_SPACING));
                if (emotions[index]) {
                  setSelectedEmotionId(emotions[index].id);
                }
              }}
            />
          </View>

          {/* Intensity Slider */}
          <View style={styles.intensitySection}>
            <Text style={styles.intensityTitle}>Intensity Level</Text>
            <Text style={styles.intensitySubtitle}>
              How strongly are you feeling this emotion?
            </Text>
            
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={intensity}
                onValueChange={setIntensity}
                minimumTrackTintColor={selectedEmotion?.color || Colors.purple}
                maximumTrackTintColor={Colors.gray300}
                thumbTintColor={selectedEmotion?.color || Colors.purple}
                thumbStyle={styles.sliderThumb}
                trackStyle={styles.sliderTrack}
              />
              
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Low</Text>
                <Text style={[styles.intensityValue, { color: selectedEmotion?.color }]}>
                  {Math.round(intensity * 100)}%
                </Text>
                <Text style={styles.sliderLabel}>High</Text>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: selectedEmotion?.color || Colors.purple }]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <ChevronRight size={20} color={Colors.white} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.small,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: 2,
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.purple,
    borderRadius: 2,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.gray600,
    fontSize: isSmallScreen ? 10 : 11,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? Spacing.xl : Spacing.huge,
    paddingHorizontal: Spacing.md,
  },
  title: {
    ...Typography.title,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontSize: isSmallScreen ? 28 : 32,
  },
  subtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: isSmallScreen ? 13 : 14,
  },
  carouselContainer: {
    marginBottom: isSmallScreen ? Spacing.xl : Spacing.huge,
  },
  carouselContent: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
  },
  emotionCard: {
    marginHorizontal: ITEM_SPACING / 2,
  },
  emotionGradient: {
    padding: isSmallScreen ? Spacing.lg : Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    backgroundColor: Colors.white,
    ...Shadow.medium,
    minHeight: isSmallScreen ? 200 : 240,
    justifyContent: 'center',
  },
  emotionImageContainer: {
    width: isSmallScreen ? 80 : 100,
    height: isSmallScreen ? 80 : 100,
    borderRadius: isSmallScreen ? 40 : 50,
    backgroundColor: Colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emotionImage: {
    width: isSmallScreen ? 60 : 80,
    height: isSmallScreen ? 60 : 80,
    resizeMode: 'contain',
  },
  emotionLabel: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.sm,
    fontSize: isSmallScreen ? 18 : 20,
  },
  emotionDescription: {
    ...Typography.small,
    color: Colors.gray600,
    textAlign: 'center',
    fontSize: isSmallScreen ? 11 : 12,
    lineHeight: isSmallScreen ? 16 : 18,
  },
  intensitySection: {
    marginBottom: isSmallScreen ? Spacing.xl : Spacing.huge,
  },
  intensityTitle: {
    ...Typography.heading,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontSize: isSmallScreen ? 18 : 20,
  },
  intensitySubtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    fontSize: isSmallScreen ? 13 : 14,
  },
  sliderContainer: {
    backgroundColor: Colors.white,
    padding: isSmallScreen ? Spacing.lg : Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadow.small,
  },
  slider: {
    width: '100%',
    height: Platform.OS === 'ios' ? 40 : 50,
  },
  sliderThumb: {
    width: Platform.OS === 'android' ? 20 : undefined,
    height: Platform.OS === 'android' ? 20 : undefined,
  },
  sliderTrack: {
    height: Platform.OS === 'android' ? 6 : undefined,
    borderRadius: Platform.OS === 'android' ? 3 : undefined,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  sliderLabel: {
    ...Typography.small,
    color: Colors.gray600,
    fontSize: isSmallScreen ? 11 : 12,
  },
  intensityValue: {
    ...Typography.paragraph,
    fontFamily: 'Inter-Bold',
    fontSize: isSmallScreen ? 15 : 16,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallScreen ? Spacing.md : Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadow.medium,
    gap: Spacing.sm,
    minHeight: 50, // Minimum touch target
  },
  continueButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: isSmallScreen ? 15 : 16,
  },
});