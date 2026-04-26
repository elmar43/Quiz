import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getHistory } from '@/lib/quiz-server'
import ResultSummary from '@/components/ResultSummary'
import HistoryList from '@/components/HistoryList'
import ShareButton from '@/components/ShareButton'

type Props = {
  searchParams: { score?: string; time?: string; ini?: string; int?: string; adv?: string }
}

export default async function ResultPage({ searchParams }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const clamp = (v: number, max: number) => (isNaN(v) ? 0 : Math.max(0, Math.min(max, v)))
  const score = clamp(parseInt(searchParams.score ?? '0', 10), 30)
  const timeSpent = clamp(parseInt(searchParams.time ?? '0', 10), 86400)
  const ini = clamp(parseInt(searchParams.ini ?? '0', 10), 10)
  const int_ = clamp(parseInt(searchParams.int ?? '0', 10), 10)
  const adv = clamp(parseInt(searchParams.adv ?? '0', 10), 10)

  const history = await getHistory(user.id).catch(() => [])
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-white text-center">Resultado</h1>

        <ResultSummary
          score={score}
          total={30}
          timeSpent={timeSpent}
          byLevel={{ iniciante: ini, intermediario: int_, avancado: adv }}
        />

        <div className="flex flex-col gap-3">
          <ShareButton
            score={score}
            total={30}
            timeSpent={timeSpent}
            advancedScore={adv}
            siteUrl={siteUrl}
          />
          <Link
            href="/quiz"
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all font-semibold text-white text-center"
          >
            Jogar novamente
          </Link>
        </div>

        <HistoryList attempts={history} />
      </div>
    </main>
  )
}
