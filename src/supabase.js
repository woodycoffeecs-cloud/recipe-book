import { createClient } from '@supabase/supabase-js'

// ⚠️ Điền thông tin Supabase của bạn vào đây
// Lấy từ: Supabase Dashboard → Project Settings → API
const SUPABASE_URL = 'https://hjwzsopwimndvdkykxfy.supabase.co/rest/v1/'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqd3pzb3B3aW1uZHZka3lreGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NjYyODIsImV4cCI6MjA5MzQ0MjI4Mn0.vIGcRi6Rnvz39bVPAGy2ONnG9-0K4mg2JetiwepvY9w'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
