import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zyeixswgxrwybolobnzn.supabase.co'
const supabaseKey = 'sb_publishable_ikjsQdgDQ0tJlE-XKVydSA_9dMD7cvj'

export const supabase = createClient(supabaseUrl, supabaseKey)