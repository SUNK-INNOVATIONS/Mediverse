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
import { ArrowLeft, Mic, Square, Volume2, Heart } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function VoiceInputScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysis, setAnalysis] = useState<{
    mood: 'positive' | 'neutral' | 'negative';
    confidence: number;
    insights: string[];
  } | null>(null);
  
  const pulseScale = useSharedValue(1);
  const waveOpacity = useSharedValue(0);

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
    } else {
      pulseScale.value = withTiming(1);
      waveOpacity.value = withTiming(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

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

  const stopRecording = () => {
    setIsRecording(false);
    
    // Simulate voice analysis
    setTimeout(() => {
      const mockAnalysis = {
        mood: Math.random() > 0.6 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
        confidence: Math.floor(Math.random() * 30 + 70), // 70-100%
        insights: [
          'Your voice tone suggests you\'re feeling reflective today',
          'Speaking pace indicates a calm state of mind',
          'Voice clarity shows good emotional regulation'
        ]
      };
      setAnalysis(mockAnalysis as any);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return Colors.green;
      case 'negative': return Colors.pink;
      default: return Colors.yellow;
    }
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    opacity: waveOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Analysis</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.instructionCard}>
          <Volume2 size={32} color={Colors.purple} />
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
              >
                {isRecording ? (
                  <Square size={32} color={Colors.white} />
                ) : (
                  <Mic size={32} color={Colors.white} />
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Text style={styles.recordingStatus}>
            {isRecording ? `Recording: ${formatTime(recordingTime)}` : 'Tap to start recording'}
          </Text>
        </View>

        {analysis && (
          <View style={styles.analysisCard}>
            <View style={styles.analysisHeader}>
              <Heart size={24} color={getMoodColor(analysis.mood)} />
              <Text style={styles.analysisTitle}>Voice Analysis Complete</Text>
            </View>

            <View style={styles.moodResult}>
              <Text style={styles.moodLabel}>Detected Mood:</Text>
              <View style={[styles.moodBadge, { backgroundColor: getMoodColor(analysis.mood) + '20' }]}>
                <Text style={[styles.moodText, { color: getMoodColor(analysis.mood) }]}>
                  {analysis.mood.charAt(0).toUpperCase() + analysis.mood.slice(1)}
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
                      backgroundColor: getMoodColor(analysis.mood)
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
              <Text style={styles.newRecordingText}>Record Another</Text>
            </TouchableOpacity>
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
  instructionTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginTop: Spacing.md,
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
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.large,
  },
  recordingActive: {
    backgroundColor: Colors.error,
  },
  recordingStatus: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
  },
  analysisCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  analysisTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
    marginLeft: Spacing.sm,
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
    fontFamily: 'Indivisible-Bold',
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
    fontFamily: 'Indivisible-Bold',
    marginBottom: Spacing.sm,
  },
  insightItem: {
    ...Typography.small,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  newRecordingButton: {
    backgroundColor: Colors.purple,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  newRecordingText: {
    ...Typography.secondary,
    color: Colors.white,
    fontFamily: 'Indivisible-Bold',
  },
  tipsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  tipsTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
    marginBottom: Spacing.md,
  },
  tipsText: {
    ...Typography.small,
    color: Colors.gray600,
    lineHeight: 18,
  },
});