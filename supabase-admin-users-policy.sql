-- ============================================
-- 赋予管理员管理用户的权限 (supabase-admin-users-policy.sql)
-- ============================================

-- 允许管理员修改任何人的资料（比如封禁、提拔管理员）
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    -- 检查当前操作的人是不是管理员
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  )
  WITH CHECK (true);
