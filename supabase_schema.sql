-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles (Members)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  role text default 'Membro',
  avatar_url text,
  income numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 2. Categories
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id), -- Owner (optional if global)
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

drop policy if exists "Categories are viewable by everyone" on categories;
create policy "Categories are viewable by everyone" on categories for select using (true);

drop policy if exists "Users can insert categories" on categories;
create policy "Users can insert categories" on categories for insert with check (true);

-- 3. Accounts
create table if not exists public.accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  name text not null,
  type text not null,
  balance numeric default 0,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.accounts enable row level security;

drop policy if exists "Accounts viewable by everyone" on accounts;
create policy "Accounts viewable by everyone" on accounts for select using (true);

drop policy if exists "Users can insert accounts" on accounts;
create policy "Users can insert accounts" on accounts for insert with check (true);

-- 4. Cards
create table if not exists public.cards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  name text not null,
  limit_amount numeric default 0,
  current_invoice numeric default 0,
  closing_day integer,
  due_day integer,
  last_4_digits text,
  theme text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.cards enable row level security;

drop policy if exists "Cards viewable by everyone" on cards;
create policy "Cards viewable by everyone" on cards for select using (true);

drop policy if exists "Users can insert cards" on cards;
create policy "Users can insert cards" on cards for insert with check (true);

-- 5. Goals
create table if not exists public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  name text not null,
  description text,
  target_amount numeric not null,
  current_amount numeric default 0,
  deadline date,
  status text default 'active',
  yield_type text default 'CDI',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.goals enable row level security;

drop policy if exists "Goals viewable by everyone" on goals;
create policy "Goals viewable by everyone" on goals for select using (true);

drop policy if exists "Users can manage goals" on goals;
create policy "Users can manage goals" on goals for ALL using (true);

-- 6. Transactions
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id), -- Who created/owns it
  member_id uuid references public.profiles(id), -- Who it belongs to (could be same)
  account_id uuid references public.accounts(id), -- Optional link to account
  card_id uuid references public.cards(id), -- Optional link to card
  type text not null check (type in ('income', 'expense')),
  amount numeric not null,
  description text not null,
  category text, 
  date date not null,
  status text default 'completed',
  installments integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;

drop policy if exists "Transactions viewable by everyone" on transactions;
create policy "Transactions viewable by everyone" on transactions for select using (true);

drop policy if exists "Users can manage transactions" on transactions;
create policy "Users can manage transactions" on transactions for ALL using (true);

-- Seed Data (Optional, run strictly AFTER creating a user manually via Auth)
-- This part is illustrative. The app will likely start empty or we can migrate logic.
