import { createClient } from '@supabase/supabase-js'

// ⚠️ Điền thông tin Supabase của bạn vào đây
// Lấy từ: Supabase Dashboard → Project Settings → API
const SUPABASE_URL = 'https://hjwzsopwimndvdkykxfy.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_ZA8fOkh_7bfiqk5YkYAxPQ_1Vf17C0b'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
