-- Supabase 配置 SQL
-- 在 Supabase 控制台 → SQL Editor 中执行

-- 1. 关闭 RLS（行级安全），允许匿名读写
ALTER TABLE IF EXISTS companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS articles DISABLE ROW LEVEL SECURITY;

-- 2. 如果表不存在则创建
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

CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  category TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city);
CREATE INDEX IF NOT EXISTS idx_companies_province ON companies(province);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date);

-- 4. 插入示例数据（如果表为空）
INSERT INTO companies (name, province, city, industry, size, schedule, salary, rating, description, website, tags)
SELECT '腾讯科技', '广东', '深圳', '互联网', '10000+', '双休', '15K-30K', 4.5, '腾讯是一家领先的互联网科技公司，主营社交、游戏、金融科技等业务。', 'https://www.tencent.com', ARRAY['大厂', '福利好', '技术强']
WHERE NOT EXISTS (SELECT 1 FROM companies LIMIT 1);

INSERT INTO companies (name, province, city, industry, size, schedule, salary, rating, description, website, tags)
SELECT '华为技术', '广东', '深圳', '通信/硬件', '10000+', '大小周', '20K-40K', 4.2, '华为是全球领先的通信设备和智能终端提供商。', 'https://www.huawei.com', ARRAY['大厂', '薪资高', '加班多']
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = '华为技术');

INSERT INTO companies (name, province, city, industry, size, schedule, salary, rating, description, website, tags)
SELECT '字节跳动', '北京', '北京', '互联网', '10000+', '双休', '18K-35K', 4.3, '字节跳动是全球领先的短视频和资讯平台。', 'https://www.bytedance.com', ARRAY['大厂', '成长快', '扁平管理']
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = '字节跳动');
