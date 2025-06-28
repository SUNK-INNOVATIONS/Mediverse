import React, { useState } from 'react';
import JournalEntry from '../types/JournalEntry';
import JournalEntryComponent from '../components/JournalEntryComponent';
import { supabase } from '../lib/supabase';

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = async (newEntry: JournalEntry) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([newEntry]);

    if (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save journal entry.');
    } else {
      setEntries([...entries, newEntry]);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  const getSentimentLabel = (score: number): string => {
    if (score > 0) {
      return 'Positive';
    } else if (score < 0) {
      return 'Negative';
    } else {
      return 'Neutral';
    }
  };

  return (
    <div>
      <h1>Journal</h1>
      <button onClick={() => setIsCreating(true)}>Add New Entry</button>
      {isCreating && (
        <JournalEntryComponent onSave={handleSave} onCancel={handleCancel} />
      )}
      {entries.map((entry) => (
        <div key={entry.id}>
          <h2>{entry.date} - {getSentimentLabel(entry.sentimentScore)}</h2>
          <p>{entry.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Journal;