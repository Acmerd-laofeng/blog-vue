-- Supabase 数据库初始化 SQL
-- 在 Supabase 控制台 → SQL Editor 中执行

-- 1. 创建企业表
CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  industry TEXT NOT NULL,
  size TEXT DEFAULT '',
  schedule TEXT NOT NULL,
  salary TEXT DEFAULT '',
  rating DECIMAL DEFAULT 4.0,
  description TEXT DEFAULT '',
  website TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建文章表
CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  category TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建索引加速查询
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city);
CREATE INDEX IF NOT EXISTS idx_companies_province ON companies(province);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_schedule ON companies(schedule);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date);

-- 4. 插入示例企业数据
INSERT INTO companies (name, province, city, industry, size, schedule, salary, rating, description, website, tags) VALUES
('腾讯科技', '广东', '深圳', '互联网', '10000+', '双休', '15K-30K', 4.5, '腾讯是一家领先的互联网科技公司，主营社交、游戏、金融科技等业务。', 'https://www.tencent.com', ARRAY['大厂', '福利好', '技术强']),
('华为技术', '广东', '深圳', '通信/硬件', '10000+', '大小周', '20K-40K', 4.2, '华为是全球领先的通信设备和智能终端提供商。', 'https://www.huawei.com', ARRAY['大厂', '薪资高', '加班多']),
('字节跳动', '北京', '北京', '互联网', '10000+', '双休', '18K-35K', 4.3, '字节跳动是全球领先的短视频和资讯平台。', 'https://www.bytedance.com', ARRAY['大厂', '成长快', '扁平管理']);

-- 5. 设置行级安全策略（RLS）
-- 允许所有人读取企业数据
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies are viewable by everyone" ON companies
  FOR SELECT USING (true);
-- 只有认证用户才能修改
CREATE POLICY "Companies insertable only by authenticated users" ON companies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Companies updatable only by authenticated users" ON companies
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Companies deletable only by authenticated users" ON companies
  FOR DELETE USING (auth.role() = 'authenticated');

-- 允许所有人读取文章数据
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Articles are viewable by everyone" ON articles
  FOR SELECT USING (true);
CREATE POLICY "Articles insertable only by authenticated users" ON articles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Articles updatable only by authenticated users" ON articles
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Articles deletable only by authenticated users" ON articles
  FOR DELETE USING (auth.role() = 'authenticated');
