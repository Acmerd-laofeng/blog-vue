-- ============================================
-- 增加用户禁言功能 (supabase-add-ban-feature.sql)
-- ============================================

-- 1. 增加 is_banned 字段
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_banned boolean default false;
