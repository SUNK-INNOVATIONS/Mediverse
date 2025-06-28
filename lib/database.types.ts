export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      mood_entries: {
        Row: {
          id: string
          user_id: string
          emotion: string
          intensity: number
          notes: string
          factors: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          emotion: string
          intensity: number
          notes?: string
          factors?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          emotion?: string
          intensity?: number
          notes?: string
          factors?: string[]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          sentiment_score: number
          mood_tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          content: string
          sentiment_score?: number
          mood_tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          sentiment_score?: number
          mood_tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          content: string
          is_user: boolean
          sentiment: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          content: string
          is_user?: boolean
          sentiment?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          content?: string
          is_user?: boolean
          sentiment?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      voice_analyses: {
        Row: {
          id: string
          user_id: string
          audio_url: string | null
          detected_mood: string
          confidence: number
          insights: string[]
          duration: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          audio_url?: string | null
          detected_mood: string
          confidence?: number
          insights?: string[]
          duration?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          audio_url?: string | null
          detected_mood?: string
          confidence?: number
          insights?: string[]
          duration?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_analyses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      wellness_activities: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          title: string
          duration: number
          completed: boolean
          rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          title: string
          duration?: number
          completed?: boolean
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          title?: string
          duration?: number
          completed?: boolean
          rating?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wellness_activities_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}