import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Save, Smile, Frown, Meh } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

export default function JournalScreen() {
  const [journalText, setJournalText] = useState('');
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSentiment = (text: string) => {
    if (!text.trim()) return null;
    
    setIsAnalyzing(true);
    
    // Simple sentiment analysis simulation
    const positiveWords = ['happy', 'joy', 'love', 'excited', 'grateful', 'amazing', 'wonderful', 'good', 'great'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'worried', 'stressed', 'terrible', 'awful', 'bad', 'hate'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.some(pw => word.includes(pw))).length;
    const negativeCount = words.filter(word => negativeWords.some(nw => word.includes(nw))).length;
    
    setTimeout(() => {
      if (positiveCount > negativeCount) {
        setSentiment('positive');
      } else if (negativeCount > positiveCount) {
        setSentiment('negative');
      } else {
        setSentiment('neutral');
      }
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleTextChange = (text: string) => {
    setJournalText(text);
    if (text.length > 50) {
      analyzeSentiment(text);
    } else {
      setSentiment(null);
    }
  };

  const handleSave = () => {
    if (!journalText.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }
    
    Alert.alert('Success', 'Your journal entry has been saved!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const getSentimentInfo = () => {
    switch (sentiment) {
      case 'positive':
        return {
          icon: Smile,
          color: Colors.green,
          title: 'Positive Sentiment Detected',
          message: 'Your writing reflects positive emotions. Keep nurturing this mindset!',
          suggestions: ['Continue practicing gratitude', 'Share your joy with others', 'Reflect on what made you feel this way']
        };
      case 'negative':
        return {
          icon: Frown,
          color: Colors.pink,
          title: 'Negative Sentiment Detected',
          message: 'It sounds like you\'re going through a tough time. Remember, it\'s okay to feel this way.',
          suggestions: ['Consider talking to someone you trust', 'Try some breathing exercises', 'Be gentle with yourself']
        };
      default:
        return {
          icon: Meh,
          color: Colors.yellow,
          title: 'Neutral Sentiment',
          message: 'Your writing reflects a balanced perspective.',
          suggestions: ['Continue journaling regularly', 'Explore your feelings deeper', 'Consider what might boost your mood']
        };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Journal Entry</Text>
        <TouchableOpacity onPress={handleSave} disabled={!journalText.trim()}>
          <Save size={24} color={journalText.trim() ? Colors.purple : Colors.gray400} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateCard}>
          <Text style={styles.dateText}>Today, {new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</Text>
        </View>

        <View style={styles.textInputContainer}>
          <Text style={styles.promptText}>How are you feeling today? What's on your mind?</Text>
          <TextInput
            style={styles.textInput}
            value={journalText}
            onChangeText={handleTextChange}
            placeholder="Start writing your thoughts here..."
            placeholderTextColor={Colors.gray500}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {journalText.length} characters
          </Text>
        </View>

        {isAnalyzing && (
          <View style={styles.analyzingCard}>
            <Text style={styles.analyzingText}>Analyzing your sentiment...</Text>
          </View>
        )}

        {sentiment && !isAnalyzing && (
          <View style={styles.sentimentCard}>
            <View style={styles.sentimentHeader}>
              {(() => {
                const info = getSentimentInfo();
                const IconComponent = info.icon;
                return (
                  <>
                    <IconComponent size={24} color={info.color} />
                    <Text style={[styles.sentimentTitle, { color: info.color }]}>
                      {info.title}
                    </Text>
                  </>
                );
              })()}
            </View>
            
            <Text style={styles.sentimentMessage}>
              {getSentimentInfo().message}
            </Text>
            
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Suggestions:</Text>
              {getSentimentInfo().suggestions.map((suggestion, index) => (
                <Text key={index} style={styles.suggestionItem}>
                  • {suggestion}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Journaling Tips</Text>
          <Text style={styles.tipsText}>
            • Write freely without worrying about grammar or structure{'\n'}
            • Focus on your emotions and how events made you feel{'\n'}
            • Be honest and authentic with yourself{'\n'}
            • Try to write regularly, even if just for a few minutes{'\n'}
            • End with something you're grateful for
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
    paddingVertical: Spacing.lg,
  },
  dateCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadow.small,
  },
  dateText: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
  },
  textInputContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  promptText: {
    ...Typography.secondary,
    color: Colors.gray700,
    marginBottom: Spacing.md,
  },
  textInput: {
    ...Typography.paragraph,
    color: Colors.black,
    minHeight: 200,
    maxHeight: 400,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  characterCount: {
    ...Typography.small,
    color: Colors.gray500,
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
  analyzingCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadow.small,
  },
  analyzingText: {
    ...Typography.secondary,
    color: Colors.purple,
    fontStyle: 'italic',
  },
  sentimentCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  sentimentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sentimentTitle: {
    ...Typography.paragraph,
    fontFamily: 'Indivisible-Bold',
    marginLeft: Spacing.sm,
  },
  sentimentMessage: {
    ...Typography.secondary,
    color: Colors.gray700,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  suggestionsContainer: {
    marginTop: Spacing.sm,
  },
  suggestionsTitle: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
    marginBottom: Spacing.sm,
  },
  suggestionItem: {
    ...Typography.small,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  tipsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
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