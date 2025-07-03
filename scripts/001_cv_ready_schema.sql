-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Add avatar_url to existing users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'client';

-- Create user_designs table for storing user uploaded tattoo designs
CREATE TABLE IF NOT EXISTS user_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  design_image_url TEXT NOT NULL,
  feature_vector VECTOR(1024),
  style VARCHAR(50),
  preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_images table for artist portfolio
CREATE TABLE IF NOT EXISTS portfolio_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_hash VARCHAR(64),
  style VARCHAR(50),
  technique VARCHAR(50),
  subject_matter TEXT[],
  tags JSONB,
  feature_vector VECTOR(1024),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(artist_id, image_hash)
);

-- Create match_results table for storing CV algorithm results
CREATE TABLE IF NOT EXISTS match_results (
  user_design_id UUID REFERENCES user_designs(id) ON DELETE CASCADE,
  portfolio_image_id UUID REFERENCES portfolio_images(id) ON DELETE CASCADE,
  similarity_score DECIMAL(5,4),
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_design_id, portfolio_image_id)
);

-- Create artist_profiles table for enhanced artist information
CREATE TABLE IF NOT EXISTS artist_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  display_name VARCHAR(100),
  bio TEXT,
  specialties TEXT[],
  experience_level VARCHAR(20),
  hourly_rate DECIMAL(8,2),
  location VARCHAR(100),
  phone VARCHAR(20),
  instagram VARCHAR(50),
  website VARCHAR(200),
  availability JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_preferences table for client preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  preferred_styles TEXT[],
  budget_range JSONB,
  location VARCHAR(100),
  search_radius INTEGER DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
