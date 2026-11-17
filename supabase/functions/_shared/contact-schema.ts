import { z } from 'zod'

/**
 * Contrato do formulário de contato, compartilhado entre o navegador e a
 * Edge Function `contact` para que cliente e servidor validem exatamente igual.
 */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { min: 3, max: 120 },
  message: { min: 20, max: 4000 },
} as const

const singleLine = (value: string) => value.replace(/\s+/g, ' ').trim()

export const contactFormSchema = z.object({
  name: z
    .string()
    .transform(singleLine)
    .pipe(
      z
        .string()
        .min(CONTACT_LIMITS.name.min, 'Informe seu nome.')
        .max(CONTACT_LIMITS.name.max, `Use no máximo ${CONTACT_LIMITS.name.max} caracteres.`),
    ),
  email: z
    .string()
    .transform((value) => value.trim().toLowerCase())
    .pipe(
      z
        .string()
        .min(1, 'Informe seu e-mail.')
        .max(CONTACT_LIMITS.email.max, 'E-mail muito longo.')
        .pipe(z.email('Informe um e-mail válido.')),
    ),
  subject: z
    .string()
    .transform(singleLine)
    .pipe(
      z
        .string()
        .min(CONTACT_LIMITS.subject.min, 'Informe o assunto.')
        .max(CONTACT_LIMITS.subject.max, `Use no máximo ${CONTACT_LIMITS.subject.max} caracteres.`),
    ),
  message: z
    .string()
    .transform((value) => value.trim())
    .pipe(
      z
        .string()
        .min(
          CONTACT_LIMITS.message.min,
          `Escreva pelo menos ${CONTACT_LIMITS.message.min} caracteres.`,
        )
        .max(CONTACT_LIMITS.message.max, `Use no máximo ${CONTACT_LIMITS.message.max} caracteres.`),
    ),
})

/** Campos anti-spam enviados junto com o formulário. */
export const contactRequestSchema = contactFormSchema.extend({
  /** Honeypot: humanos não enxergam este campo; se vier preenchido, é bot. */
  website: z.string().max(200).optional().default(''),
  /** Tempo entre a abertura do formulário e o envio, em milissegundos. */
  elapsedMs: z.number().int().nonnegative().max(86_400_000).optional().default(0),
})

export type ContactFormInput = z.input<typeof contactFormSchema>
export type ContactFormValues = z.output<typeof contactFormSchema>
export type ContactRequest = z.input<typeof contactRequestSchema>

export const MIN_HUMAN_ELAPSED_MS = 2500
