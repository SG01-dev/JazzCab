import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dvdwkuasgccqzezhiwpt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZHdrdWFzZ2NjcXplemhpd3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDE4MjEsImV4cCI6MjA5ODUxNzgyMX0.hCKHlS94L_usPxJCRrpY37FFxoHIIpXXYHIOb9_8ipw'

export const supabase = createClient(supabaseUrl, supabaseKey)