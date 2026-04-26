function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}min ${s.toString().padStart(2, '0')}s`
}

type Props = {
  score: number
  total: number
  timeSpent: number
  byLevel: { iniciante: number; intermediario: number; avancado: number }
}

export default function ResultSummary({ score, total, timeSpent, byLevel }: Props) {
  const pct = Math.round((score / total) * 100)
  return (
    <div className="rounded-2xl bg-card border border-white/10 p-8 flex flex-col gap-6">
      <div className="text-center">
        <p className="text-6xl font-bold text-white">{score}<span className="text-3xl text-slate-400">/{total}</span></p>
        <p className="text-accent-light text-xl font-semibold mt-1">{pct}%</p>
        <p className="text-slate-400 text-sm mt-1">{formatTime(timeSpent)}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {([
          { label: 'Iniciante', value: byLevel.iniciante, color: 'text-emerald-300' },
          { label: 'Intermediário', value: byLevel.intermediario, color: 'text-amber-300' },
          { label: 'Avançado', value: byLevel.avancado, color: 'text-rose-300' },
        ] as const).map(({ label, value, color }) => (
          <div key={label} className="rounded-xl bg-white/5 p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}<span className="text-slate-500 text-sm">/10</span></p>
            <p className="text-slate-400 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
