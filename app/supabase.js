import { createClient } from '@supabase/supabase-js'

// Sacá estos datos de Settings > API en tu panel de Supabase
const supabaseUrl = 'https://lstaiadjehagsvyjhgvf.supabase.co' 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzdGFpYWRqZWhhZ3N2eWpoZ3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MzI4NzUsImV4cCI6MjA5MTEwODg3NX0.2wqUuuZASufLQBrhFknp9wvmbC_YKO8aCsiDVqUsWLk'

export const supabase = createClient(supabaseUrl, supabaseKey)
