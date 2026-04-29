import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xeafkqwyygsblckgimrl.supabase.co'
const supabaseAnonKey = 'sb_publishable_imv-JbFeucinBTlNHa1FzA_MXq-5CkV'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
