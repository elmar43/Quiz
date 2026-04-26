type Level = 'iniciante' | 'intermediario' | 'avancado'

const styles: Record<Level, string> = {
  iniciante: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  intermediario: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  avancado: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
}

const labels: Record<Level, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

export default function LevelBadge({ level }: { level: Level }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[level]}`}>
      {labels[level]}
    </span>
  )
}
