-- ============================================
-- 初始化用户系统 (supabase-init-user-system.sql)
-- ============================================

-- 1. 创建用户资料表
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  bio text,
  is_admin boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. 开启 RLS
alter table public.profiles enable row level security;

-- 3. 权限策略
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id )
  with check ( auth.uid() = id );

-- 4. 自动创建资料 (Trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url, bio, is_admin)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), 
    new.raw_user_meta_data->>'avatar_url', 
    new.raw_user_meta_data->>'bio',
    new.raw_user_meta_data->>'is_admin' = 'true'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
