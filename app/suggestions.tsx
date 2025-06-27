import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Play, Music, Wind, Heart, Clock } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const suggestions = [
  {
    id: 1,
    category: 'meditation',
    title: '5-Minute Morning Meditation',
    description: 'Start your day with mindfulness and positive energy',
    duration: '5 min',
    image: 'https://images.pexels.com/photos/3094230/pexels-photo-3094230.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Heart,
    color: Colors.green,
  },
  {
    id: 2,
    category: 'breathing',
    title: '4-7-8 Breathing Exercise',
    description: 'Reduce anxiety and promote relaxation with this proven technique',
    duration: '3 min',
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Wind,
    color: Colors.purple,
  },
  {
    id: 3,
    category: 'music',
    title: 'Calming Nature Sounds',
    description: 'Peaceful sounds to help you relax and focus',
    duration: '15 min',
    image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Music,
    color: Colors.yellow,
  },
  {
    id: 4,
    category: 'meditation',
    title: 'Body Scan Meditation',
    description: 'Release tension and connect with your body',
    duration: '10 min',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Heart,
    color: Colors.green,
  },
  {
    id: 5,
    category: 'breathing',
    title: 'Box Breathing',
    description: 'Military-grade technique for stress management',
    duration: '4 min',
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Wind,
    color: Colors.purple,
  },
  {
    id: 6,
    category: 'music',
    title: 'Binaural Beats for Focus',
    description: 'Enhance concentration and mental clarity',
    duration: '20 min',
    image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Music,
    color: Colors.yellow,
  },
];

const categories = [
  { id: 'all', label: 'All', color: Colors.gray600 },
  { id: 'meditation', label: 'Meditation', color: Colors.green },
  { id: 'breathing', label: 'Breathing', color: Colors.purple },
  { id: 'music', label: 'Music', color: Colors.yellow },
];

export default function SuggestionsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  const handlePlaySuggestion = (suggestion: any) => {
    // In a real app, this would start the meditation/breathing exercise/music
    console.log('Playing:', suggestion.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wellness Suggestions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Personalized for You</Text>
          <Text style={styles.introText}>
            Based on your mood and preferences, here are some activities to help you feel better.
          </Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && {
                    backgroundColor: category.color + '20',
                    borderColor: category.color,
                  }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && {
                      color: category.color,
                      fontFamily: 'Indivisible-Bold',
                    }
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Suggestions List */}
        <View style={styles.suggestionsContainer}>
          {filteredSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestionCard}
              onPress={() => handlePlaySuggestion(suggestion)}
            >
              <Image source={{ uri: suggestion.image }} style={styles.suggestionImage} />
              
              <View style={styles.suggestionOverlay}>
                <View style={[styles.playButton, { backgroundColor: suggestion.color }]}>
                  <Play size={16} color={Colors.white} />
                </View>
              </View>

              <View style={styles.suggestionContent}>
                <View style={styles.suggestionHeader}>
                  <View style={styles.suggestionMeta}>
                    <suggestion.icon size={16} color={suggestion.color} />
                    <Text style={[styles.categoryLabel, { color: suggestion.color }]}>
                      {suggestion.category.charAt(0).toUpperCase() + suggestion.category.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.durationContainer}>
                    <Clock size={14} color={Colors.gray500} />
                    <Text style={styles.durationText}>{suggestion.duration}</Text>
                  </View>
                </View>

                <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Daily Wellness Tip</Text>
          <Text style={styles.tipText}>
            Try the 5-4-3-2-1 grounding technique: Notice 5 things you can see, 4 you can touch, 
            3 you can hear, 2 you can smell, and 1 you can taste. This helps bring you into the present moment.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
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
  },
  introCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadow.small,
  },
  introTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  introText: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
  categoryContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  categoryChip: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.gray300,
    ...Shadow.small,
  },
  categoryText: {
    ...Typography.small,
    color: Colors.gray600,
  },
  suggestionsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  suggestionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadow.medium,
  },
  suggestionImage: {
    width: '100%',
    height: 160,
  },
  suggestionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.large,
  },
  suggestionContent: {
    padding: Spacing.lg,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  suggestionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    ...Typography.small,
    fontFamily: 'Indivisible-Bold',
    marginLeft: Spacing.xs,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    ...Typography.small,
    color: Colors.gray500,
    marginLeft: Spacing.xs,
  },
  suggestionTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
    marginBottom: Spacing.sm,
  },
  suggestionDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: Colors.yellow + '20',
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.yellow,
  },
  tipTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
    marginBottom: Spacing.sm,
  },
  tipText: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
  },
});