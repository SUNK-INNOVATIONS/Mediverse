import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, RefreshCw, Heart, Share, Bookmark } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withSpring
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const affirmations = [
  {
    id: 1,
    text: "I am worthy of love and respect, exactly as I am today.",
    category: "Self-Love",
    color: Colors.pink
  },
  {
    id: 2,
    text: "Every challenge I face is an opportunity for growth and learning.",
    category: "Growth",
    color: Colors.green
  },
  {
    id: 3,
    text: "I choose peace over worry and trust in my ability to handle whatever comes.",
    category: "Peace",
    color: Colors.pastelBlue
  },
  {
    id: 4,
    text: "My thoughts are powerful, and I choose to focus on what brings me joy.",
    category: "Positivity",
    color: Colors.yellow
  },
  {
    id: 5,
    text: "I am grateful for this moment and all the possibilities it holds.",
    category: "Gratitude",
    color: Colors.softMint
  },
  {
    id: 6,
    text: "I trust my intuition and make decisions with confidence and clarity.",
    category: "Confidence",
    color: Colors.lavender
  },
  {
    id: 7,
    text: "I release what no longer serves me and embrace positive change.",
    category: "Release",
    color: Colors.orange
  },
  {
    id: 8,
    text: "I am resilient, strong, and capable of overcoming any obstacle.",
    category: "Strength",
    color: Colors.green
  }
];

const categories = [
  { name: 'All', color: Colors.gray600 },
  { name: 'Self-Love', color: Colors.pink },
  { name: 'Growth', color: Colors.green },
  { name: 'Peace', color: Colors.pastelBlue },
  { name: 'Positivity', color: Colors.yellow },
  { name: 'Gratitude', color: Colors.softMint },
  { name: 'Confidence', color: Colors.lavender },
  { name: 'Release', color: Colors.orange },
  { name: 'Strength', color: Colors.green },
];

export default function AffirmationsScreen() {
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const scaleValue = useSharedValue(1);
  const opacityValue = useSharedValue(1);
  const rotationValue = useSharedValue(0);

  useEffect(() => {
    // Animate affirmation entrance
    scaleValue.value = withSequence(
      withTiming(0.9, { duration: 200 }),
      withSpring(1, { damping: 8, stiffness: 100 })
    );
    opacityValue.value = withSequence(
      withTiming(0.5, { duration: 200 }),
      withTiming(1, { duration: 300 })
    );
  }, [currentAffirmation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const refreshAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationValue.value}deg` }],
  }));

  const getRandomAffirmation = () => {
    const filteredAffirmations = selectedCategory === 'All' 
      ? affirmations 
      : affirmations.filter(a => a.category === selectedCategory);
    
    const availableAffirmations = filteredAffirmations.filter(a => a.id !== currentAffirmation.id);
    const randomIndex = Math.floor(Math.random() * availableAffirmations.length);
    return availableAffirmations[randomIndex] || filteredAffirmations[0];
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    rotationValue.value = withTiming(360, { duration: 500 });
    
    setTimeout(() => {
      setCurrentAffirmation(getRandomAffirmation());
      setIsRefreshing(false);
      rotationValue.value = 0;
    }, 500);
  };

  const toggleFavorite = () => {
    setFavorites(prev => 
      prev.includes(currentAffirmation.id)
        ? prev.filter(id => id !== currentAffirmation.id)
        : [...prev, currentAffirmation.id]
    );
  };

  const isFavorite = favorites.includes(currentAffirmation.id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Affirmations</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>✨ Positive Thoughts</Text>
          <Text style={styles.introText}>
            Start your day with intention and self-compassion
          </Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Choose a Focus</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.name && {
                    backgroundColor: category.color + '20',
                    borderColor: category.color,
                  }
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.name && {
                      color: category.color,
                      fontFamily: 'Poppins-SemiBold',
                    }
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Affirmation Card */}
        <Animated.View style={[styles.affirmationCard, animatedStyle]}>
          <View style={[styles.categoryBadge, { backgroundColor: currentAffirmation.color + '20' }]}>
            <Text style={[styles.categoryBadgeText, { color: currentAffirmation.color }]}>
              {currentAffirmation.category}
            </Text>
          </View>

          <Text style={styles.affirmationText}>
            "{currentAffirmation.text}"
          </Text>

          <View style={styles.affirmationActions}>
            <TouchableOpacity 
              style={[styles.actionButton, isFavorite && styles.favoriteButton]}
              onPress={toggleFavorite}
            >
              <Heart 
                size={20} 
                color={isFavorite ? Colors.white : Colors.pink}
                fill={isFavorite ? Colors.white : 'transparent'}
              />
              <Text style={[
                styles.actionButtonText,
                isFavorite && styles.favoriteButtonText
              ]}>
                {isFavorite ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Share size={20} color={Colors.gray600} />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Refresh Button */}
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          <Animated.View style={refreshAnimatedStyle}>
            <RefreshCw size={24} color={Colors.white} />
          </Animated.View>
          <Text style={styles.refreshButtonText}>
            {isRefreshing ? 'Finding new affirmation...' : 'Get New Affirmation'}
          </Text>
        </TouchableOpacity>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <View style={styles.favoritesSection}>
            <Text style={styles.sectionTitle}>Your Saved Affirmations</Text>
            {affirmations
              .filter(a => favorites.includes(a.id))
              .map((affirmation) => (
                <TouchableOpacity
                  key={affirmation.id}
                  style={styles.favoriteItem}
                  onPress={() => setCurrentAffirmation(affirmation)}
                >
                  <View style={[styles.favoriteIndicator, { backgroundColor: affirmation.color }]} />
                  <View style={styles.favoriteContent}>
                    <Text style={styles.favoriteText} numberOfLines={2}>
                      {affirmation.text}
                    </Text>
                    <Text style={[styles.favoriteCategory, { color: affirmation.color }]}>
                      {affirmation.category}
                    </Text>
                  </View>
                  <Bookmark size={16} color={affirmation.color} fill={affirmation.color} />
                </TouchableOpacity>
              ))}
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Affirmation Tips</Text>
          <Text style={styles.tipsText}>
            • Read slowly and mindfully{'\n'}
            • Repeat affirmations that resonate with you{'\n'}
            • Say them out loud for greater impact{'\n'}
            • Practice daily for best results{'\n'}
            • Believe in the words you're speaking
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  introCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  introTitle: {
    ...Typography.subtitle,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  introText: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  categoryChip: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.gray200,
    ...Shadow.small,
  },
  categoryText: {
    ...Typography.small,
    color: Colors.gray600,
  },
  affirmationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.huge,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    ...Shadow.medium,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
  },
  categoryBadgeText: {
    ...Typography.small,
    fontFamily: 'Poppins-SemiBold',
  },
  affirmationText: {
    ...Typography.paragraph,
    color: Colors.black,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: Spacing.xl,
    fontStyle: 'italic',
  },
  affirmationActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
  },
  favoriteButton: {
    backgroundColor: Colors.pink,
  },
  actionButtonText: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  favoriteButtonText: {
    color: Colors.white,
  },
  refreshButton: {
    backgroundColor: Colors.lavender,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
    ...Shadow.medium,
  },
  refreshButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  favoritesSection: {
    marginBottom: Spacing.xl,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.small,
  },
  favoriteIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteText: {
    ...Typography.secondary,
    color: Colors.black,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  favoriteCategory: {
    ...Typography.small,
    fontFamily: 'Poppins-SemiBold',
  },
  tipsCard: {
    backgroundColor: Colors.lightLavender,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.huge,
    borderLeftWidth: 4,
    borderLeftColor: Colors.lavender,
  },
  tipsTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  tipsText: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
  },
});