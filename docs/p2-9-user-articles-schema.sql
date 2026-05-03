-- P2-9 用户投稿：为 articles 表添加 user_id 字段
-- 在 Supabase SQL Editor 运行

-- 1. 添加 user_id 字段（如果不存在）
alter table articles add column if not exists user_id uuid references auth.users(id);

-- 2. 更新现有文章为管理员（可选）
-- update articles set user_id = (select id from auth.users where email = '1902768564@qq.com') where user_id is null;

-- 3. RLS 策略：允许登录用户插入自己的文章
create policy "Users can insert own articles" on articles for insert with check (auth.uid() = user_id);

-- 4. 更新 admin 策略（管理员可管理所有）
-- 如果已有策略，先删除旧的
drop policy if exists "Authenticated users can manage articles" on articles;
create policy "Admin can manage all articles" on articles for all using (auth.jwt() ->> 'email' = '1902768564@qq.com');

-- 5. 所有人都可读
drop policy if exists "Public can view articles" on articles;
create policy "Public can view articles" on articles for select using (true);
