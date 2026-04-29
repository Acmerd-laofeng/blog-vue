import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xeafkqwyygsblckgimrl.supabase.co'
// 使用你提供的 Publishable key
const supabaseAnonKey = 'sb_publishable_imv-JbFeucinBTlNHa1FzA_MXq-5CkV'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
