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
import { ArrowLeft, Mic, Square, X } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function VoiceEntryScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState('');
  
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
    setTranscription('');
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    // Simulate transcription and analysis
    setTimeout(() => {
      const mockTranscription = "I've been feeling a bit overwhelmed with work lately. There's so much to do and I'm not sure if I'm managing my time well. I feel anxious about meeting all my deadlines.";
      setTranscription(mockTranscription);
    }, 1500);
  };

  const handleNext = () => {
    // Store voice data and transcription
    const voiceData = {
      transcription,
      duration: recordingTime,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Voice data:', voiceData);
    router.push('/mood-analysis');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '75%' }]} />
        </View>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.headerIcon}>
          <X size={24} color={Colors.gray600} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Share Your Thoughts</Text>
        <Text style={styles.subtitle}>
          Speak naturally about how you're feeling. Our AI will analyze your voice tone and words to understand your emotional state.
        </Text>

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
            {isRecording 
              ? `Recording: ${formatTime(recordingTime)}` 
              : transcription 
                ? 'Recording complete' 
                : 'Tap to start recording'
            }
          </Text>
        </View>

        {transcription && (
          <View style={styles.transcriptionCard}>
            <Text style={styles.transcriptionTitle}>What you said:</Text>
            <Text style={styles.transcriptionText}>{transcription}</Text>
          </View>
        )}

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Recording Tips</Text>
          <Text style={styles.tipsText}>
            • Find a quiet space for better analysis{'\n'}
            • Speak naturally and at your normal pace{'\n'}
            • Share genuine thoughts and feelings{'\n'}
            • 30-60 seconds provides the best results
          </Text>
        </View>

        {transcription && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Analyze My Voice</Text>
          </TouchableOpacity>
        )}
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
    height: '100%',
    backgroundColor: Colors.lavender,
    borderRadius: BorderRadius.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  title: {
    ...Typography.title,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.huge,
  },
  recordingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
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
    borderColor: Colors.lavender + '40',
  },
  middleRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: Colors.lavender + '60',
  },
  recordingButton: {
    width: 120,
    height: 120,
  },
  recordButton: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: Colors.lavender,
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
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  transcriptionCard: {
    backgroundColor: Colors.lightLavender,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.lavender,
  },
  transcriptionTitle: {
    ...Typography.secondary,
    color: Colors.lavender,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  transcriptionText: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  tipsTitle: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  tipsText: {
    ...Typography.small,
    color: Colors.gray600,
    lineHeight: 18,
  },
  nextButton: {
    backgroundColor: Colors.lavender,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadow.medium,
  },
  nextButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
});