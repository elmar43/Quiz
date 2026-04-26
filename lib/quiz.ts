// Client-side quiz operations — safe to import in 'use client' components
import { createClient } from '@/lib/supabase/client'

export type AnswerRecord = {
  question_id: string
  user_answer: boolean
  correct: boolean
}

export type QuizAttempt = {
  id: string
  score: number
  total: number
  time_spent: number
  completed_at: string
}

export async function saveAttempt({
  userId,
  score,
  timeSpent,
  answers,
}: {
  userId: string
  score: number
  timeSpent: number
  answers: AnswerRecord[]
}) {
  const supabase = createClient()
  const { error } = await supabase.from('quiz_attempts').insert({
    user_id: userId,
    score,
    total: 30,
    time_spent: timeSpent,
    answers,
  })
  if (error) throw error
}
