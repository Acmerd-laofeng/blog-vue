-- ============================================
-- 为评论表添加置顶字段 (supabase-add-comment-pinned.sql)
-- 在 Supabase SQL Editor 中运行
-- ============================================

ALTER TABLE article_comments ADD COLUMN IF NOT EXISTS is_pinned boolean default false;
