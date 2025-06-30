import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Bot, Heart, Brain, Sparkles, Zap } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const personalities = [
  {
    id: 'empathetic',
    name: 'Empathetic',
    description: 'Warm, understanding, and emotionally supportive',
    icon: Heart,
    color: Colors.pink,
    traits: ['Compassionate', 'Patient', 'Validating'],
  },
  {
    id: 'wise',
    name: 'Wise Mentor',
    description: 'Thoughtful guidance with gentle wisdom',
    icon: Brain,
    color: Colors.lavender,
    traits: ['Insightful', 'Reflective', 'Guiding'],
  },
  {
    id: 'cheerful',
    name: 'Cheerful Friend',
    description: 'Upbeat and encouraging with positive energy',
    icon: Sparkles,
    color: Colors.yellow,
    traits: ['Optimistic', 'Energetic', 'Motivating'],
  },
  {
    id: 'calm',
    name: 'Calm Presence',
    description: 'Peaceful and grounding with steady support',
    icon: Zap,
    color: Colors.pastelBlue,
    traits: ['Peaceful', 'Steady', 'Grounding'],
  },
];

const avatars = [
  { id: 'friendly', emoji: '😊', name: 'Friendly' },
  { id: 'wise', emoji: '🧠', name: 'Wise' },
  { id: 'caring', emoji: '💙', name: 'Caring' },
  { id: 'peaceful', emoji: '🌸', name: 'Peaceful' },
  { id: 'bright', emoji: '✨', name: 'Bright' },
  { id: 'nature', emoji: '🌿', name: 'Nature' },
];

const voiceStyles = [
  { id: 'soft', name: 'Soft & Gentle', description: 'Soothing and calm tone' },
  { id: 'warm', name: 'Warm & Friendly', description: 'Approachable and kind' },
  { id: 'professional', name: 'Professional', description: 'Clear and structured' },
  { id: 'casual', name: 'Casual & Relaxed', description: 'Easy-going and natural' },
];

export default function BotCustomizationScreen() {
  const [botName, setBotName] = useState('Alex');
  const [selectedPersonality, setSelectedPersonality] = useState('empathetic');
  const [selectedAvatar, setSelectedAvatar] = useState('friendly');
  const [selectedVoice, setSelectedVoice] = useState('soft');

  const handleSave = () => {
    // Save customization settings
    console.log('Saving bot customization:', {
      name: botName,
      personality: selectedPersonality,
      avatar: selectedAvatar,
      voice: selectedVoice,
    });
    router.back();
  };

  const selectedPersonalityData = personalities.find(p => p.id === selectedPersonality);
  const selectedAvatarData = avatars.find(a => a.id === selectedAvatar);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customize Your AI</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Preview */}
        <View style={styles.previewSection}>
          <View style={styles.previewCard}>
            <View style={[
              styles.previewAvatar, 
              { backgroundColor: selectedPersonalityData?.color + '20' }
            ]}>
              <Text style={styles.previewEmoji}>
                {selectedAvatarData?.emoji}
              </Text>
            </View>
            <Text style={styles.previewName}>{botName}</Text>
            <Text style={styles.previewPersonality}>
              {selectedPersonalityData?.name}
            </Text>
            <View style={styles.previewTraits}>
              {selectedPersonalityData?.traits.map((trait, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.traitTag, 
                    { backgroundColor: selectedPersonalityData.color + '20' }
                  ]}
                >
                  <Text style={[
                    styles.traitText, 
                    { color: selectedPersonalityData.color }
                  ]}>
                    {trait}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Bot Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Companion Name</Text>
          <TextInput
            style={styles.nameInput}
            value={botName}
            onChangeText={setBotName}
            placeholder="Enter a name for your AI companion"
            placeholderTextColor={Colors.gray500}
          />
        </View>

        {/* Personality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personality</Text>
          <Text style={styles.sectionDescription}>
            Choose how your AI companion communicates and supports you
          </Text>
          
          {personalities.map((personality) => (
            <TouchableOpacity
              key={personality.id}
              style={[
                styles.personalityCard,
                selectedPersonality === personality.id && styles.selectedCard,
                { borderColor: personality.color + '40' }
              ]}
              onPress={() => setSelectedPersonality(personality.id)}
            >
              <View style={styles.personalityHeader}>
                <View style={[
                  styles.personalityIcon, 
                  { backgroundColor: personality.color + '20' }
                ]}>
                  <personality.icon size={20} color={personality.color} />
                </View>
                <View style={styles.personalityInfo}>
                  <Text style={styles.personalityName}>{personality.name}</Text>
                  <Text style={styles.personalityDescription}>
                    {personality.description}
                  </Text>
                </View>
                {selectedPersonality === personality.id && (
                  <View style={[styles.selectedIndicator, { backgroundColor: personality.color }]}>
                    <Bot size={16} color={Colors.white} />
                  </View>
                )}
              </View>
              
              <View style={styles.personalityTraits}>
                {personality.traits.map((trait, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.traitChip, 
                      { backgroundColor: personality.color + '10' }
                    ]}
                  >
                    <Text style={[styles.traitChipText, { color: personality.color }]}>
                      {trait}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Avatar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avatar</Text>
          <Text style={styles.sectionDescription}>
            Pick a visual representation for your AI companion
          </Text>
          
          <View style={styles.avatarGrid}>
            {avatars.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarOption,
                  selectedAvatar === avatar.id && styles.selectedAvatar
                ]}
                onPress={() => setSelectedAvatar(avatar.id)}
              >
                <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                <Text style={styles.avatarName}>{avatar.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Voice Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Style</Text>
          <Text style={styles.sectionDescription}>
            Choose the tone and style for voice interactions
          </Text>
          
          {voiceStyles.map((voice) => (
            <TouchableOpacity
              key={voice.id}
              style={[
                styles.voiceCard,
                selectedVoice === voice.id && styles.selectedVoiceCard
              ]}
              onPress={() => setSelectedVoice(voice.id)}
            >
              <View style={styles.voiceInfo}>
                <Text style={styles.voiceName}>{voice.name}</Text>
                <Text style={styles.voiceDescription}>{voice.description}</Text>
              </View>
              {selectedVoice === voice.id && (
                <View style={styles.selectedVoiceIndicator}>
                  <Bot size={16} color={Colors.lavender} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Customization</Text>
        </TouchableOpacity>

        {/* Reset Option */}
        <TouchableOpacity style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset to Default</Text>
        </TouchableOpacity>
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
  previewSection: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  previewCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.huge,
    alignItems: 'center',
    ...Shadow.medium,
  },
  previewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  previewEmoji: {
    fontSize: 40,
  },
  previewName: {
    ...Typography.subtitle,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  previewPersonality: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginBottom: Spacing.lg,
  },
  previewTraits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  traitTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    margin: Spacing.xs,
  },
  traitText: {
    ...Typography.small,
    fontFamily: 'Poppins-SemiBold',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  nameInput: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    ...Typography.paragraph,
    color: Colors.black,
    borderWidth: 2,
    borderColor: Colors.gray200,
    ...Shadow.small,
  },
  personalityCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    ...Shadow.small,
  },
  selectedCard: {
    backgroundColor: Colors.lightLavender,
  },
  personalityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  personalityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  personalityInfo: {
    flex: 1,
  },
  personalityName: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.xs,
  },
  personalityDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    lineHeight: 18,
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personalityTraits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  traitChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  traitChipText: {
    ...Typography.small,
    fontFamily: 'Poppins-SemiBold',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarOption: {
    width: '30%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.gray200,
    ...Shadow.small,
  },
  selectedAvatar: {
    borderColor: Colors.lavender,
    backgroundColor: Colors.lightLavender,
  },
  avatarEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  avatarName: {
    ...Typography.small,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
  voiceCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray200,
    ...Shadow.small,
  },
  selectedVoiceCard: {
    borderColor: Colors.lavender,
    backgroundColor: Colors.lightLavender,
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.xs,
  },
  voiceDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
  },
  selectedVoiceIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightLavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Colors.lavender,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.medium,
  },
  saveButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  resetButton: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.huge,
    borderWidth: 2,
    borderColor: Colors.gray200,
  },
  resetButtonText: {
    ...Typography.secondary,
    color: Colors.gray600,
    fontFamily: 'Poppins-SemiBold',
  },
});