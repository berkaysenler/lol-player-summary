-- Create summoners table
CREATE TABLE IF NOT EXISTS summoners (
    id SERIAL PRIMARY KEY,
    puuid VARCHAR(255) UNIQUE NOT NULL,
    game_name VARCHAR(255) NOT NULL,
    tag_line VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    match_id VARCHAR(255) UNIQUE NOT NULL,
    match_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days')
);

-- Create coaching table
CREATE TABLE IF NOT EXISTS coaching (
    id SERIAL PRIMARY KEY,
    match_id VARCHAR(255) NOT NULL,
    puuid VARCHAR(255) NOT NULL,
    coaching_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (puuid) REFERENCES summoners(puuid)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_summoners_puuid ON summoners(puuid);
CREATE INDEX IF NOT EXISTS idx_matches_match_id ON matches(match_id);
CREATE INDEX IF NOT EXISTS idx_coaching_match_puuid ON coaching(match_id, puuid);
