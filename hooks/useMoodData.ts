import { useEffect, useState } from 'react';
import { getMoodEntries, getMoodStats } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { useAuth } from './useAuth';

type MoodEntry = Database['public']['Tables']['mood_entries']['Row'];

export function useMoodData() {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [moodStats, setMoodStats] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoodData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const [entriesResult, statsResult] = await Promise.all([
        getMoodEntries(user.id),
        getMoodStats(user.id, 30)
      ]);

      if (entriesResult.error) throw entriesResult.error;
      if (statsResult.error) throw statsResult.error;

      setMoodEntries(entriesResult.data || []);
      setMoodStats(statsResult.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mood data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodData();
  }, [user]);

  const refreshMoodData = () => {
    fetchMoodData();
  };

  // Calculate mood statistics
  const averageMood = moodStats.length > 0 
    ? Math.round(moodStats.reduce((sum, entry) => sum + entry.intensity, 0) / moodStats.length)
    : 0;

  const moodStreak = calculateMoodStreak(moodEntries);
  
  const moodTrend = calculateMoodTrend(moodStats);

  return {
    moodEntries,
    moodStats,
    loading,
    error,
    refreshMoodData,
    averageMood,
    moodStreak,
    moodTrend,
  };
}

function calculateMoodStreak(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < entries.length; i++) {
    const entryDate = new Date(entries[i].created_at);
    entryDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateMoodTrend(stats: MoodEntry[]): 'up' | 'down' | 'stable' {
  if (stats.length < 7) return 'stable';

  const recent = stats.slice(0, 7);
  const older = stats.slice(7, 14);

  const recentAvg = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length;
  const olderAvg = older.reduce((sum, entry) => sum + entry.intensity, 0) / older.length;

  const difference = recentAvg - olderAvg;

  if (difference > 5) return 'up';
  if (difference < -5) return 'down';
  return 'stable';
}