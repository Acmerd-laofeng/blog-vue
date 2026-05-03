-- Banner 关联文章：添加 article_id 字段
alter table banners add column if not exists article_id bigint references articles(id);
