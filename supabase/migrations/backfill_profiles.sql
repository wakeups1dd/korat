-- Migration script to create profiles for existing users
-- Run this AFTER running schema.sql if you have existing users

-- This will create profile entries for any users who signed up before the trigger was added
insert into public.profiles (id, email, full_name)
select 
  id,
  email,
  coalesce(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', 'User') as full_name
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;

-- Verify migration
-- SELECT COUNT(*) as total_users FROM auth.users;
-- SELECT COUNT(*) as total_profiles FROM profiles;
-- (These two numbers should match after running this migration)
