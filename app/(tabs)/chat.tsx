import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, Plus, Sparkles, Heart, Brain, MessageSquare, Mic } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  runOnJS,
  FadeIn,
  SlideInRight,
  SlideInLeft,
  BounceIn
} from 'react-native-reanimated';
import Markdown from 'react-native-markdown-display';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { createChatSession, addChatMessage, getChatMessages, getChatSessions } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
type ChatSession = Database['public']['Tables']['chat_sessions']['Row'];

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ChatScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const gemini = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_AI_API_KEY || '');
  const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Animation values
  const sendButtonScale = useSharedValue(1);
  const inputFocusScale = useSharedValue(1);
  const typingOpacity = useSharedValue(0);

  const quickSuggestions = [
    { text: "How are you feeling today?", icon: Heart },
    { text: "I'm feeling anxious", icon: Brain },
    { text: "Tell me about mindfulness", icon: Sparkles },
    { text: "I need someone to talk to", icon: MessageSquare },
  ];

  useEffect(() => {
    if (user) {
      loadChatSessions();
      createNewSession();
    }
  }, [user]);

  useEffect(() => {
    if (currentSession) {
      loadChatMessages();
    }
  }, [currentSession]);

  useEffect(() => {
    if (isTyping) {
      typingOpacity.value = withTiming(1, { duration: 300 });
    } else {
      typingOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isTyping]);

  const loadChatSessions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await getChatSessions(user.id);
      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const loadChatMessages = async () => {
    if (!currentSession) return;
    
    try {
      const { data, error } = await getChatMessages(currentSession.id);
      if (error) throw error;
      setMessages(data || []);
      setShowSuggestions((data || []).length === 0);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const createNewSession = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await createChatSession(user.id, 'New Chat');
      if (error) throw error;
      
      if (data) {
        setCurrentSession(data);
        setMessages([]);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error creating chat session:', error);
      Alert.alert('Error', 'Failed to create new chat session');
    }
  };

  const detectMood = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['happy', 'good', 'great', 'amazing', 'wonderful', 'excited', 'grateful', 'love', 'joy'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'anxious', 'worried', 'stressed', 'terrible', 'hate', 'depressed'];
    
    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim() || !currentSession || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      session_id: currentSession.id,
      content: textToSend,
      is_user: true,
      sentiment: detectMood(textToSend),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setShowSuggestions(false);

    // Animate send button
    sendButtonScale.value = withSequence(
      withSpring(0.8, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );

    try {
      // Save user message to database
      await addChatMessage({
        session_id: currentSession.id,
        content: textToSend,
        is_user: true,
        sentiment: detectMood(textToSend),
      });

      // Generate AI response
      const previousMessages = messages.map(message => 
        `${message.is_user ? 'User' : 'Assistant'}: ${message.content}`
      ).join('\n');
      
      const prompt = `You are a compassionate AI mental health companion named Luna. You provide empathetic, supportive responses while being warm and understanding. Respond to the user's message considering their mood (${userMessage.sentiment}) and conversation context. Keep responses conversational, caring, and helpful. Use emojis sparingly but appropriately.

Previous conversation:
${previousMessages}

User: ${textToSend}`;

      const result = await model.generateContent(prompt);
      let responseText = '';
      
      if (result && result.response && result.response.candidates && result.response.candidates[0].content && result.response.candidates[0].content.parts) {
        responseText = result.response.candidates[0].content.parts
          .map((part: any) => part.text)
          .join('');
      } else {
        responseText = 'I\'m here to listen and support you. Could you tell me more about how you\'re feeling? 💙';
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        session_id: currentSession.id,
        content: responseText,
        is_user: false,
        sentiment: 'positive',
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save AI message to database
      await addChatMessage({
        session_id: currentSession.id,
        content: responseText,
        is_user: false,
        sentiment: 'positive',
      });

    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleInputFocus = () => {
    inputFocusScale.value = withSpring(1.02, { damping: 15 });
  };

  const handleInputBlur = () => {
    inputFocusScale.value = withSpring(1, { damping: 15 });
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'positive': return Colors.green;
      case 'negative': return Colors.pink;
      default: return Colors.yellow;
    }
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  const sendButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendButtonScale.value }],
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputFocusScale.value }],
  }));

  const typingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: typingOpacity.value,
    transform: [
      {
        translateY: interpolate(
          typingOpacity.value,
          [0, 1],
          [20, 0]
        )
      }
    ],
  }));

  const renderMessage = (message: ChatMessage, index: number) => (
    <Animated.View
      key={message.id}
      entering={message.is_user ? SlideInRight.delay(index * 100) : SlideInLeft.delay(index * 100)}
      style={[
        styles.messageContainer,
        message.is_user ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View style={styles.messageHeader}>
        <LinearGradient
          colors={message.is_user ? Colors.gradientPurple : Colors.gradientGreen}
          style={styles.avatarContainer}
        >
          {message.is_user ? (
            <User size={16} color={Colors.white} />
          ) : (
            <Bot size={16} color={Colors.white} />
          )}
        </LinearGradient>
        
        {!message.is_user && (
          <View style={styles.aiInfo}>
            <Text style={styles.aiName}>Luna</Text>
            <Text style={styles.aiRole}>AI Companion</Text>
          </View>
        )}
        
        {message.sentiment && (
          <View style={styles.moodContainer}>
            <Text style={styles.moodEmoji}>{getMoodEmoji(message.sentiment)}</Text>
          </View>
        )}
      </View>
      
      <View
        style={[
          styles.messageBubble,
          message.is_user ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Markdown
          style={{
            body: {
              ...Typography.paragraph,
              color: message.is_user ? Colors.white : Colors.black,
              margin: 0,
              fontSize: isSmallScreen ? 14 : 15,
            },
            paragraph: {
              marginTop: 0,
              marginBottom: 8,
            },
            strong: {
              fontFamily: 'Inter-Bold',
            },
            em: {
              fontStyle: 'italic',
            },
          }}
        >
          {message.content}
        </Markdown>
      </View>
      
      <Text style={styles.timestamp}>
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Animated.View>
  );

  const renderTypingIndicator = () => (
    <Animated.View style={[styles.typingContainer, typingAnimatedStyle]}>
      <LinearGradient
        colors={Colors.gradientGreen}
        style={styles.typingAvatar}
      >
        <Bot size={16} color={Colors.white} />
      </LinearGradient>
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          <Animated.View 
            style={[styles.typingDot, { opacity: typingOpacity.value }]} 
            entering={BounceIn.delay(0)}
          />
          <Animated.View 
            style={[styles.typingDot, { opacity: typingOpacity.value }]} 
            entering={BounceIn.delay(200)}
          />
          <Animated.View 
            style={[styles.typingDot, { opacity: typingOpacity.value }]} 
            entering={BounceIn.delay(400)}
          />
        </View>
        <Text style={styles.typingText}>Luna is thinking...</Text>
      </View>
    </Animated.View>
  );

  const renderSuggestions = () => (
    <Animated.View entering={FadeIn.delay(500)} style={styles.suggestionsContainer}>
      <View style={styles.welcomeSection}>
        <LinearGradient
          colors={Colors.gradientGreen}
          style={styles.welcomeAvatar}
        >
          <Bot size={32} color={Colors.white} />
        </LinearGradient>
        <Text style={styles.welcomeTitle}>Hi! I'm Luna 🌙</Text>
        <Text style={styles.welcomeSubtitle}>
          Your compassionate AI companion. I'm here to listen, support, and help you navigate your mental wellness journey.
        </Text>
      </View>
      
      <Text style={styles.suggestionsTitle}>How can I help you today?</Text>
      <View style={styles.suggestionsGrid}>
        {quickSuggestions.map((suggestion, index) => (
          <AnimatedTouchableOpacity
            key={index}
            entering={FadeIn.delay(700 + index * 100)}
            style={styles.suggestionCard}
            onPress={() => handleSuggestionPress(suggestion.text)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.purple + '10', Colors.purple + '05']}
              style={styles.suggestionGradient}
            >
              <suggestion.icon size={20} color={Colors.purple} />
              <Text style={styles.suggestionText}>{suggestion.text}</Text>
            </LinearGradient>
          </AnimatedTouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Please log in to access chat</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FAFBFF', '#F0F4FF']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Enhanced Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.8)']}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerInfo}>
                <LinearGradient
                  colors={Colors.gradientGreen}
                  style={styles.headerAvatar}
                >
                  <Bot size={24} color={Colors.white} />
                </LinearGradient>
                <View>
                  <Text style={styles.headerTitle}>Luna</Text>
                  <Text style={styles.headerSubtitle}>
                    {isTyping ? 'Typing...' : 'Always here to listen'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={createNewSession}
                style={styles.newChatButton}
              >
                <LinearGradient
                  colors={Colors.gradientPurple}
                  style={styles.newChatGradient}
                >
                  <Plus size={20} color={Colors.white} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatContainer}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContent}
          >
            {showSuggestions && messages.length === 0 ? (
              renderSuggestions()
            ) : (
              <>
                {messages.map(renderMessage)}
                {isTyping && renderTypingIndicator()}
              </>
            )}
          </ScrollView>

          {/* Enhanced Input Container */}
          <View style={styles.inputContainer}>
            {Platform.OS === 'ios' ? (
              <BlurView intensity={100} tint="light" style={styles.inputBlur}>
                <Animated.View style={[styles.inputWrapper, inputAnimatedStyle]}>
                  <TextInput
                    ref={inputRef}
                    style={styles.textInput}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Share your thoughts..."
                    placeholderTextColor={Colors.gray500}
                    multiline
                    maxLength={500}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <View style={styles.inputActions}>
                    <TouchableOpacity style={styles.voiceButton}>
                      <Mic size={18} color={Colors.gray500} />
                    </TouchableOpacity>
                    <AnimatedTouchableOpacity
                      style={[styles.sendButton, sendButtonAnimatedStyle]}
                      onPress={() => handleSend()}
                      disabled={!inputText.trim() || isTyping}
                    >
                      <LinearGradient
                        colors={inputText.trim() ? Colors.gradientPurple : [Colors.gray400, Colors.gray400]}
                        style={styles.sendButtonGradient}
                      >
                        <Send size={18} color={Colors.white} />
                      </LinearGradient>
                    </AnimatedTouchableOpacity>
                  </View>
                </Animated.View>
              </BlurView>
            ) : (
              <View style={[styles.inputBlur, styles.androidInputBlur]}>
                <Animated.View style={[styles.inputWrapper, inputAnimatedStyle]}>
                  <TextInput
                    ref={inputRef}
                    style={styles.textInput}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Share your thoughts..."
                    placeholderTextColor={Colors.gray500}
                    multiline
                    maxLength={500}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <View style={styles.inputActions}>
                    <TouchableOpacity style={styles.voiceButton}>
                      <Mic size={18} color={Colors.gray500} />
                    </TouchableOpacity>
                    <AnimatedTouchableOpacity
                      style={[styles.sendButton, sendButtonAnimatedStyle]}
                      onPress={() => handleSend()}
                      disabled={!inputText.trim() || isTyping}
                    >
                      <LinearGradient
                        colors={inputText.trim() ? Colors.gradientPurple : [Colors.gray400, Colors.gray400]}
                        style={styles.sendButtonGradient}
                      >
                        <Send size={18} color={Colors.white} />
                      </LinearGradient>
                    </AnimatedTouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            )}
            
            <View style={styles.inputFooter}>
              <Text style={styles.inputHint}>
                💡 Tip: Share your feelings openly - I'm here to listen without judgment
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    ...Shadow.small,
  },
  headerGradient: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadow.medium,
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.black,
    fontSize: isSmallScreen ? 18 : 20,
  },
  headerSubtitle: {
    ...Typography.small,
    color: Colors.gray600,
    fontSize: isSmallScreen ? 11 : 12,
  },
  newChatButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadow.medium,
  },
  newChatGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  messageContainer: {
    marginBottom: Spacing.xl,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.small,
  },
  aiInfo: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  aiName: {
    ...Typography.small,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    fontSize: isSmallScreen ? 11 : 12,
  },
  aiRole: {
    ...Typography.caption,
    color: Colors.gray500,
    fontSize: isSmallScreen ? 9 : 10,
  },
  moodContainer: {
    marginLeft: Spacing.sm,
  },
  moodEmoji: {
    fontSize: isSmallScreen ? 16 : 18,
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Shadow.small,
  },
  userBubble: {
    backgroundColor: Colors.purple,
    borderBottomRightRadius: BorderRadius.sm,
  },
  aiBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  timestamp: {
    ...Typography.caption,
    color: Colors.gray500,
    marginTop: Spacing.xs,
    fontSize: isSmallScreen ? 9 : 10,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.xl,
  },
  typingAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    ...Shadow.small,
  },
  typingBubble: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderBottomLeftRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Shadow.small,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.purple,
  },
  typingText: {
    ...Typography.caption,
    color: Colors.gray600,
    fontSize: isSmallScreen ? 10 : 11,
  },
  suggestionsContainer: {
    paddingVertical: Spacing.xl,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  welcomeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.large,
  },
  welcomeTitle: {
    ...Typography.title,
    color: Colors.black,
    marginBottom: Spacing.md,
    fontSize: isSmallScreen ? 24 : 28,
  },
  welcomeSubtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
    fontSize: isSmallScreen ? 13 : 14,
  },
  suggestionsTitle: {
    ...Typography.heading,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    fontSize: isSmallScreen ? 16 : 18,
  },
  suggestionsGrid: {
    gap: Spacing.md,
  },
  suggestionCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.small,
  },
  suggestionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
  },
  suggestionText: {
    ...Typography.secondary,
    color: Colors.black,
    marginLeft: Spacing.md,
    flex: 1,
    fontSize: isSmallScreen ? 13 : 14,
  },
  inputContainer: {
    paddingTop: Spacing.md,
  },
  inputBlur: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  androidInputBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Shadow.medium,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    ...Typography.paragraph,
    color: Colors.black,
    paddingVertical: Spacing.sm,
    fontSize: isSmallScreen ? 14 : 15,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  voiceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    borderRadius: 18,
    overflow: 'hidden',
    ...Shadow.small,
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputFooter: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.md,
  },
  inputHint: {
    ...Typography.caption,
    color: Colors.gray500,
    textAlign: 'center',
    fontSize: isSmallScreen ? 10 : 11,
  },
});