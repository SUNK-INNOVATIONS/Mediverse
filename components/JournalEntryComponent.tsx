import React, { useState } from 'react';
import JournalEntry from '../types/JournalEntry';
import Sentiment from 'sentiment';

interface Props {
  entry?: JournalEntry;
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
}

const JournalEntryComponent: React.FC<Props> = ({ entry, onSave, onCancel }) => {
  const [text, setText] = useState(entry ? entry.text : '');

  const handleSave = () => {
    // Basic validation
    if (!text.trim()) {
      alert('Journal entry cannot be empty.');
      return;
    }

    const sentiment = new Sentiment();
    const result = sentiment.analyze(text);

    const newEntry: JournalEntry = {
      id: entry ? entry.id : Date.now().toString(), // Generate a unique ID
      date: new Date().toLocaleDateString(),
      text: text,
      sentimentScore: result.score, // Will be updated later
    };
    onSave(newEntry);
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your journal entry here..."
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default JournalEntryComponent;
