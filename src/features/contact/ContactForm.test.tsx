import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'

const sendContactMessage = vi.fn()

vi.mock('./send-message', async (importOriginal) => {
  const original = await importOriginal<typeof import('./send-message')>()
  return { ...original, sendContactMessage: (...args: unknown[]) => sendContactMessage(...args) }
})

const { ContactForm } = await import('./ContactForm')
const { ContactSubmitError } = await import('./send-message')

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nome'), 'Maria Silva')
  await user.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com')
  await user.type(screen.getByLabelText('Assunto'), 'Projeto de automação')
  await user.type(
    screen.getByLabelText('Mensagem'),
    'Olá! Gostaria de conversar sobre uma automação com n8n.',
  )
}

describe('ContactForm', () => {
  beforeEach(() => {
    sendContactMessage.mockReset()
  })

  it('mostra erros de validação claros e não envia', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ContactForm />)

    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }))

    expect(await screen.findByText('Informe seu nome.')).toBeInTheDocument()
    expect(screen.getByText('Informe seu e-mail.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toHaveAttribute('aria-invalid', 'true')
    expect(sendContactMessage).not.toHaveBeenCalled()
  })

  it('envia os dados normalizados com os campos anti-spam e exibe sucesso', async () => {
    sendContactMessage.mockResolvedValue(undefined)
    const user = userEvent.setup()
    renderWithProviders(<ContactForm />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }))

    expect(await screen.findByText('Mensagem enviada!')).toBeInTheDocument()
    expect(sendContactMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Maria Silva',
        email: 'maria@exemplo.com',
        website: '',
        elapsedMs: expect.any(Number) as number,
      }),
    )
  })

  it('informa quando o limite de envios foi atingido', async () => {
    sendContactMessage.mockRejectedValue(new ContactSubmitError('rateLimited'))
    const user = userEvent.setup()
    renderWithProviders(<ContactForm />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('várias mensagens em pouco tempo')
  })

  it('desabilita o botão durante o envio', async () => {
    let resolve: () => void = () => undefined
    sendContactMessage.mockReturnValue(new Promise<void>((done) => (resolve = done)))
    const user = userEvent.setup()
    renderWithProviders(<ContactForm />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }))

    expect(await screen.findByRole('button', { name: 'Enviando…' })).toBeDisabled()
    resolve()
    await waitFor(() => expect(screen.getByText('Mensagem enviada!')).toBeInTheDocument())
  })
})
