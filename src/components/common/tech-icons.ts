import {
  Bot,
  BrainCircuit,
  Cable,
  Cloud,
  CodeXml,
  Contact,
  MessageCircle,
  MessagesSquare,
  ScanFace,
  Sparkles,
  SquareTerminal,
  Webhook,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import {
  siCss,
  siDocker,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siJson,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPostman,
  siReact,
  siRedis,
  siSass,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVitest,
  siWhatsapp,
  type SimpleIcon,
} from 'simple-icons'
/**
 * Registro de ícones de tecnologia. Marcas usam o traçado oficial (Simple Icons);
 * conceitos e marcas sem ícone oficial disponível usam um ícone genérico —
 * nunca um logotipo improvisado.
 */
export const BRAND_ICONS: Record<string, SimpleIcon> = {
  html5: siHtml5,
  css: siCss,
  javascript: siJavascript,
  typescript: siTypescript,
  react: siReact,
  tailwindcss: siTailwindcss,
  sass: siSass,
  nextdotjs: siNextdotjs,
  n8n: siN8n,
  redis: siRedis,
  json: siJson,
  nodedotjs: siNodedotjs,
  postgresql: siPostgresql,
  git: siGit,
  github: siGithub,
  postman: siPostman,
  supabase: siSupabase,
  docker: siDocker,
  vitest: siVitest,
  whatsapp: siWhatsapp,
}

export const GENERIC_ICONS: Record<string, LucideIcon> = {
  api: Cable,
  webhook: Webhook,
  integration: Workflow,
  openai: Sparkles,
  prompt: SquareTerminal,
  agent: Bot,
  'ai-automation': Zap,
  llm: BrainCircuit,
  vscode: CodeXml,
  fredy: MessagesSquare,
  duda: MessageCircle,
  crm: Contact,
  salesforce: Cloud,
  'face-recognition': ScanFace,
}

/** Chaves aceitas pelo campo `icon` das skills (usadas também no painel). */
export const TECH_ICON_KEYS = [...Object.keys(BRAND_ICONS), ...Object.keys(GENERIC_ICONS)].sort()

export const FALLBACK_TECH_ICON: LucideIcon = CodeXml
