-- ============================================
-- 创建文章评论表 (supabase-create-comments.sql)
-- 在 Supabase SQL Editor 中运行
-- ============================================

-- 1. 创建表
create table if not exists article_comments (
  id bigint primary key generated always as identity,
  article_id int not null,
  user_name text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_approved boolean default true
);

-- 2. 开启 RLS (行级安全)
alter table article_comments enable row level security;

-- 3. 创建策略 (Policy)

-- 所有人可见已审核的评论
create policy "Anyone can read approved comments" 
on article_comments for select 
using (is_approved = true);

-- 所有人都可以发表评论
create policy "Anyone can insert comments" 
on article_comments for insert 
with check (true);
