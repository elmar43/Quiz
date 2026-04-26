import type { QuizAttempt } from '@/lib/quiz-server'
import { formatTime } from '@/lib/format'

export default function HistoryList({ attempts }: { attempts: QuizAttempt[] }) {
  if (attempts.length === 0) {
    return <p className="text-slate-500 text-sm text-center py-4">Nenhuma tentativa anterior.</p>
  }
  return (
    <div className="flex flex-col gap-2">
      <h3 id="history-heading" className="text-slate-300 font-semibold text-sm uppercase tracking-wide mb-1">Histórico</h3>
      <ul aria-labelledby="history-heading" className="flex flex-col gap-2 list-none p-0 m-0">
        {attempts.map((a) => (
          <li key={a.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <span className="text-slate-400 text-sm">
              <time dateTime={a.completed_at}>
                {new Date(a.completed_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </time>
            </span>
            <span className="text-white font-semibold" aria-label={`Pontuação: ${a.score} de ${a.total}`}>{a.score}/{a.total}</span>
            <span className="text-slate-500 text-sm" aria-label={`Tempo: ${formatTime(a.time_spent)}`}>{formatTime(a.time_spent)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
