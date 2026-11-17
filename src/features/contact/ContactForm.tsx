import { zodResolver } from '@hookform/resolvers/zod'
import {
  CONTACT_LIMITS,
  contactFormSchema,
  type ContactFormInput,
  type ContactFormValues,
} from '@shared/contact-schema'
import { CircleAlert, CircleCheck, LoaderCircle, Send } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Field, fieldA11y, Input, Textarea } from '@/components/ui/form'
import { useMessages } from '@/i18n'
import { ContactSubmitError, sendContactMessage, type ContactErrorKind } from './send-message'

type Status = { state: 'idle' } | { state: 'success' } | { state: 'error'; kind: ContactErrorKind }

const EMPTY_FORM: ContactFormInput = { name: '', email: '', subject: '', message: '' }

export function ContactForm() {
  const t = useMessages()
  const ids = useId()
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const honeypotRef = useRef<HTMLInputElement>(null)
  const openedAtRef = useRef(0)
  const successRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: EMPTY_FORM,
    mode: 'onTouched',
  })

  useEffect(() => {
    openedAtRef.current = Date.now()
  }, [])

  useEffect(() => {
    if (status.state === 'success') successRef.current?.focus()
  }, [status.state])

  const submit = async (values: ContactFormValues) => {
    setStatus({ state: 'idle' })
    try {
      await sendContactMessage({
        ...values,
        website: honeypotRef.current?.value ?? '',
        elapsedMs: Math.max(0, Date.now() - openedAtRef.current),
      })
      reset(EMPTY_FORM)
      setStatus({ state: 'success' })
    } catch (error) {
      setStatus({
        state: 'error',
        kind: error instanceof ContactSubmitError ? error.kind : 'generic',
      })
    }
  }

  if (status.state === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex min-h-80 flex-col items-center justify-center gap-4 text-center focus:outline-none"
      >
        <span className="inline-flex size-14 items-center justify-center rounded-full border border-success/30 bg-success/10 text-success">
          <CircleCheck aria-hidden="true" className="size-7" />
        </span>
        <h3 className="text-2xl font-semibold text-foreground">{t.contact.successTitle}</h3>
        <p className="max-w-sm text-muted">{t.contact.successDescription}</p>
        <Button
          variant="secondary"
          className="mt-2"
          onClick={() => {
            openedAtRef.current = Date.now()
            setStatus({ state: 'idle' })
          }}
        >
          {t.contact.sendAnother}
        </Button>
      </div>
    )
  }

  const fieldId = (name: keyof ContactFormInput) => `${ids}-${name}`

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(submit)(event)}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={fieldId('name')} label={t.contact.fields.name} error={errors.name?.message}>
          <Input
            {...register('name')}
            {...fieldA11y(fieldId('name'), errors.name?.message)}
            type="text"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name.max}
            placeholder={t.contact.placeholders.name}
          />
        </Field>
        <Field id={fieldId('email')} label={t.contact.fields.email} error={errors.email?.message}>
          <Input
            {...register('email')}
            {...fieldA11y(fieldId('email'), errors.email?.message)}
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={CONTACT_LIMITS.email.max}
            placeholder={t.contact.placeholders.email}
          />
        </Field>
      </div>

      <Field
        id={fieldId('subject')}
        label={t.contact.fields.subject}
        error={errors.subject?.message}
      >
        <Input
          {...register('subject')}
          {...fieldA11y(fieldId('subject'), errors.subject?.message)}
          type="text"
          maxLength={CONTACT_LIMITS.subject.max}
          placeholder={t.contact.placeholders.subject}
        />
      </Field>

      <Field
        id={fieldId('message')}
        label={t.contact.fields.message}
        error={errors.message?.message}
      >
        <Textarea
          {...register('message')}
          {...fieldA11y(fieldId('message'), errors.message?.message)}
          rows={6}
          maxLength={CONTACT_LIMITS.message.max}
          placeholder={t.contact.placeholders.message}
        />
      </Field>

      {/* Honeypot: invisível para pessoas e fora da ordem de tabulação; bots costumam preenchê-lo. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor={`${ids}-website`}>{t.contact.honeypotLabel}</label>
        <input
          ref={honeypotRef}
          id={`${ids}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {status.state === 'error' ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-foreground"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-danger" />
          {t.contact.errors[status.kind]}
        </p>
      ) : null}

      <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-subtle">{t.contact.privacy}</p>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full shrink-0 sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle aria-hidden="true" className="animate-spin" />
              {t.contact.sending}
            </>
          ) : (
            <>
              <Send aria-hidden="true" />
              {t.contact.submit}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
