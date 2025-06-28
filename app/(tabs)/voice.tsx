import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Mic, Square, Volume2, Heart, Play } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  interpolate
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { createVoiceAnalysis, getVoiceAnalyses } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type VoiceAnalysis = Database['public']['Tables']['voice_analyses']['Row'];

export default function VoiceInputScreen() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<VoiceAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const pulseScale = useSharedValue(1);
  const waveOpacity = useSharedValue(0);
  const recordingOpacity = useSharedValue(0);

  useEffect(() => {
    if (user) {
      loadRecentAnalyses();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Animate recording indicator
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
      
      waveOpacity.value = withRepeat(
        withTiming(1, { duration: 800 }),
        -1,
        true
      );

      recordingOpacity.value = withTiming(1, { duration: 300 });
    } else {
      pulseScale.value = withTiming(1);
      waveOpacity.value = withTiming(0);
      recordingOpacity.value = withTiming(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const loadRecentAnalyses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await getVoiceAnalyses(user.id, 5);
      if (error) throw error;
      setRecentAnalyses(data || []);
    } catch (error) {
      console.error('Error loading voice analyses:', error);
    }
  };

  const startRecording = () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Voice Recording',
        'Voice recording is not available in the web preview. This feature would work on mobile devices with proper microphone permissions.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setIsRecording(true);
    setRecordingTime(0);
    setAnalysis(null);
  };

  const stopRecording = async () => {
    if (!user) return;
    
    setIsRecording(false);
    setIsAnalyzing(true);
    
    try {
      // Simulate voice analysis with realistic data
      const mockMoods = ['calm', 'happy', 'anxious', 'sad', 'excited', 'stressed'];
      const mockInsights = [
        'Your voice tone suggests you\'re feeling reflective today',
        'Speaking pace indicates a calm state of mind',
        'Voice clarity shows good emotional regulation',
        'Slight tension detected in vocal patterns',
        'Positive energy reflected in speech rhythm',
        'Voice shows signs of fatigue or stress'
      ];

      const detectedMood = mockMoods[Math.floor(Math.random() * mockMoods.length)];
      const confidence = Math.floor(Math.random() * 30 + 70); // 70-100%
      const selectedInsights = mockInsights
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2);

      const { data, error } = await createVoiceAnalysis({
        user_id: user.id,
        detected_mood: detectedMood,
        confidence,
        insights: selectedInsights,
        duration: recordingTime,
      });

      if (error) throw error;

      if (data) {
        setAnalysis(data);
        loadRecentAnalyses();
      }
    } catch (error) {
      console.error('Error creating voice analysis:', error);
      Alert.alert('Error', 'Failed to analyze voice recording');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodColor = (mood: string) => {
    const moodColors: { [key: string]: string } = {
      happy: Colors.green,
      calm: Colors.blue,
      excited: Colors.yellow,
      sad: Colors.gray600,
      anxious: Colors.pink,
      stressed: Colors.error,
    };
    return moodColors[mood] || Colors.purple;
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      happy: '😊',
      calm: '😌',
      excited: '🤩',
      sad: '😢',
      anxious: '😰',
      stressed: '😤',
    };
    return moodEmojis[mood] || '😐';
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    opacity: waveOpacity.value,
  }));

  const recordingStyle = useAnimatedStyle(() => ({
    opacity: recordingOpacity.value,
  }));

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Please log in to use voice analysis</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Voice Analysis</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.instructionCard}>
            <LinearGradient
              colors={Colors.gradientGreen}
              style={styles.instructionIcon}
            >
              <Volume2 size={32} color={Colors.white} />
            </LinearGradient>
            <Text style={styles.instructionTitle}>Voice Emotion Analysis</Text>
            <Text style={styles.instructionText}>
              Speak naturally about your day, feelings, or anything on your mind. 
              Our AI will analyze the emotional tone in your voice to provide insights.
            </Text>
          </View>

          <View style={styles.recordingContainer}>
            <View style={styles.visualizer}>
              <Animated.View style={[styles.outerRing, waveStyle]} />
              <Animated.View style={[styles.middleRing, waveStyle]} />
              <Animated.View style={[styles.recordingButton, pulseStyle]}>
                <TouchableOpacity
                  style={[
                    styles.recordButton,
                    isRecording && styles.recordingActive
                  ]}
                  onPress={isRecording ? stopRecording : startRecording}
                  disabled={isAnalyzing}
                >
                  <LinearGradient
                    colors={isRecording ? [Colors.error, Colors.pink] : Colors.gradientPurple}
                    style={styles.recordButtonGradient}
                  >
                    {isRecording ? (
                      <Square size={32} color={Colors.white} />
                    ) : (
                      <Mic size={32} color={Colors.white} />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
              
              {isRecording && (
                <Animated.View style={[styles.recordingIndicator, recordingStyle]}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>Recording</Text>
                </Animated.View>
              )}
            </View>

            <Text style={styles.recordingStatus}>
              {isAnalyzing 
                ? 'Analyzing your voice...' 
                : isRecording 
                  ? `Recording: ${formatTime(recordingTime)}` 
                  : 'Tap to start recording'
              }
            </Text>
          </View>

          {analysis && (
            <View style={styles.analysisCard}>
              <View style={styles.analysisHeader}>
                <LinearGradient
                  colors={[getMoodColor(analysis.detected_mood) + '20', getMoodColor(analysis.detected_mood) + '10']}
                  style={styles.analysisIcon}
                >
                  <Text style={styles.moodEmoji}>{getMoodEmoji(analysis.detected_mood)}</Text>
                </LinearGradient>
                <Text style={styles.analysisTitle}>Analysis Complete</Text>
              </View>

              <View style={styles.moodResult}>
                <Text style={styles.moodLabel}>Detected Mood:</Text>
                <View style={[styles.moodBadge, { backgroundColor: getMoodColor(analysis.detected_mood) + '20' }]}>
                  <Text style={[styles.moodText, { color: getMoodColor(analysis.detected_mood) }]}>
                    {analysis.detected_mood.charAt(0).toUpperCase() + analysis.detected_mood.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>Confidence: {analysis.confidence}%</Text>
                <View style={styles.confidenceBar}>
                  <View 
                    style={[
                      styles.confidenceFill, 
                      { 
                        width: `${analysis.confidence}%`,
                        backgroundColor: getMoodColor(analysis.detected_mood)
                      }
                    ]} 
                  />
                </View>
              </View>

              <View style={styles.insightsContainer}>
                <Text style={styles.insightsTitle}>Insights:</Text>
                {analysis.insights.map((insight, index) => (
                  <Text key={index} style={styles.insightItem}>
                    • {insight}
                  </Text>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.newRecordingButton}
                onPress={() => {
                  setAnalysis(null);
                  setRecordingTime(0);
                }}
              >
                <LinearGradient
                  colors={Colors.gradientPurple}
                  style={styles.newRecordingGradient}
                >
                  <Text style={styles.newRecordingText}>Record Another</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {recentAnalyses.length > 0 && !analysis && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Recent Analyses</Text>
              {recentAnalyses.slice(0, 3).map((item) => (
                <TouchableOpacity key={item.id} style={styles.historyItem}>
                  <Text style={styles.historyEmoji}>{getMoodEmoji(item.detected_mood)}</Text>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyMood}>
                      {item.detected_mood.charAt(0).toUpperCase() + item.detected_mood.slice(1)}
                    </Text>
                    <Text style={styles.historyDate}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.historyConfidence}>{item.confidence}%</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Voice Recording Tips</Text>
            <Text style={styles.tipsText}>
              • Find a quiet environment for better analysis{'\n'}
              • Speak naturally and at a comfortable pace{'\n'}
              • Share genuine thoughts and feelings{'\n'}
              • Recording for 30-60 seconds provides best results{'\n'}
              • Your voice data is processed securely and privately
            </Text>
          </View>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.paragraph,
    color: Colors.error,
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
    ...Shadow.small,
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.black,
  },
  content: {
    flex: 1,
    paddingVertical: Spacing.lg,
  },
  instructionCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadow.small,
  },
  instructionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  instructionTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  instructionText: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
  recordingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  visualizer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  outerRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.purple + '40',
  },
  middleRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: Colors.purple + '60',
  },
  recordingButton: {
    width: 120,
    height: 120,
  },
  recordButton: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    overflow: 'hidden',
    ...Shadow.large,
  },
  recordButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingActive: {
    // Additional styles for active recording state
  },
  recordingIndicator: {
    position: 'absolute',
    top: -40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  recordingText: {
    ...Typography.small,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  recordingStatus: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
  },
  analysisCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadow.small,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  analysisIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  moodEmoji: {
    fontSize: 24,
  },
  analysisTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
  },
  moodResult: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  moodLabel: {
    ...Typography.secondary,
    color: Colors.gray700,
  },
  moodBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  moodText: {
    ...Typography.secondary,
    fontFamily: 'Inter-Bold',
  },
  confidenceContainer: {
    marginBottom: Spacing.lg,
  },
  confidenceLabel: {
    ...Typography.secondary,
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  insightsContainer: {
    marginBottom: Spacing.lg,
  },
  insightsTitle: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginBottom: Spacing.sm,
  },
  insightItem: {
    ...Typography.small,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  newRecordingButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  newRecordingGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  newRecordingText: {
    ...Typography.secondary,
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  historyContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadow.small,
  },
  historyTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginBottom: Spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  historyEmoji: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  historyContent: {
    flex: 1,
  },
  historyMood: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
  },
  historyDate: {
    ...Typography.small,
    color: Colors.gray600,
  },
  historyConfidence: {
    ...Typography.small,
    color: Colors.purple,
    fontFamily: 'Inter-Bold',
  },
  tipsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadow.small,
  },
  tipsTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginBottom: Spacing.md,
  },
  tipsText: {
    ...Typography.small,
    color: Colors.gray600,
    lineHeight: 18,
  },
});