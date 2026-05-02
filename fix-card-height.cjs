const fs = require('fs');
const path = 'E:\\blog-vue\\src\\views\\ArticlesView.vue';
let content = fs.readFileSync(path, 'utf8');

// 插入 CSS 补丁到 </style> 之前
const fix = `
/* 修复无封面图卡片过高 */
.article-card:has(.article-card__placeholder) .article-card__image {
  aspect-ratio: auto;
  height: 120px;
}
`;

content = content.replace('</style>', fix + '</style>');
fs.writeFileSync(path, content, 'utf8');
console.log('✅ ArticlesView.vue 修复完成!');
