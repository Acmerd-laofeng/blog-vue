-- ============================================
-- 修复评论表 RLS 权限 (supabase-fix-comment-policies.sql)
-- 开放 UPDATE 和 DELETE 权限，让后台管理生效
-- ============================================

-- 1. 允许更新（用于：隐藏评论、置顶评论）
DROP POLICY IF EXISTS "Anyone can update comments" ON article_comments;
CREATE POLICY "Anyone can update comments"
ON article_comments FOR UPDATE
USING (true)
WITH CHECK (true);

-- 2. 允许删除（用于：删除评论）
DROP POLICY IF EXISTS "Anyone can delete comments" ON article_comments;
CREATE POLICY "Anyone can delete comments"
ON article_comments FOR DELETE
USING (true);
