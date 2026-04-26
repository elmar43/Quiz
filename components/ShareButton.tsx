'use client'

import { useState } from 'react'
import { formatTime } from '@/lib/format'

type Props = {
  score: number
  total: number
  timeSpent: number
  advancedScore: number
  siteUrl: string
}

export default function ShareButton({ score, total, timeSpent, advancedScore, siteUrl }: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const pct = Math.round((score / total) * 100)
    const text = `Completei o Quiz de Claude Code!\nScore: ${score}/${total} (${pct}%) em ${formatTime(timeSpent)}\nAvançado: ${advancedScore}/10 ✓\nTesta você também → ${siteUrl}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={handleShare}
        aria-describedby="share-status"
        className="w-full py-3 rounded-xl bg-accent hover:bg-accent-light active:scale-95 transition-all font-semibold text-white focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
      >
        {copied ? 'Copiado!' : 'Compartilhar resultado'}
      </button>
      <span id="share-status" role="status" aria-live="polite" className="sr-only">
        {copied ? 'Resultado copiado para a área de transferência.' : ''}
      </span>
    </>
  )
}
