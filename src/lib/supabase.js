import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rfjtpgzsnmgpmhtvnrrm.supabase.co'
const supabaseAnonKey = 'sb_publishable_NpaIhQ9S2yg8IsRVFGsA_g_eWgf3i4u' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
