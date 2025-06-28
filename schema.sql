CREATE TABLE journal_entries (
  id VARCHAR(255) PRIMARY KEY,
  date VARCHAR(255),
  text TEXT,
  sentiment_score INTEGER
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE moods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
