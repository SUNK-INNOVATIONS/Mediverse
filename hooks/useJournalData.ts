import { useEffect, useState } from 'react';
import { getJournalEntries } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { useAuth } from './useAuth';

type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];

export function useJournalData() {
  const { user } = useAuth();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJournalData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getJournalEntries(user.id);
      
      if (fetchError) throw fetchError;

      setJournalEntries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch journal entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalData();
  }, [user]);

  const refreshJournalData = () => {
    fetchJournalData();
  };

  // Calculate journal statistics
  const totalEntries = journalEntries.length;
  const averageSentiment = journalEntries.length > 0
    ? Math.round(journalEntries.reduce((sum, entry) => sum + entry.sentiment_score, 0) / journalEntries.length)
    : 0;

  const recentEntries = journalEntries.slice(0, 5);

  return {
    journalEntries,
    loading,
    error,
    refreshJournalData,
    totalEntries,
    averageSentiment,
    recentEntries,
  };
}