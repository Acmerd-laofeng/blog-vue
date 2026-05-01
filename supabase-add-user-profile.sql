-- ============================================
-- 用户系统升级 (supabase-add-user-profile.sql)
-- 分步执行，确保稳健
-- ============================================

-- Step 1: 添加字段（如果不存在）
DO $$ 
BEGIN
  -- 添加 uid
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='uid') THEN
    ALTER TABLE profiles ADD COLUMN uid TEXT UNIQUE;
  END IF;
  
  -- 添加 avatar_url
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='avatar_url') THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
  END IF;
  
  -- 添加 nickname_changes_left
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='nickname_changes_left') THEN
    ALTER TABLE profiles ADD COLUMN nickname_changes_left INT DEFAULT 3;
  END IF;
  
  -- 添加 last_nickname_change
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='last_nickname_change') THEN
    ALTER TABLE profiles ADD COLUMN last_nickname_change TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- 添加 is_admin
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='is_admin') THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- 添加 is_banned
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='is_banned') THEN
    ALTER TABLE profiles ADD COLUMN is_banned BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Step 2: 为已有用户生成 UID
UPDATE profiles SET uid = 'u' || substr(md5(random()::text || id), 1, 12) WHERE uid IS NULL;

-- Step 3: 创建触发器函数（先删除旧的）
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_uid TEXT;
BEGIN
  new_uid := 'u' || substr(md5(random()::text || NEW.id), 1, 12);
  
  INSERT INTO public.profiles (
    id, 
    username, 
    uid, 
    avatar_url, 
    nickname_changes_left, 
    is_admin, 
    is_banned
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    new_uid,
    NULL,
    3,
    FALSE,
    FALSE
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: 创建触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Step 5: 策略（先删后建）
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
CREATE POLICY "Public can view profiles" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- 完成提示
SELECT '✅ 用户系统升级完成！' AS status;
