-- Create a table to store daily habit status
create table public.daily_habits (
  id bigint generated always as identity primary key,
  user_name text not null,
  date_str text not null, -- Stores "1", "2", etc. matching the app's day logic
  habit_name text not null,
  status smallint not null default 0, -- 0: Empty, 1: Completed, 2: Incomplete
  updated_at timestamptz default now()
);

-- Add a unique constraint to ensure one status per habit per day per user
alter table public.daily_habits
  add constraint daily_habits_unique_entry 
  unique (user_name, date_str, habit_name);

-- Enable Row Level Security (RLS)
alter table public.daily_habits enable row level security;

-- Create a policy that allows anyone to read/write (since this is a simple family app)
-- Ideally, you would restrict this to authenticated users, but for this step we'll allow anon access
create policy "Allow public access"
  on public.daily_habits
  for all
  using (true)
  with check (true);
