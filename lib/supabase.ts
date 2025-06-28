import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development',
  },
  global: {
    headers: {
      'X-Client-Info': 'mediverse-app@1.0.0',
    },
  },
});

// Enhanced auth helpers with comprehensive error handling
export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    // Input validation
    if (!email?.trim()) {
      return { 
        data: null, 
        error: { message: 'Email is required' } 
      };
    }

    if (!password) {
      return { 
        data: null, 
        error: { message: 'Password is required' } 
      };
    }

    if (!fullName?.trim()) {
      return { 
        data: null, 
        error: { message: 'Full name is required' } 
      };
    }

    if (password.length < 6) {
      return { 
        data: null, 
        error: { message: 'Password must be at least 6 characters long' } 
      };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { 
        data: null, 
        error: { message: 'Please enter a valid email address' } 
      };
    }

    console.log('Attempting to sign up user:', email.trim().toLowerCase());

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      options: {
        data: {
          full_name: fullName.trim(),
        },
        emailRedirectTo: undefined, // Disable email confirmation for now
      },
    });

    if (error) {
      console.error('Supabase signUp error:', error);
      
      // Handle specific error cases
      if (error.message.includes('User already registered')) {
        return { 
          data: null, 
          error: { message: 'An account with this email already exists. Please try signing in instead.' } 
        };
      }
      
      if (error.message.includes('Password should be at least')) {
        return { 
          data: null, 
          error: { message: 'Password must be at least 6 characters long' } 
        };
      }

      if (error.message.includes('Invalid email')) {
        return { 
          data: null, 
          error: { message: 'Please enter a valid email address' } 
        };
      }

      // Return the original error message for other cases
      return { data: null, error };
    }

    console.log('SignUp successful:', data);
    return { data, error: null };

  } catch (error) {
    console.error('Unexpected signUp error:', error);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred. Please try again.' } 
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Input validation
    if (!email?.trim()) {
      return { 
        data: null, 
        error: { message: 'Email is required' } 
      };
    }

    if (!password) {
      return { 
        data: null, 
        error: { message: 'Password is required' } 
      };
    }

    console.log('Attempting to sign in user:', email.trim().toLowerCase());

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    if (error) {
      console.error('Supabase signIn error:', error);
      
      // Provide user-friendly error messages
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

      if (error.message.includes('Too many requests')) {
        return { 
          data: null, 
          error: { message: 'Too many login attempts. Please wait a moment and try again.' } 
        };
      }

      // Return the original error for other cases
      return { data: null, error };
    }

    console.log('SignIn successful:', data.user?.email);
    return { data, error: null };

  } catch (error) {
    console.error('Unexpected signIn error:', error);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred. Please try again.' } 
    };
  }
};

export const signOut = async () => {
  try {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('SignOut error:', error);
    }
    
    return { error };
  } catch (error) {
    console.error('Unexpected signOut error:', error);
    return { error: { message: 'Failed to sign out' } };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('GetCurrentUser error:', error);
    }
    
    return { user, error };
  } catch (error) {
    console.error('Unexpected getCurrentUser error:', error);
    return { user: null, error };
  }
};

// Profile helpers with error handling
export const getProfile = async (userId: string) => {
  try {
    if (!userId) {
      return { data: null, error: { message: 'User ID is required' } };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('GetProfile error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected getProfile error:', error);
    return { data: null, error };
  }
};

export const updateProfile = async (userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
  try {
    if (!userId) {
      return { data: null, error: { message: 'User ID is required' } };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('UpdateProfile error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected updateProfile error:', error);
    return { data: null, error };
  }
};

// Mood entries helpers
export const createMoodEntry = async (moodEntry: Database['public']['Tables']['mood_entries']['Insert']) => {
  try {
    const { data, error } = await supabase
      .from('mood_entries')
      .insert(moodEntry)
      .select()
      .single();
      
    if (error) {
      console.error('CreateMoodEntry error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected createMoodEntry error:', error);
    return { data: null, error };
  }
};

export const getMoodEntries = async (userId: string, limit = 30) => {
  try {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('GetMoodEntries error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected getMoodEntries error:', error);
    return { data: null, error };
  }
};

export const getMoodStats = async (userId: string, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('mood_entries')
      .select('emotion, intensity, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('GetMoodStats error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected getMoodStats error:', error);
    return { data: null, error };
  }
};

// Journal entries helpers
export const createJournalEntry = async (journalEntry: Database['public']['Tables']['journal_entries']['Insert']) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(journalEntry)
      .select()
      .single();
      
    if (error) {
      console.error('CreateJournalEntry error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected createJournalEntry error:', error);
    return { data: null, error };
  }
};

export const getJournalEntries = async (userId: string, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('GetJournalEntries error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected getJournalEntries error:', error);
    return { data: null, error };
  }
};

export const updateJournalEntry = async (entryId: string, updates: Database['public']['Tables']['journal_entries']['Update']) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single();
      
    if (error) {
      console.error('UpdateJournalEntry error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected updateJournalEntry error:', error);
    return { data: null, error };
  }
};

export const deleteJournalEntry = async (entryId: string) => {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);
      
    if (error) {
      console.error('DeleteJournalEntry error:', error);
    }
    
    return { error };
  } catch (error) {
    console.error('Unexpected deleteJournalEntry error:', error);
    return { error };
  }
};

// Chat sessions helpers
export const createChatSession = async (userId: string, title = 'New Chat') => {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ user_id: userId, title })
      .select()
      .single();
      
    if (error) {
      console.error('CreateChatSession error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected createChatSession error:', error);
    return { data: null, error };
  }
};

export const getChatSessions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
      
    if (error) {
      console.error('GetChatSessions error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected getChatSessions error:', error);
    return { data: null, error };
  }
};

export const addChatMessage = async (message: Database['public']['Tables']['chat_messages']['Insert']) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single();
      
    if (error) {
      console.error('AddChatMessage error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected addChatMessage error:', error);
    return { data: null, error };
  }
};

export const getChatMessages = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('GetChatMessages error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected getChatMessages error:', error);
    return { data: null, error };
  }
};

// Voice analysis helpers
export const createVoiceAnalysis = async (analysis: Database['public']['Tables']['voice_analyses']['Insert']) => {
  try {
    const { data, error } = await supabase
      .from('voice_analyses')
      .insert(analysis)
      .select()
      .single();
      
    if (error) {
      console.error('CreateVoiceAnalysis error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected createVoiceAnalysis error:', error);
    return { data: null, error };
  }
};

export const getVoiceAnalyses = async (userId: string, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('voice_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('GetVoiceAnalyses error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected getVoiceAnalyses error:', error);
    return { data: null, error };
  }
};

// Wellness activities helpers
export const createWellnessActivity = async (activity: Database['public']['Tables']['wellness_activities']['Insert']) => {
  try {
    const { data, error } = await supabase
      .from('wellness_activities')
      .insert(activity)
      .select()
      .single();
      
    if (error) {
      console.error('CreateWellnessActivity error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected createWellnessActivity error:', error);
    return { data: null, error };
  }
};

export const getWellnessActivities = async (userId: string, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('wellness_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('GetWellnessActivities error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected getWellnessActivities error:', error);
    return { data: null, error };
  }
};

export const updateWellnessActivity = async (activityId: string, updates: Database['public']['Tables']['wellness_activities']['Update']) => {
  try {
    const { data, error } = await supabase
      .from('wellness_activities')
      .update(updates)
      .eq('id', activityId)
      .select()
      .single();
      
    if (error) {
      console.error('UpdateWellnessActivity error:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Unexpected updateWellnessActivity error:', error);
    return { data: null, error };
  }
};