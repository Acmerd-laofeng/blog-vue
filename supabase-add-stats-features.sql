-- ============================================
-- 增加数据统计功能 (supabase-add-stats-features.sql)
-- ============================================

-- 1. 给文章表增加 view_count 字段
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS view_count int default 0;

-- 2. 创建原子递增函数 (防止并发冲突)
CREATE OR REPLACE FUNCTION public.increment_view_count(article_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.articles SET view_count = view_count + 1 WHERE id = article_id;
END;
$$;
