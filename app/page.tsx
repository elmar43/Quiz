import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OAuthButtons } from '@/components/OAuthButtons'

export default async function LandingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/quiz')

  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 mx-auto" aria-hidden="true">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Quiz Claude Code
          </h1>
          <p className="text-slate-400 text-lg">
            Verdadeiro ou Falso? Teste seus conhecimentos sobre o Claude Code em 30 perguntas — Iniciante, Intermediário e Avançado.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p id="login-desc" className="text-slate-500 text-sm">Faça login para começar e salvar seu histórico</p>
          <OAuthButtons />
        </div>
      </div>
    </main>
  )
}
