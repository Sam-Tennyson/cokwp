import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tstxopjzrizdulhfkpuz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzdHhvcGp6cml6ZHVsaGZrcHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMTc1MTcsImV4cCI6MjA3NDY5MzUxN30.a-z3XwoPmkTnXj8VlFtYXXfVjVP4gG8Ire0-RUJgQbE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
