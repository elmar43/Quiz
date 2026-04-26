'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      router.replace('/')
      return
    }
    const supabase = createClient()
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      router.replace(error ? '/?error=auth_failed' : '/quiz')
    })
  }, [router, searchParams])

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
