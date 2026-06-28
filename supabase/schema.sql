-- ============================================================================
-- Pitch Conditions — Supabase schema
-- Run this in your Supabase project: Dashboard → SQL Editor → New query → Run.
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. profiles table
-- ----------------------------------------------------------------------------
-- Supabase already stores auth data (email, password/OTP, etc.) in the private
-- `auth.users` table. We DON'T touch that. Instead we keep app-specific profile
-- data in our own `public.profiles` table, linked 1:1 to a user by id.
--
-- `id` references auth.users(id): if a user is ever deleted, their profile is
-- removed too (ON DELETE CASCADE).
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text,
  full_name     text,
  favorite_team text,
  home_city     text,
  -- Constrained to two allowed values so bad data can't sneak in.
  temp_unit     text not null default 'fahrenheit'
                check (temp_unit in ('fahrenheit', 'celsius')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. Row-Level Security (RLS)
-- ----------------------------------------------------------------------------
-- This is the part that actually protects the data. With RLS ON, every query
-- is denied by default; the policies below carve out exactly what's allowed.
-- `auth.uid()` is the id of the currently logged-in user. So each policy says
-- "only when the row's id == the caller's id" — i.e. you can only see/edit
-- your OWN profile, never anyone else's.
alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 3. Auto-create a profile row when someone signs up
-- ----------------------------------------------------------------------------
-- Rather than make the app insert a profile after signup, we do it in the
-- database with a trigger. When a new row lands in auth.users, this function
-- creates the matching profiles row. `security definer` lets it run with
-- elevated rights so it can write the row regardless of RLS.
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
    -- full_name comes from the data we pass at sign-in (user metadata).
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 4. Keep updated_at fresh on every update
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
