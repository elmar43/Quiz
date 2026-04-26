import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Quiz Claude Code',
  description: 'Teste seus conhecimentos sobre Claude Code — Verdadeiro ou Falso.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased bg-[#0a0a0a] text-slate-100 min-h-screen">
        <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>
        {children}
      </body>
    </html>
  )
}
