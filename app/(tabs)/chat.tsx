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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Markdown from 'react-native-markdown-display';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { createChatSession, addChatMessage, getChatMessages, getChatSessions } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
type ChatSession = Database['public']['Tables']['chat_sessions']['Row'];

export default function ChatScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const gemini = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_AI_API_KEY || '');
  const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });

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
        
        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          session_id: data.id,
          content: 'Hello! I\'m your AI companion. I\'m here to listen and support you. How are you feeling today?',
          is_user: false,
          sentiment: 'positive',
          created_at: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
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

  const handleSend = async () => {
    if (!inputText.trim() || !currentSession || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      session_id: currentSession.id,
      content: inputText,
      is_user: true,
      sentiment: detectMood(inputText),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Save user message to database
      await addChatMessage({
        session_id: currentSession.id,
        content: inputText,
        is_user: true,
        sentiment: detectMood(inputText),
      });

      // Generate AI response
      const previousMessages = messages.map(message => 
        `${message.is_user ? 'User' : 'Assistant'}: ${message.content}`
      ).join('\n');
      
      const prompt = `You are a compassionate AI mental health companion. Respond empathetically and supportively to the user's message. Consider their mood (${userMessage.sentiment}) and previous conversation context. Keep responses concise but caring.\n\nPrevious conversation:\n${previousMessages}\n\nUser: ${inputText}`;

      const result = await model.generateContent(prompt);
      let responseText = '';
      
      if (result && result.response && result.response.candidates && result.response.candidates[0].content && result.response.candidates[0].content.parts) {
        responseText = result.response.candidates[0].content.parts
          .map((part: any) => part.text)
          .join('');
      } else {
        responseText = 'I\'m here to listen. Could you tell me more about how you\'re feeling?';
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

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'positive': return Colors.green;
      case 'negative': return Colors.pink;
      default: return Colors.gray300;
    }
  };

  const renderMessage = (message: ChatMessage) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.is_user ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View style={styles.messageHeader}>
        <View style={[
          styles.avatarContainer,
          { backgroundColor: message.is_user ? Colors.purple : Colors.green }
        ]}>
          {message.is_user ? (
            <User size={16} color={Colors.white} />
          ) : (
            <Bot size={16} color={Colors.white} />
          )}
        </View>
        {!message.is_user && message.sentiment && (
          <View
            style={[
              styles.moodIndicator,
              { backgroundColor: getMoodColor(message.sentiment) }
            ]}
          />
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
            },
          }}
        >
          {message.content}
        </Markdown>
      </View>
      
      <Text style={styles.timestamp}>
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
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
        colors={['#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <LinearGradient
              colors={Colors.gradientGreen}
              style={styles.aiAvatar}
            >
              <Bot size={24} color={Colors.white} />
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>AI Companion</Text>
              <Text style={styles.headerSubtitle}>
                {isTyping ? 'Typing...' : 'Always here to listen'}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={createNewSession}
            style={styles.newChatButton}
          >
            <Plus size={20} color={Colors.purple} />
          </TouchableOpacity>
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
            {messages.map(renderMessage)}
            
            {isTyping && (
              <View style={[styles.messageContainer, styles.aiMessage]}>
                <View style={styles.messageHeader}>
                  <View style={[styles.avatarContainer, { backgroundColor: Colors.green }]}>
                    <Bot size={16} color={Colors.white} />
                  </View>
                </View>
                <View style={[styles.messageBubble, styles.aiBubble]}>
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Share your thoughts..."
                placeholderTextColor={Colors.gray500}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.disabledSendButton
                ]}
                onPress={handleSend}
                disabled={!inputText.trim() || isTyping}
              >
                <LinearGradient
                  colors={inputText.trim() ? Colors.gradientPurple : [Colors.gray400, Colors.gray400]}
                  style={styles.sendButtonGradient}
                >
                  <Send size={18} color={Colors.white} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.sentiment}>
              Mood: {detectMood(inputText)}
            </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    ...Shadow.small,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    ...Typography.small,
    color: Colors.gray600,
  },
  newChatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.purple + '15',
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
  },
  messageContainer: {
    marginBottom: Spacing.lg,
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
    marginBottom: Spacing.xs,
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.sm,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadow.small,
  },
  userBubble: {
    backgroundColor: Colors.purple,
    borderBottomRightRadius: BorderRadius.sm,
  },
  aiBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  timestamp: {
    ...Typography.small,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray400,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    ...Typography.paragraph,
    color: Colors.black,
    paddingVertical: Spacing.sm,
  },
  sendButton: {
    marginLeft: Spacing.sm,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    opacity: 0.5,
  },
  sentiment: {
    ...Typography.small,
    color: Colors.gray500,
    textAlign: 'center',
  },
});