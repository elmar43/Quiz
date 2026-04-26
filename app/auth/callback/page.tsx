'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      router.replace('/')
      return
    }
    const supabase = createClient()
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setErrorMsg(error.message)
      } else {
        router.replace('/quiz')
      }
    })
  }, [router, searchParams])

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-red-400 font-semibold">Erro de autenticação</p>
        <p className="text-slate-300 text-sm font-mono bg-slate-800 px-4 py-2 rounded">{errorMsg}</p>
        <a href="/" className="text-accent underline text-sm">Voltar</a>
      </div>
    )
  }

  return <p className="text-slate-400">Autenticando...</p>
}

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<p className="text-slate-400">Carregando...</p>}>
        <CallbackHandler />
      </Suspense>
    </main>
  )
}
