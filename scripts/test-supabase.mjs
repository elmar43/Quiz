/**
 * Script de teste de conexão com o Supabase.
 * Executar: node scripts/test-supabase.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))

// Carrega .env.local manualmente
const envPath = join(__dir, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('=').map(s => s.trim()))
    .filter(([k]) => k)
    .map(([k, ...v]) => [k, v.join('=')])
)

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
const ANON_KEY = env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
const SERVICE_KEY = env['SUPABASE_SERVICE_ROLE_KEY']

const pass = (msg) => console.log(`  ✓  ${msg}`)
const fail = (msg, err) => console.error(`  ✗  ${msg}`, err?.message ?? err ?? '')
const section = (title) => console.log(`\n── ${title} ──`)

// ─── 1. Variáveis de ambiente ────────────────────────────────────────────────
section('1. Variáveis de ambiente')
if (SUPABASE_URL)  pass(`NEXT_PUBLIC_SUPABASE_URL = ${SUPABASE_URL}`)
else               fail('NEXT_PUBLIC_SUPABASE_URL ausente')

if (ANON_KEY)  pass('NEXT_PUBLIC_SUPABASE_ANON_KEY presente')
else           fail('NEXT_PUBLIC_SUPABASE_ANON_KEY ausente')

if (SERVICE_KEY) pass('SUPABASE_SERVICE_ROLE_KEY presente')
else             fail('SUPABASE_SERVICE_ROLE_KEY ausente')

// ─── 2. Conexão básica (anon) ────────────────────────────────────────────────
section('2. Conexão com chave anon')
const anon = createClient(SUPABASE_URL, ANON_KEY)

try {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
    headers: { apikey: ANON_KEY }
  })
  if (res.ok) pass(`Supabase alcançável — auth health OK (HTTP ${res.status})`)
  else        fail(`Health check retornou HTTP ${res.status}`)
} catch (err) {
  fail('Não foi possível alcançar o Supabase', err)
}

// ─── 3. Tabelas — service role (bypassa RLS) ─────────────────────────────────
section('3. Tabelas (service role — bypassa RLS)')
const svc = createClient(SUPABASE_URL, SERVICE_KEY)

// profiles
{
  const { data, error, count } = await svc.from('profiles').select('*', { count: 'exact', head: true })
  if (error) fail('Tabela profiles não acessível', error)
  else       pass(`Tabela profiles acessível — ${count ?? 0} linha(s)`)
}

// quiz_attempts
{
  const { data, error, count } = await svc.from('quiz_attempts').select('*', { count: 'exact', head: true })
  if (error) fail('Tabela quiz_attempts não acessível', error)
  else       pass(`Tabela quiz_attempts acessível — ${count ?? 0} linha(s)`)
}

// ─── 4. Colunas de quiz_attempts ─────────────────────────────────────────────
section('4. Schema de quiz_attempts')
{
  const { data, error } = await svc.from('quiz_attempts').select('*').limit(0)
  if (error) {
    fail('Erro ao inspecionar schema', error)
  } else {
    const expectedCols = ['id', 'user_id', 'score', 'total', 'time_spent', 'answers', 'completed_at']
    // Busca uma linha real para verificar colunas (se existir)
    const { data: row } = await svc.from('quiz_attempts').select('*').limit(1)
    if (row && row.length > 0) {
      const cols = Object.keys(row[0])
      const missing = expectedCols.filter(c => !cols.includes(c))
      if (missing.length === 0) pass(`Todas as colunas esperadas presentes: ${expectedCols.join(', ')}`)
      else                       fail(`Colunas ausentes: ${missing.join(', ')}`)
    } else {
      pass('Tabela vazia — schema OK (nenhuma linha para inspecionar colunas)')
    }
  }
}

// ─── 5. RLS — anon NÃO deve ler profiles ─────────────────────────────────────
section('5. RLS (anon não deve ver rows de outros usuários)')
{
  const { data, error } = await anon.from('profiles').select('*')
  if (error) {
    pass(`RLS bloqueou leitura anon: ${error.message}`)
  } else if (!data || data.length === 0) {
    pass('RLS ativo — anon recebeu 0 rows (correto)')
  } else {
    fail(`RLS pode estar desativado — anon recebeu ${data.length} row(s)!`)
  }
}

// ─── 6. Auth providers ───────────────────────────────────────────────────────
section('6. Configuração de Auth')
{
  // /auth/v1/settings requer apenas o header apikey (sem Bearer)
  const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
    headers: { apikey: ANON_KEY }
  })
  if (!res.ok) {
    fail(`Não foi possível ler configurações de auth (HTTP ${res.status})`)
  } else {
    const cfg = await res.json()
    // O endpoint retorna campos booleanos diretos em cfg.external
    const google = cfg.external?.google
    const github = cfg.external?.github
    if (google) pass('Provider Google habilitado')
    else        fail('Provider Google NÃO habilitado — configurar em: Dashboard > Auth > Providers > Google')
    if (github) pass('Provider GitHub habilitado')
    else        fail('Provider GitHub NÃO habilitado — configurar em: Dashboard > Auth > Providers > GitHub')
  }
}

console.log('\n── Testes concluídos ──\n')
