# PRD — Quiz Web: Claude Code (Verdadeiro ou Falso)

## 1. Visão Geral do Produto

### 1.1 Objetivo de Negócio
Criar um quiz web interativo sobre Claude Code com perguntas no formato Verdadeiro ou Falso. O produto tem como objetivo educar desenvolvedores e times técnicos sobre as capacidades, limites e recursos do Claude Code, de forma engajante e gamificada.

### 1.2 Público-Alvo
Desenvolvedores e times técnicos que utilizam ou avaliam o Claude Code. O quiz assume familiaridade com conceitos de desenvolvimento de software (CLI, Git, APIs, CI/CD) mas não exige conhecimento prévio da ferramenta.

### 1.3 Proposta de Valor
- Aprendizado ativo: o usuário descobre lacunas no conhecimento ao errar perguntas
- Progressão clara: 3 níveis sequenciais (Iniciante → Intermediário → Avançado)
- Histórico persistente: acompanha evolução ao longo do tempo via Supabase
- Compartilhamento: resultado pode ser copiado e compartilhado em uma linha

### 1.4 Métricas de Sucesso
- Taxa de conclusão do quiz (meta: > 70%)
- Score médio por nível
- Número de tentativas repetidas por usuário (engajamento)
- Perguntas com maior taxa de erro (identifica gaps de conhecimento)

---

## 2. Funcionalidades

### 2.1 Autenticação
- Login via OAuth com **Google** e **GitHub** (via Supabase Auth)
- Perfil criado automaticamente no primeiro acesso (nome, avatar, email)
- Rotas `/quiz` e `/result` protegidas — redireciona para `/` se não autenticado

### 2.2 Quiz
- **30 perguntas por sessão** no formato Verdadeiro ou Falso
- **Pool de 60 perguntas** distribuídas em 3 níveis (20 por nível). A cada sessão, **10 perguntas são sorteadas aleatoriamente** de cada nível — garantindo variação entre tentativas e eliminando repetição mecânica
- Fluxo **sequencial fixo por nível**: Iniciante (1–10) → Intermediário (11–20) → Avançado (21–30)
- A ordem das perguntas dentro de cada nível também é embaralhada a cada sessão
- Cada tela exibe:
  - Enunciado da pergunta
  - Botões [Verdadeiro] e [Falso]
  - Barra de progresso (ex: "12 / 30")
  - Indicador do nível atual
- Sem feedback entre perguntas — o usuário mantém o foco até o final

### 2.3 Resultado
- Score total (ex: "24 / 30")
- Breakdown por nível:
  - Iniciante: X/10
  - Intermediário: X/10
  - Avançado: X/10
- Tempo total de conclusão
- Botão **[Compartilhar resultado]** — copia para clipboard:
  ```
  Completei o Quiz de Claude Code!
  Score: 24/30 (80%) em 4min 32s
  Avançado: 7/10 ✓
  Testa você também → [URL]
  ```
- Lista das **últimas 10 tentativas** do usuário (data, score, tempo)
- Botão **[Jogar novamente]** → reinicia o quiz

### 2.4 Identidade Visual
- **Dark mode** com paleta inspirada na identidade Claude/Anthropic
  - Background: `#0a0a0a` / `#111111`
  - Accent: roxo/violeta (`#7c3aed` / `#8b5cf6`)
  - Texto: `#f8fafc`
  - Cards: `#1a1a2e` / `#16213e`
- Tipografia limpa, sem serifa (Inter ou similar)
- Design responsivo (mobile-first)

---

## 3. Stack Técnica

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (OAuth Google + GitHub) |
| Deploy | Vercel |
| Estilização | Tailwind CSS |
| Linguagem | TypeScript |

---

## 4. Arquitetura

### 4.1 Estrutura de Arquivos
```
Quiz/
├── app/
│   ├── page.tsx                  # Landing page (hero + botões de login)
│   ├── quiz/
│   │   └── page.tsx              # Tela do quiz (30 perguntas sequenciais)
│   ├── result/
│   │   └── page.tsx              # Tela de resultado + share + histórico
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # Callback OAuth do Supabase
│   ├── layout.tsx                # Layout global + Supabase provider
│   └── globals.css               # Tokens de cor, dark mode global
├── components/
│   ├── QuizCard.tsx              # Card de pergunta com botões V/F
│   ├── ProgressBar.tsx           # Barra de progresso (X / 30)
│   ├── LevelBadge.tsx            # Badge de nível atual
│   ├── ResultSummary.tsx         # Score total + breakdown por nível
│   ├── HistoryList.tsx           # Lista de tentativas anteriores
│   └── ShareButton.tsx           # Botão de copiar resultado
├── lib/
│   ├── questions.ts              # Pool de 60 perguntas (20/nível) + função de seleção aleatória
│   ├── supabase/
│   │   ├── client.ts             # Supabase browser client
│   │   └── server.ts             # Supabase server client (SSR)
│   └── quiz.ts                   # saveAttempt(), getHistory(), calcScore(), generateSession()
├── middleware.ts                 # Proteção de rotas autenticadas
├── .env.local                    # Variáveis de ambiente (não commitado)
└── prd.md                        # Este documento
```

### 4.2 Fluxo de Dados
```
Usuário → Landing Page
  → OAuth (Google/GitHub) → Supabase Auth
  → Callback → cria/atualiza profile → /quiz

/quiz
  → Chama generateSession() de questions.ts: sorteia 10 de cada pool de 20 e embaralha
     (estático, sem DB — todo sorteio acontece no client)
  → Usuário responde 30 perguntas
  → Ao finalizar: POST quiz_attempts no Supabase
  → Redirect para /result

/result
  → Lê resultado da sessão (passado via URL param ou state)
  → GET quiz_attempts (últimas 10) do Supabase
  → Exibe score, breakdown, histórico, share button
```

---

## 5. Banco de Dados (Supabase)

### 5.1 Tabelas

```sql
-- Perfil do usuário (criado via trigger no signup)
CREATE TABLE profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email        text,
  display_name text,
  avatar_url   text,
  created_at   timestamptz DEFAULT now()
);

-- Resultado de cada tentativa
CREATE TABLE quiz_attempts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score        int NOT NULL,
  total        int NOT NULL DEFAULT 30,
  time_spent   int NOT NULL,              -- segundos
  answers      jsonb NOT NULL,            -- [{question_id, user_answer, correct}]
  completed_at timestamptz DEFAULT now()
);
```

### 5.2 Row Level Security (RLS)

```sql
-- profiles: usuário acessa apenas o próprio registro
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário acessa próprio perfil"
  ON profiles FOR ALL USING (auth.uid() = id);

-- quiz_attempts: usuário acessa apenas as próprias tentativas
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário acessa próprias tentativas"
  ON quiz_attempts FOR ALL USING (auth.uid() = user_id);
```

### 5.3 Trigger para criação automática de perfil

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 6. Banco de Perguntas (Pool de 60)

A cada sessão, **10 perguntas são sorteadas aleatoriamente de cada pool de 20** e exibidas em ordem embaralhada dentro do nível. O `question_id` é salvo no Supabase para análise futura de quais perguntas geram mais erros.

### Lógica de Seleção (lib/questions.ts)

```ts
export type Question = {
  id: string          // ex: "ini-01", "int-05", "adv-12"
  level: 'iniciante' | 'intermediario' | 'avancado'
  statement: string
  answer: boolean     // true = Verdadeiro, false = Falso
}

// Embaralha e seleciona N itens de um array
function sample<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

// Gera sessão: 10 de cada nível, em sequência fixa de níveis
export function generateSession(): Question[] {
  return [
    ...sample(iniciante, 10),
    ...sample(intermediario, 10),
    ...sample(avancado, 10),
  ]
}
```

---

### Pool Iniciante (20 perguntas)

| ID | Enunciado | Resposta |
|----|-----------|----------|
| ini-01 | Claude Code é uma CLI oficial da Anthropic para usar o Claude diretamente no terminal. | **Verdadeiro** |
| ini-02 | Claude Code só funciona em sistemas operacionais Linux. | **Falso** |
| ini-03 | Claude Code pode ler, editar e criar arquivos no seu projeto automaticamente. | **Verdadeiro** |
| ini-04 | Para usar Claude Code é necessário ter uma conta paga na Anthropic. | **Verdadeiro** |
| ini-05 | Claude Code consegue executar comandos de terminal durante uma sessão. | **Verdadeiro** |
| ini-06 | Claude Code substitui completamente a necessidade de um editor de código como VS Code. | **Falso** |
| ini-07 | Claude Code possui integração nativa com extensões para VS Code e JetBrains. | **Verdadeiro** |
| ini-08 | Claude Code não tem acesso ao conteúdo dos arquivos do projeto, apenas aos nomes. | **Falso** |
| ini-09 | É possível usar Claude Code via browser no endereço claude.ai/code. | **Verdadeiro** |
| ini-10 | Claude Code é gratuito e sem limites de uso para todos os usuários. | **Falso** |
| ini-11 | Claude Code pode ser instalado via npm com o comando `npm install -g @anthropic-ai/claude-code`. | **Verdadeiro** |
| ini-12 | Claude Code só funciona com projetos que usam JavaScript ou TypeScript. | **Falso** |
| ini-13 | Claude Code possui um Desktop App disponível para Mac e Windows além da versão CLI. | **Verdadeiro** |
| ini-14 | Claude Code consegue buscar informações na internet em tempo real sem nenhuma configuração adicional. | **Falso** |
| ini-15 | Claude Code pode escrever, executar e corrigir testes automatizados durante uma sessão. | **Verdadeiro** |
| ini-16 | Cada sessão do Claude Code começa sem memória das sessões anteriores por padrão. | **Verdadeiro** |
| ini-17 | Claude Code consegue criar e fazer checkout de branches Git durante uma sessão. | **Verdadeiro** |
| ini-18 | Claude Code pode ler e interpretar imagens como screenshots durante uma sessão. | **Verdadeiro** |
| ini-19 | Claude Code tem suporte para trabalhar com notebooks Jupyter (.ipynb). | **Verdadeiro** |
| ini-20 | É necessário configurar uma chave de API da Anthropic para usar o Claude Code via CLI. | **Verdadeiro** |

---

### Pool Intermediário (20 perguntas)

| ID | Enunciado | Resposta |
|----|-----------|----------|
| int-01 | O arquivo CLAUDE.md é usado para dar instruções persistentes ao Claude Code sobre o projeto. | **Verdadeiro** |
| int-02 | Claude Code suporta múltiplos arquivos CLAUDE.md em subdiretórios do projeto. | **Verdadeiro** |
| int-03 | Hooks no Claude Code permitem executar scripts automáticos em resposta a eventos como edição de arquivos. | **Verdadeiro** |
| int-04 | O modelo padrão do Claude Code é sempre o mais recente disponível, sem possibilidade de troca. | **Falso** |
| int-05 | Claude Code possui um modo `/fast` que usa o modelo Opus com output mais rápido. | **Verdadeiro** |
| int-06 | O comando `/clear` apaga o histórico da conversa atual sem encerrar a sessão. | **Verdadeiro** |
| int-07 | MCP (Model Context Protocol) permite conectar Claude Code a servidores externos de contexto e ferramentas. | **Verdadeiro** |
| int-08 | Claude Code não consegue criar commits Git — apenas sugere os comandos para o usuário executar. | **Falso** |
| int-09 | O Claude Code Agent SDK permite construir agentes customizados que orquestram subagentes especializados. | **Verdadeiro** |
| int-10 | Claude Code armazena o histórico de conversas em texto simples no diretório do projeto. | **Falso** |
| int-11 | O comando `/compact` resume o histórico da conversa atual para economizar tokens de contexto. | **Verdadeiro** |
| int-12 | É possível passar um prompt diretamente via argumento na linha de comando ao iniciar o Claude Code. | **Verdadeiro** |
| int-13 | Servidores MCP configurados no Claude Code não suportam conexões a serviços remotos — apenas locais. | **Falso** |
| int-14 | O Claude Code suporta modo não-interativo com a flag `--print` para uso em scripts e automações. | **Verdadeiro** |
| int-15 | É possível criar atalhos de teclado customizados no Claude Code via arquivo `keybindings.json`. | **Verdadeiro** |
| int-16 | O histórico de sessões do Claude Code é compartilhado globalmente entre todos os projetos do computador. | **Falso** |
| int-17 | Claude Code suporta o uso de múltiplos servidores MCP simultaneamente em uma mesma sessão. | **Verdadeiro** |
| int-18 | O Claude Code não suporta ferramentas personalizadas além das nativas — MCP não expande esse conjunto. | **Falso** |
| int-19 | O comando `/help` dentro do Claude Code exibe a lista de comandos slash disponíveis. | **Verdadeiro** |
| int-20 | O arquivo `.claudeignore` pode ser usado para impedir que Claude Code acesse determinados arquivos. | **Verdadeiro** |

---

### Pool Avançado (20 perguntas)

| ID | Enunciado | Resposta |
|----|-----------|----------|
| adv-01 | É possível configurar permissões granulares no Claude Code para bloquear ferramentas específicas como edição de arquivos. | **Verdadeiro** |
| adv-02 | O Claude Code suporta execução paralela de subagentes em uma única mensagem de orquestração. | **Verdadeiro** |
| adv-03 | Worktrees isolados no Claude Code permitem que agentes trabalhem em branches separados sem afetar o workspace principal. | **Verdadeiro** |
| adv-04 | O prompt cache da Anthropic API tem TTL de 1 hora para contextos grandes. | **Falso** |
| adv-05 | Claude Code pode ser invocado de forma não-interativa (headless) via CLI para uso em pipelines CI/CD. | **Verdadeiro** |
| adv-06 | Skills no Claude Code são scripts que expandem o comportamento do agente via comandos `/skill-name`. | **Verdadeiro** |
| adv-07 | O arquivo `settings.json` do Claude Code não suporta configuração de hooks — isso é feito apenas via CLAUDE.md. | **Falso** |
| adv-08 | O modelo claude-opus-4-6 é identificado pela Anthropic como o mais capaz da família Claude 4.6. | **Verdadeiro** |
| adv-09 | O contexto de uma sessão Claude Code é ilimitado — nunca há compressão automática de mensagens antigas. | **Falso** |
| adv-10 | É possível agendar execuções recorrentes de agentes Claude Code via CronCreate sem intervenção humana. | **Verdadeiro** |
| adv-11 | Hooks do tipo `PreToolUse` permitem bloquear a execução de uma ferramenta antes que ela ocorra. | **Verdadeiro** |
| adv-12 | O billing do Claude Code é baseado nos tokens consumidos via API da Anthropic, não em assinatura fixa por feature. | **Verdadeiro** |
| adv-13 | O Claude Code Agent SDK não suporta execução de agentes em background — todos os agentes são síncronos. | **Falso** |
| adv-14 | O flag `--dangerously-skip-permissions` permite que o Claude Code execute ações sem pedir confirmação ao usuário. | **Verdadeiro** |
| adv-15 | O TTL do prompt cache da Anthropic para contextos marcados com cache_control é de 5 minutos. | **Verdadeiro** |
| adv-16 | Subagentes lançados com `isolation: "worktree"` trabalham em cópia isolada do repositório, limpa automaticamente se não houver mudanças. | **Verdadeiro** |
| adv-17 | O arquivo `settings.json` do Claude Code permite configurar quais ferramentas são permitidas ou bloqueadas por padrão. | **Verdadeiro** |
| adv-18 | Claude Code pode ser integrado ao GitHub Actions para automatizar revisão e correção de código em pull requests. | **Verdadeiro** |
| adv-19 | No Agent SDK, o parâmetro `run_in_background` permite lançar um subagente sem bloquear o agente pai. | **Verdadeiro** |
| adv-20 | O Claude Code não suporta streaming de tokens — sempre aguarda a resposta completa antes de exibir qualquer conteúdo. | **Falso** |

---

## 7. Variáveis de Ambiente

```env
# .env.local (não commitado)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_SITE_URL=https://<seu-dominio>.vercel.app
```

**No Supabase Dashboard:**
- Habilitar providers: Google e GitHub em Authentication → Providers
- Configurar Redirect URL: `https://<dominio>/auth/callback`

**No Vercel:**
- Adicionar as mesmas variáveis no painel Environment Variables

---

## 8. Configuração de Deploy (Vercel)

- Repositório conectado ao Vercel via GitHub
- Build command: `next build`
- Output: `.next`
- Preview deployments habilitados por branch
- Variáveis de ambiente configuradas para Production e Preview

---

## 9. Fora de Escopo (v1)

Os itens abaixo **não** fazem parte desta versão e não devem ser implementados:

- Ranking/leaderboard global
- Explicações detalhadas das respostas (feedback por questão)
- Suporte a múltiplos idiomas
- Modo admin para gerenciar perguntas via UI
- Notificações por email
- Modo offline / PWA

---

## 10. Critérios de Aceite

- [ ] Login com Google e GitHub funcional
- [ ] Quiz sorteia 10 perguntas aleatórias de cada pool de 20 por nível a cada sessão
- [ ] Perguntas dentro de cada nível aparecem em ordem embaralhada
- [ ] Progressão de nível é sempre Iniciante → Intermediário → Avançado
- [ ] Resultado salvo corretamente no Supabase ao concluir o quiz
- [ ] Tela de resultado exibe score total, breakdown por nível e tempo
- [ ] Histórico mostra as últimas 10 tentativas do usuário autenticado
- [ ] Botão de share copia texto correto para o clipboard
- [ ] Rotas `/quiz` e `/result` redirecionam para `/` sem autenticação
- [ ] Design dark mode responsivo em mobile e desktop
- [ ] Deploy funcional na Vercel com variáveis de ambiente configuradas
