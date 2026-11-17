import type { GithubData } from '@shared/github'
import type { Messages } from '@/i18n'
import type { PortfolioContent } from '@/types/content'
import { SKILL_CATEGORIES } from '@/types/content'

export type TerminalLine =
  | { kind: 'text' | 'heading' | 'error'; text: string }
  | { kind: 'link'; text: string; href: string }

export interface CommandContext {
  messages: Messages
  content: PortfolioContent
  github: GithubData | null
}

export interface CommandResult {
  lines: TerminalLine[]
  /** Quando verdadeiro, o histórico da tela é apagado. */
  clear?: boolean
}

type CommandHandler = (context: CommandContext) => CommandResult

const text = (value: string): TerminalLine => ({ kind: 'text', text: value })
const heading = (value: string): TerminalLine => ({ kind: 'heading', text: value })
const link = (label: string, href: string): TerminalLine => ({ kind: 'link', text: label, href })

/**
 * Lista fechada de comandos. A entrada do visitante só é usada como chave de
 * busca neste mapa — nada é avaliado nem executado.
 */
const COMMANDS: Record<keyof Messages['terminal']['help'], CommandHandler> = {
  help: ({ messages }) => ({
    lines: [
      heading(messages.terminal.helpTitle),
      ...Object.entries(messages.terminal.help).map(([name, description]) =>
        text(`  ${name.padEnd(10)} ${description}`),
      ),
    ],
  }),

  about: ({ content }) => ({
    lines: [
      heading(content.profile.fullName),
      text(content.profile.headline),
      text(''),
      ...content.profile.about.map(text),
    ],
  }),

  skills: ({ messages, content }) => ({
    lines: SKILL_CATEGORIES.flatMap((category) => {
      const names = content.skills
        .filter((skill) => skill.category === category)
        .map((skill) => skill.name)
      return names.length > 0
        ? [heading(messages.skills.categories[category]), text(`  ${names.join(' · ')}`)]
        : []
    }),
  }),

  projects: ({ content }) => ({
    lines: content.projects
      .filter((project) => project.featured)
      .flatMap((project) => [
        heading(`${project.title} — ${project.tagline}`),
        ...(project.demoUrl ? [link(`  ${project.demoUrl}`, project.demoUrl)] : []),
        ...(project.repoUrl ? [link(`  ${project.repoUrl}`, project.repoUrl)] : []),
      ]),
  }),

  github: ({ messages, content, github }) => ({
    lines: [
      ...(github
        ? [
            heading(`@${github.user.login}`),
            text(messages.terminal.githubSummary(github.user.publicRepos, github.user.followers)),
          ]
        : []),
      link(content.profile.githubUrl, content.profile.githubUrl),
    ],
  }),

  contact: ({ messages, content }) => ({
    lines: [
      link(`LinkedIn  ${content.profile.linkedinUrl}`, content.profile.linkedinUrl),
      link(`GitHub    ${content.profile.githubUrl}`, content.profile.githubUrl),
      ...(content.profile.publicEmail
        ? [
            link(
              `E-mail    ${content.profile.publicEmail}`,
              `mailto:${content.profile.publicEmail}`,
            ),
          ]
        : []),
      text(messages.terminal.contactHint),
    ],
  }),

  clear: () => ({ lines: [], clear: true }),
}

const isCommand = (name: string): name is keyof typeof COMMANDS => Object.hasOwn(COMMANDS, name)

export const COMMAND_NAMES = Object.keys(COMMANDS)

export function runCommand(input: string, context: CommandContext): CommandResult {
  const name = input.trim().toLowerCase().split(/\s+/)[0] ?? ''
  if (name === '') return { lines: [] }
  if (isCommand(name)) return COMMANDS[name](context)
  return {
    lines: [{ kind: 'error', text: context.messages.terminal.notFound(name.slice(0, 40)) }],
  }
}
