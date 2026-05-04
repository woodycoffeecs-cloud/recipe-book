import { createClient } from '@supabase/supabase-js'

// ⚠️ Điền thông tin Supabase của bạn vào đây
// Lấy từ: Supabase Dashboard → Project Settings → API
const SUPABASE_URL = 'https://pxfmbdkeloqfelyszale.supabase.co/rest/v1/'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Zm1iZGtlbG9xZmVseXN6YWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NjMwMDgsImV4cCI6MjA5MzQzOTAwOH0.tc68NtSU4HIo1PnVowLlEMsfvgp5r1bG0NMoQ_uf7v4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
