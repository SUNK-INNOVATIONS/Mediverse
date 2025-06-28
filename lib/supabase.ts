import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // Add these settings to help with authentication
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development',
  },
  global: {
    headers: {
      'X-Client-Info': 'mediverse-app',
    },
  },
});

// Auth helpers with better error handling
export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    // Validate inputs
    if (!email || !password || !fullName) {
      return { 
        data: null, 
        error: { message: 'All fields are required' } 
      };
    }

    if (password.length < 6) {
      return { 
        data: null, 
        error: { message: 'Password must be at least 6 characters long' } 
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    return { data, error };
  } catch (error) {
    console.error('SignUp error:', error);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred during sign up' } 
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Validate inputs
    if (!email || !password) {
      return { 
        data: null, 
        error: { message: 'Email and password are required' } 
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      console.error('SignIn error:', error);
      
      // Provide more user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        return { 
          data: null, 
          error: { message: 'Invalid email or password. Please check your credentials and try again.' } 
        };
      }
      
      if (error.message.includes('Email not confirmed')) {
        return { 
          data: null, 
          error: { message: 'Please check your email and click the confirmation link before signing in.' } 
        };
      }
    }

    return { data, error };
  } catch (error) {
    console.error('SignIn error:', error);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred during sign in' } 
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('SignOut error:', error);
    return { error: { message: 'Failed to sign out' } };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error('GetCurrentUser error:', error);
    return { user: null, error };
  }
};

// Profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Mood entries helpers
export const createMoodEntry = async (moodEntry: Database['public']['Tables']['mood_entries']['Insert']) => {
  const { data, error } = await supabase
    .from('mood_entries')
    .insert(moodEntry)
    .select()
    .single();
  return { data, error };
};

export const getMoodEntries = async (userId: string, limit = 30) => {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data, error };
};

export const getMoodStats = async (userId: string, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('mood_entries')
    .select('emotion, intensity, created_at')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false });
  return { data, error };
};

// Journal entries helpers
export const createJournalEntry = async (journalEntry: Database['public']['Tables']['journal_entries']['Insert']) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert(journalEntry)
    .select()
    .single();
  return { data, error };
};

export const getJournalEntries = async (userId: string, limit = 20) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data, error };
};

export const updateJournalEntry = async (entryId: string, updates: Database['public']['Tables']['journal_entries']['Update']) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .update(updates)
    .eq('id', entryId)
    .select()
    .single();
  return { data, error };
};

export const deleteJournalEntry = async (entryId: string) => {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId);
  return { error };
};

// Chat sessions helpers
export const createChatSession = async (userId: string, title = 'New Chat') => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, title })
    .select()
    .single();
  return { data, error };
};

export const getChatSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return { data, error };
};

export const addChatMessage = async (message: Database['public']['Tables']['chat_messages']['Insert']) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert(message)
    .select()
    .single();
  return { data, error };
};

export const getChatMessages = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  return { data, error };
};

// Voice analysis helpers
export const createVoiceAnalysis = async (analysis: Database['public']['Tables']['voice_analyses']['Insert']) => {
  const { data, error } = await supabase
    .from('voice_analyses')
    .insert(analysis)
    .select()
    .single();
  return { data, error };
};

export const getVoiceAnalyses = async (userId: string, limit = 10) => {
  const { data, error } = await supabase
    .from('voice_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data, error };
};

// Wellness activities helpers
export const createWellnessActivity = async (activity: Database['public']['Tables']['wellness_activities']['Insert']) => {
  const { data, error } = await supabase
    .from('wellness_activities')
    .insert(activity)
    .select()
    .single();
  return { data, error };
};

export const getWellnessActivities = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('wellness_activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data, error };
};

export const updateWellnessActivity = async (activityId: string, updates: Database['public']['Tables']['wellness_activities']['Update']) => {
  const { data, error } = await supabase
    .from('wellness_activities')
    .update(updates)
    .eq('id', activityId)
    .select()
    .single();
  return { data, error };
};