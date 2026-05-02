// import-articles.js - 批量导入公众号文章到 Supabase
// 用法: node import-articles.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://xeafkqwyygsblckgimrl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_imv-JbFeucinBTlNHa1FzA_MXq-5CkV';

const ARTICLES_DIR = 'E:\\OpenClaw\\Data\\.openclaw\\workspace\\temp\\batch_import_2';

// 文章分类映射
const CATEGORIES = {
  '新收入': '职场财富',
  '林门郑氏': '书评文学',
  '秦二世': '历史小说',
  '达尔文': '投资理财',
  '副业': '职场随笔',
  'Vue': '技术教程',
  '纳瓦尔': '读书笔记',
  '土木堡': '历史故事',
  'Acmerd': '开发记录',
  '独处': '随笔杂谈',
  '极简': '设计美学',
  '内耗': '个人成长',
  '奥本海默': '影视书评',
  '定投': '投资理财'
};

// 解析 Markdown 文件
function parseMarkdown(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  
  // 提取标题（第一个 # 开头的行）
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : path.basename(filePath, '.md');
  
  // 移除 > 引用块（公众号文章的引用样式）
  let content = raw.replace(/^>\s+.+$/gm, '').trim();
  
  // 生成摘要（取前 200 字）
  const summary = content.replace(/[#*_`>]/g, '').substring(0, 200).trim() + '...';
  
  return {
    title,
    content,
    summary,
    category: getCategorie(title)
  };
}

function getCategorie(title) {
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    if (title.includes(key)) return cat;
  }
  return '其他';
}

// 插入文章到 Supabase
async function insertArticle(article) {
  const body = JSON.stringify({
    title: article.title,
    content: article.content,
    summary: article.summary,
    category: article.category,
    date: new Date().toISOString().split('T')[0],
    view_count: 0
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=representation'
    },
    body
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`插入失败: ${response.status} - ${error}`);
  }

  return await response.json();
}

// 主函数
async function main() {
  console.log('🚀 开始导入公众号文章...\n');
  
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
  console.log(`📂 找到 ${files.length} 篇文章\n`);
  
  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    const article = parseMarkdown(filePath);
    
    console.log(`📝 正在导入: ${article.title}`);
    console.log(`   分类: ${article.category}`);
    console.log(`   字数: ${article.content.length} 字`);
    
    try {
      const result = await insertArticle(article);
      console.log(`   ✅ 成功! ID: ${result[0]?.id}\n`);
    } catch (error) {
      console.log(`   ❌ 失败: ${error.message}\n`);
    }
  }
  
  console.log('🎉 导入完成!');
}

main().catch(console.error);
