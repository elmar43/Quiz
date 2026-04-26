type Props = {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-slate-400 mb-2" aria-hidden="true">
        <span>{current} / {total}</span>
        <span>{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Pergunta ${current} de ${total}`}
        className="h-2 rounded-full bg-white/10 overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
