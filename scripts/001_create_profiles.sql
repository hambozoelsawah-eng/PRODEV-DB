-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Allow users to view their own profile
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Allow users to insert their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Allow users to delete their own profile
create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);
