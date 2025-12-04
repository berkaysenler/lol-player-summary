-- Create favorite_summoners table
  CREATE TABLE IF NOT EXISTS
  favorite_summoners (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES
  auth.users(id) ON DELETE CASCADE,
      puuid VARCHAR(255) NOT NULL,
      game_name VARCHAR(255) NOT NULL,
      tag_line VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT
  CURRENT_TIMESTAMP,
      UNIQUE(user_id, puuid)
  );

  -- Create bookmarked_matches table
  CREATE TABLE IF NOT EXISTS
  bookmarked_matches (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES
  auth.users(id) ON DELETE CASCADE,
      match_id VARCHAR(255) NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT
  CURRENT_TIMESTAMP,
      UNIQUE(user_id, match_id)
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS
  idx_favorite_summoners_user ON
  favorite_summoners(user_id);
  CREATE INDEX IF NOT EXISTS
  idx_bookmarked_matches_user ON
  bookmarked_matches(user_id);

  -- Enable Row Level Security
  ALTER TABLE favorite_summoners ENABLE
  ROW LEVEL SECURITY;
  ALTER TABLE bookmarked_matches ENABLE
  ROW LEVEL SECURITY;

  -- RLS Policies: Users can only 
  see/modify their own data
  CREATE POLICY "Users can view their own
  favorite summoners"
      ON favorite_summoners FOR SELECT
      USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their
  own favorite summoners"
      ON favorite_summoners FOR INSERT
      WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete their
  own favorite summoners"
      ON favorite_summoners FOR DELETE
      USING (auth.uid() = user_id);

  CREATE POLICY "Users can view their own
  bookmarked matches"
      ON bookmarked_matches FOR SELECT
      USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their
  own bookmarked matches"
      ON bookmarked_matches FOR INSERT
      WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete their
  own bookmarked matches"
      ON bookmarked_matches FOR DELETE
      USING (auth.uid() = user_id);