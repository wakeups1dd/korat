-- KORAT Database Schema Setup
-- Run these SQL commands in Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/iqntegqrnqjwgchhppmf/sql

-- ============================================
-- 1. CREATE PROFILES TABLE
-- ============================================
-- Stores user metadata and preferences
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- RLS Policy: Users can only read their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- RLS Policy: Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ============================================
-- 2. CREATE AUDITS TABLE
-- ============================================
-- Stores SEO scan results for each URL
create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  url text not null,
  
  -- Overall scores (0-100)
  overall_score integer,
  performance_score integer,
  accessibility_score integer,
  seo_score integer,
  technical_score integer,
  
  -- Detailed results (stored as JSONB for flexibility)
  performance_issues jsonb default '[]'::jsonb,
  seo_issues jsonb default '[]'::jsonb,
  accessibility_issues jsonb default '[]'::jsonb,
  technical_issues jsonb default '[]'::jsonb,
  
  -- Metadata
  scanned_at timestamp with time zone default now(),
  scan_duration_ms integer,
  
  -- Quick stats
  internal_links_count integer default 0,
  images_count integer default 0,
  word_count integer default 0,
  security_grade text default 'N/A'
);

-- Enable Row Level Security
alter table audits enable row level security;

-- RLS Policy: Users can view their own audits
create policy "Users can view own audits"
  on audits for select
  using (auth.uid() = user_id);

-- RLS Policy: Users can create audits
create policy "Users can create audits"
  on audits for insert
  with check (auth.uid() = user_id);

-- Create indexes for faster queries
create index if not exists audits_user_id_idx on audits(user_id);
create index if not exists audits_scanned_at_idx on audits(scanned_at desc);
create index if not exists audits_url_idx on audits(url);

-- ============================================
-- 3. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
-- Function to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', 'User')
  );
  return new;
end;
$$;

-- Drop trigger if it exists (for re-running this script)
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger on auth.users table
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- 4. VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything is set up correctly

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check profiles table structure
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';

-- Check audits table structure
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'audits';

-- Check RLS policies
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Test profile creation (should automatically create when you sign up)
-- SELECT * FROM profiles WHERE id = auth.uid();

-- ============================================
-- NOTES
-- ============================================
-- 1. Run these commands in order in the Supabase SQL Editor
-- 2. If you get "already exists" errors, that's okay - it means tables are already created
-- 3. Test by creating a new user account - a profile should auto-create
-- 4. The trigger will NOT create profiles for existing users - they need to be added manually or via migration
