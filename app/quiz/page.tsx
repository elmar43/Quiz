'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateSession, type Question } from '@/lib/questions'
import { createClient } from '@/lib/supabase/client'
import { saveAttempt, type AnswerRecord } from '@/lib/quiz'
import QuizCard from '@/components/QuizCard'
import ProgressBar from '@/components/ProgressBar'
import LevelBadge from '@/components/LevelBadge'

export default function QuizPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const startTimeRef = useRef<number>(Date.now())
  const [saving, setSaving] = useState(false)
  const [answering, setAnswering] = useState(false)

  useEffect(() => {
    setQuestions(generateSession())
    startTimeRef.current = Date.now()
  }, [])

  const handleAnswer = async (userAnswer: boolean) => {
    if (saving || answering || questions.length === 0) return
    setAnswering(true)

    const question = questions[currentIndex]
    const record: AnswerRecord = {
      question_id: question.id,
      user_answer: userAnswer,
      correct: userAnswer === question.answer,
    }
    const newAnswers = [...answers, record]

    if (currentIndex < questions.length - 1) {
      setAnswers(newAnswers)
      setCurrentIndex((i) => i + 1)
      setAnswering(false)
      return
    }

    // Last question — save and redirect
    setSaving(true)
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
    const score = newAnswers.filter((a) => a.correct).length

    const ini = newAnswers.filter((a) => a.question_id.startsWith('ini') && a.correct).length
    const int = newAnswers.filter((a) => a.question_id.startsWith('int') && a.correct).length
    const adv = newAnswers.filter((a) => a.question_id.startsWith('adv') && a.correct).length

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await saveAttempt({ userId: session.user.id, score, timeSpent, answers: newAnswers })
      }
    } catch {
      // non-blocking — still redirect
    }

    router.push(`/result?score=${score}&time=${timeSpent}&ini=${ini}&int=${int}&adv=${adv}`)
  }

  if (questions.length === 0) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center">
        <div
          role="status"
          aria-label="Carregando quiz…"
          className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"
        />
      </main>
    )
  }

  const current = questions[currentIndex]

  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <LevelBadge level={current.level} />
        </div>
        <ProgressBar current={currentIndex + 1} total={questions.length} />
        <QuizCard
          key={currentIndex}
          statement={current.statement}
          onAnswer={handleAnswer}
        />
        <p role="status" aria-live="polite" className="text-center text-slate-500 text-sm min-h-[1.25rem]">
          {saving ? 'Salvando resultado…' : ''}
        </p>
      </div>
    </main>
  )
}
