// Server-side quiz operations — only import in Server Components or Route Handlers
import { createClient } from '@/lib/supabase/server'
import type { QuizAttempt } from './quiz'

export type { QuizAttempt }

export async function getHistory(userId: string): Promise<QuizAttempt[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('id, score, total, time_spent, completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(10)
  if (error) throw error
  return data ?? []
}
