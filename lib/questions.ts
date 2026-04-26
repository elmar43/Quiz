export type Question = {
  id: string
  level: 'iniciante' | 'intermediario' | 'avancado'
  statement: string
  answer: boolean
}

const iniciante: Question[] = [
  { id: 'ini-01', level: 'iniciante', statement: 'Claude Code é uma CLI oficial da Anthropic para usar o Claude diretamente no terminal.', answer: true },
  { id: 'ini-02', level: 'iniciante', statement: 'Claude Code só funciona em sistemas operacionais Linux.', answer: false },
  { id: 'ini-03', level: 'iniciante', statement: 'Claude Code pode ler, editar e criar arquivos no seu projeto automaticamente.', answer: true },
  { id: 'ini-04', level: 'iniciante', statement: 'Para usar Claude Code é necessário ter uma conta paga na Anthropic.', answer: true },
  { id: 'ini-05', level: 'iniciante', statement: 'Claude Code consegue executar comandos de terminal durante uma sessão.', answer: true },
  { id: 'ini-06', level: 'iniciante', statement: 'Claude Code substitui completamente a necessidade de um editor de código como VS Code.', answer: false },
  { id: 'ini-07', level: 'iniciante', statement: 'Claude Code possui integração nativa com extensões para VS Code e JetBrains.', answer: true },
  { id: 'ini-08', level: 'iniciante', statement: 'Claude Code não tem acesso ao conteúdo dos arquivos do projeto, apenas aos nomes.', answer: false },
  { id: 'ini-09', level: 'iniciante', statement: 'É possível usar Claude Code via browser no endereço claude.ai/code.', answer: true },
  { id: 'ini-10', level: 'iniciante', statement: 'Claude Code é gratuito e sem limites de uso para todos os usuários.', answer: false },
  { id: 'ini-11', level: 'iniciante', statement: 'Claude Code pode ser instalado via npm com o comando `npm install -g @anthropic-ai/claude-code`.', answer: true },
  { id: 'ini-12', level: 'iniciante', statement: 'Claude Code só funciona com projetos que usam JavaScript ou TypeScript.', answer: false },
  { id: 'ini-13', level: 'iniciante', statement: 'Claude Code possui um Desktop App disponível para Mac e Windows além da versão CLI.', answer: true },
  { id: 'ini-14', level: 'iniciante', statement: 'Claude Code consegue buscar informações na internet em tempo real sem nenhuma configuração adicional.', answer: false },
  { id: 'ini-15', level: 'iniciante', statement: 'Claude Code pode escrever, executar e corrigir testes automatizados durante uma sessão.', answer: true },
  { id: 'ini-16', level: 'iniciante', statement: 'Cada sessão do Claude Code começa sem memória das sessões anteriores por padrão.', answer: true },
  { id: 'ini-17', level: 'iniciante', statement: 'Claude Code consegue criar e fazer checkout de branches Git durante uma sessão.', answer: true },
  { id: 'ini-18', level: 'iniciante', statement: 'Claude Code pode ler e interpretar imagens como screenshots durante uma sessão.', answer: true },
  { id: 'ini-19', level: 'iniciante', statement: 'Claude Code tem suporte para trabalhar com notebooks Jupyter (.ipynb).', answer: true },
  { id: 'ini-20', level: 'iniciante', statement: 'É necessário configurar uma chave de API da Anthropic para usar o Claude Code via CLI.', answer: true },
]

const intermediario: Question[] = [
  { id: 'int-01', level: 'intermediario', statement: 'O arquivo CLAUDE.md é usado para dar instruções persistentes ao Claude Code sobre o projeto.', answer: true },
  { id: 'int-02', level: 'intermediario', statement: 'Claude Code suporta múltiplos arquivos CLAUDE.md em subdiretórios do projeto.', answer: true },
  { id: 'int-03', level: 'intermediario', statement: 'Hooks no Claude Code permitem executar scripts automáticos em resposta a eventos como edição de arquivos.', answer: true },
  { id: 'int-04', level: 'intermediario', statement: 'O modelo padrão do Claude Code é sempre o mais recente disponível, sem possibilidade de troca.', answer: false },
  { id: 'int-05', level: 'intermediario', statement: 'Claude Code possui um modo `/fast` que usa o modelo Opus com output mais rápido.', answer: true },
  { id: 'int-06', level: 'intermediario', statement: 'O comando `/clear` apaga o histórico da conversa atual sem encerrar a sessão.', answer: true },
  { id: 'int-07', level: 'intermediario', statement: 'MCP (Model Context Protocol) permite conectar Claude Code a servidores externos de contexto e ferramentas.', answer: true },
  { id: 'int-08', level: 'intermediario', statement: 'Claude Code não consegue criar commits Git — apenas sugere os comandos para o usuário executar.', answer: false },
  { id: 'int-09', level: 'intermediario', statement: 'O Claude Code Agent SDK permite construir agentes customizados que orquestram subagentes especializados.', answer: true },
  { id: 'int-10', level: 'intermediario', statement: 'Claude Code armazena o histórico de conversas em texto simples no diretório do projeto.', answer: false },
  { id: 'int-11', level: 'intermediario', statement: 'O comando `/compact` resume o histórico da conversa atual para economizar tokens de contexto.', answer: true },
  { id: 'int-12', level: 'intermediario', statement: 'É possível passar um prompt diretamente via argumento na linha de comando ao iniciar o Claude Code.', answer: true },
  { id: 'int-13', level: 'intermediario', statement: 'Servidores MCP configurados no Claude Code não suportam conexões a serviços remotos — apenas locais.', answer: false },
  { id: 'int-14', level: 'intermediario', statement: 'O Claude Code suporta modo não-interativo com a flag `--print` para uso em scripts e automações.', answer: true },
  { id: 'int-15', level: 'intermediario', statement: 'É possível criar atalhos de teclado customizados no Claude Code via arquivo `keybindings.json`.', answer: true },
  { id: 'int-16', level: 'intermediario', statement: 'O histórico de sessões do Claude Code é compartilhado globalmente entre todos os projetos do computador.', answer: false },
  { id: 'int-17', level: 'intermediario', statement: 'Claude Code suporta o uso de múltiplos servidores MCP simultaneamente em uma mesma sessão.', answer: true },
  { id: 'int-18', level: 'intermediario', statement: 'O Claude Code não suporta ferramentas personalizadas além das nativas — MCP não expande esse conjunto.', answer: false },
  { id: 'int-19', level: 'intermediario', statement: 'O comando `/help` dentro do Claude Code exibe a lista de comandos slash disponíveis.', answer: true },
  { id: 'int-20', level: 'intermediario', statement: 'O arquivo `.claudeignore` pode ser usado para impedir que Claude Code acesse determinados arquivos.', answer: true },
]

const avancado: Question[] = [
  { id: 'adv-01', level: 'avancado', statement: 'É possível configurar permissões granulares no Claude Code para bloquear ferramentas específicas como edição de arquivos.', answer: true },
  { id: 'adv-02', level: 'avancado', statement: 'O Claude Code suporta execução paralela de subagentes em uma única mensagem de orquestração.', answer: true },
  { id: 'adv-03', level: 'avancado', statement: 'Worktrees isolados no Claude Code permitem que agentes trabalhem em branches separados sem afetar o workspace principal.', answer: true },
  { id: 'adv-04', level: 'avancado', statement: 'O prompt cache da Anthropic API tem TTL de 1 hora para contextos grandes.', answer: false },
  { id: 'adv-05', level: 'avancado', statement: 'Claude Code pode ser invocado de forma não-interativa (headless) via CLI para uso em pipelines CI/CD.', answer: true },
  { id: 'adv-06', level: 'avancado', statement: 'Skills no Claude Code são scripts que expandem o comportamento do agente via comandos `/skill-name`.', answer: true },
  { id: 'adv-07', level: 'avancado', statement: 'O arquivo `settings.json` do Claude Code não suporta configuração de hooks — isso é feito apenas via CLAUDE.md.', answer: false },
  { id: 'adv-08', level: 'avancado', statement: 'O modelo claude-opus-4-6 é identificado pela Anthropic como o mais capaz da família Claude 4.6.', answer: true },
  { id: 'adv-09', level: 'avancado', statement: 'O contexto de uma sessão Claude Code é ilimitado — nunca há compressão automática de mensagens antigas.', answer: false },
  { id: 'adv-10', level: 'avancado', statement: 'É possível agendar execuções recorrentes de agentes Claude Code via CronCreate sem intervenção humana.', answer: true },
  { id: 'adv-11', level: 'avancado', statement: 'Hooks do tipo `PreToolUse` permitem bloquear a execução de uma ferramenta antes que ela ocorra.', answer: true },
  { id: 'adv-12', level: 'avancado', statement: 'O billing do Claude Code é baseado nos tokens consumidos via API da Anthropic, não em assinatura fixa por feature.', answer: true },
  { id: 'adv-13', level: 'avancado', statement: 'O Claude Code Agent SDK não suporta execução de agentes em background — todos os agentes são síncronos.', answer: false },
  { id: 'adv-14', level: 'avancado', statement: 'O flag `--dangerously-skip-permissions` permite que o Claude Code execute ações sem pedir confirmação ao usuário.', answer: true },
  { id: 'adv-15', level: 'avancado', statement: 'O TTL do prompt cache da Anthropic para contextos marcados com cache_control é de 5 minutos.', answer: true },
  { id: 'adv-16', level: 'avancado', statement: 'Subagentes lançados com `isolation: "worktree"` trabalham em cópia isolada do repositório, limpa automaticamente se não houver mudanças.', answer: true },
  { id: 'adv-17', level: 'avancado', statement: 'O arquivo `settings.json` do Claude Code permite configurar quais ferramentas são permitidas ou bloqueadas por padrão.', answer: true },
  { id: 'adv-18', level: 'avancado', statement: 'Claude Code pode ser integrado ao GitHub Actions para automatizar revisão e correção de código em pull requests.', answer: true },
  { id: 'adv-19', level: 'avancado', statement: 'No Agent SDK, o parâmetro `run_in_background` permite lançar um subagente sem bloquear o agente pai.', answer: true },
  { id: 'adv-20', level: 'avancado', statement: 'O Claude Code não suporta streaming de tokens — sempre aguarda a resposta completa antes de exibir qualquer conteúdo.', answer: false },
]

function sample<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, n)
}

export function generateSession(): Question[] {
  return [
    ...sample(iniciante, 10),
    ...sample(intermediario, 10),
    ...sample(avancado, 10),
  ]
}
