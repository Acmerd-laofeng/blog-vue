-- ============================================
-- 用户系统升级 (supabase-add-user-profile.sql)
-- ============================================

-- 1. 确保 profiles 表存在
create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  username text,
  uid text unique,
  avatar_url text,
  nickname_changes_left int default 3,
  last_nickname_change timestamp with time zone,
  is_admin boolean default false,
  is_banned boolean default false,
  created_at timestamp with time zone default now()
);

-- 2. 创建触发器：新用户注册时自动创建 profile 并生成 UID
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, uid)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    'u' || substr(md5(random()::text || new.email || new.id), 1, 12)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();

-- 3. 为已有用户创建 profile（如果还没有的话）
insert into public.profiles (id, username, uid)
select 
  au.id,
  au.raw_user_meta_data->>'username',
  'u' || substr(md5(random()::text || au.email || au.id), 1, 12)
from auth.users au
where au.id not in (select id from public.profiles)
on conflict (id) do nothing;

-- 4. 允许用户更新自己的资料
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- 5. 允许公开查询用户（通过 uid 搜索）
create policy "Public can view profiles" on profiles
  for select using (true);

-- 6. 允许管理员更新所有用户资料
create policy "Admins can update all profiles" on profiles
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
  );
