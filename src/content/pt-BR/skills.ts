import type { Skill, SkillCategory, SkillLevel } from '@/types/content'

type SkillSeed = [name: string, icon: string, level: SkillLevel, description: string]

const byCategory: Record<SkillCategory, SkillSeed[]> = {
  frontend: [
    ['HTML5', 'html5', 'projects', 'Marcação semântica e acessível.'],
    ['CSS3', 'css', 'projects', 'Layouts responsivos, Flexbox e Grid.'],
    ['JavaScript', 'javascript', 'projects', 'Lógica de interface e consumo de APIs.'],
    ['TypeScript', 'typescript', 'projects', 'Tipagem estática para código mais seguro.'],
    ['React', 'react', 'projects', 'Componentes, hooks e gerenciamento de estado.'],
    ['Tailwind CSS', 'tailwindcss', 'projects', 'Estilização utilitária e design systems.'],
    ['Sass', 'sass', 'learning', 'Partials, variáveis e mixins — usado no Finity.'],
    ['Next.js', 'nextdotjs', 'learning', 'App Router e rotas de API — usado no RZE Sites.'],
  ],
  backend: [
    ['APIs REST', 'api', 'professional', 'Consumo e integração de serviços HTTP.'],
    ['Webhooks', 'webhook', 'professional', 'Eventos em tempo real entre sistemas.'],
    ['n8n', 'n8n', 'professional', 'Workflows de automação e orquestração.'],
    ['Redis', 'redis', 'professional', 'Distribuição e controle de estado em fluxos.'],
    ['JSON', 'json', 'professional', 'Modelagem e transformação de dados.'],
    [
      'Integrações entre sistemas',
      'integration',
      'professional',
      'Conexão de CRMs, serviços financeiros e de telefonia.',
    ],
    ['Node.js', 'nodedotjs', 'learning', 'Base para evoluir no backend JavaScript.'],
    ['PostgreSQL', 'postgresql', 'learning', 'Modelagem relacional e SQL.'],
  ],
  ai: [
    ['OpenAI API', 'openai', 'professional', 'Modelos de linguagem em fluxos de atendimento.'],
    ['Engenharia de Prompt', 'prompt', 'professional', 'Instruções e contexto para agentes.'],
    [
      'Agentes Conversacionais',
      'agent',
      'professional',
      'Configuração de agentes de IA para atendimento.',
    ],
    ['Automação com IA', 'ai-automation', 'professional', 'IA aplicada a processos do negócio.'],
    [
      'Integração de modelos de linguagem',
      'llm',
      'professional',
      'LLMs conectados a sistemas e dados via API.',
    ],
  ],
  tools: [
    ['Git', 'git', 'projects', 'Versionamento e histórico de código.'],
    ['GitHub', 'github', 'projects', 'Repositórios, pull requests e CI com Actions.'],
    ['VS Code', 'vscode', 'projects', 'Ambiente principal de desenvolvimento.'],
    ['Postman', 'postman', 'projects', 'Teste e documentação de APIs.'],
    ['Supabase', 'supabase', 'projects', 'Banco, autenticação e funções — base deste portfólio.'],
    ['Docker', 'docker', 'learning', 'Build em container com Nginx — usado no Finity.'],
    ['Vitest', 'vitest', 'learning', 'Testes automatizados de componentes e regras.'],
  ],
  platforms: [
    ['Frédy.app', 'fredy', 'professional', 'Ecossistema de CRM e atendimento em que atuo.'],
    ['Duda.app', 'duda', 'professional', 'Ecossistema de soluções em que atuo.'],
    ['CRM', 'crm', 'professional', 'Configuração, suporte e integrações de CRM.'],
    [
      'WhatsApp Business API',
      'whatsapp',
      'professional',
      'Canal oficial integrado a agentes e automações.',
    ],
    ['Salesforce', 'salesforce', 'learning', 'Plataforma de CRM em estudo.'],
  ],
}

export const skills: Skill[] = (Object.entries(byCategory) as [SkillCategory, SkillSeed[]][])
  .flatMap(([category, seeds]) =>
    seeds.map(([name, icon, level, description]) => ({ name, icon, level, description, category })),
  )
  .map((skill, index) => ({
    ...skill,
    id: `${skill.category}-${skill.icon}`,
    sortOrder: index + 1,
  }))
