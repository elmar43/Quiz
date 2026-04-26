import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = cookies()
  const pendingCookies: Array<{ name: string; value: string; options?: object }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: object }>) {
          cookiesToSet.forEach(({ name, value, options }) => pendingCookies.push({ name, value, options }))
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error || !data.url) {
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL))
  }

  const response = NextResponse.redirect(data.url, { status: 303 })

  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, {
      ...(options as object | undefined),
      path: '/',
      sameSite: 'lax',
      secure: true,
    })
  })

  return response
}
