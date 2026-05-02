// fix-categories.js - 使用内置 fetch
const SUPABASE_URL = 'https://xeafkqwyygsblckgimrl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_imv-JbFeucinBTlNHa1FzA_MXq-5CkV';

async function fixCategory(id, category) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ category })
  });
  
  const status = response.status;
  console.log(`ID ${id} -> ${category}: ${status === 204 ? '✅' : '❌' + status}`);
}

await fixCategory(15, '书评文学');
await fixCategory(17, '投资理财');

console.log('\n🎉 分类修正完成!');
