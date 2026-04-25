-- Add avatar_url column to profiles table (was missing from initial schema).
alter table public.profiles
  add column if not exists avatar_url text;
