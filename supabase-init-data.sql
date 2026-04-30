-- ============================================
-- Acmerd 一键初始化 + 示例数据脚本 (修复版)
-- 在 Supabase SQL Editor 中直接运行即可
-- ============================================

-- 1. 补全缺失字段 (如果不存在则添加)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS category TEXT;

-- 2. 清理旧数据 (可选，防止重复)
-- DELETE FROM articles;
-- DELETE FROM banners;

-- 3. 插入示例文章 (5 篇)
INSERT INTO articles (title, date, category, summary, content, cover_url) 
SELECT 
  'Acmerd 正式上线', 
  '2026-04-30', 
  '公告', 
  '企业信息收录平台 Acmerd 正式上线，提供企业作息、薪资等信息查询服务。',
  '<p>欢迎来到 Acmerd！</p><p>我们是一个专注于企业信息收录的平台...</p>',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1464&h=600&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title = 'Acmerd 正式上线');

INSERT INTO articles (title, date, category, summary, content, cover_url) 
SELECT 
  '如何使用企业筛选功能', 
  '2026-04-29', 
  '教程', 
  '详细讲解如何使用 Acmerd 的企业筛选功能，快速找到你关心的企业信息。',
  '<h2>企业筛选功能介绍</h2><p>Acmerd 提供多维度企业筛选功能...</p>',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1464&h=600&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title = '如何使用企业筛选功能');

INSERT INTO articles (title, date, category, summary, content, cover_url) 
SELECT 
  '2026 年互联网行业薪资报告', 
  '2026-04-28', 
  '数据', 
  '基于 Acmerd 收录的企业数据，分析 2026 年互联网行业薪资趋势。',
  '<h2>2026 互联网薪资趋势</h2><p>基于平台收录的 500+ 家企业数据...</p>',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1464&h=600&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title = '2026 年互联网行业薪资报告');

INSERT INTO articles (title, date, category, summary, content, cover_url) 
SELECT 
  '职场新人避坑指南', 
  '2026-04-27', 
  '经验', 
  '写给刚入职场的朋友，分享如何避免常见职场陷阱。',
  '<h2>职场新人必看</h2><p>刚入职场，有很多坑需要避免...</p>',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1464&h=600&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title = '职场新人避坑指南');

INSERT INTO articles (title, date, category, summary, content, cover_url) 
SELECT 
  '996 还是 965？企业作息大揭秘', 
  '2026-04-26', 
  '调查', 
  '调查 200+ 家互联网企业的真实工作时间，数据说话。',
  '<h2>工作时间调查</h2><p>我们调查了平台上 200+ 家企业的真实工作时间...</p>',
  'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=1464&h=600&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title = '996 还是 965？企业作息大揭秘');

-- 4. 插入示例轮播图 (3 张)
INSERT INTO banners (title, image_url, link_url, sort_order, is_active)
SELECT '欢迎来到 Acmerd', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1464&h=600&fit=crop', '/articles', 1, true
WHERE NOT EXISTS (SELECT 1 FROM banners WHERE title = '欢迎来到 Acmerd');

INSERT INTO banners (title, image_url, link_url, sort_order, is_active)
SELECT '企业薪资透明化', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1464&h=600&fit=crop', '/companies', 2, true
WHERE NOT EXISTS (SELECT 1 FROM banners WHERE title = '企业薪资透明化');

INSERT INTO banners (title, image_url, link_url, sort_order, is_active)
SELECT '职场经验分享', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1464&h=600&fit=crop', '/create', 3, true
WHERE NOT EXISTS (SELECT 1 FROM banners WHERE title = '职场经验分享');
