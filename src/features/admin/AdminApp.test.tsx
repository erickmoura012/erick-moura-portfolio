import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminApp } from './AdminApp'

const mocks = vi.hoisted(() => {
  /** Query builder mínimo: encadeável e "aguardável", como o do supabase-js. */
  const createQuery = () => {
    const result = { data: [], error: null, count: 0 }
    const builder: Record<string, unknown> = {}
    for (const method of ['select', 'eq', 'gte', 'order', 'limit', 'insert', 'update', 'delete']) {
      builder[method] = () => builder
    }
    builder.maybeSingle = () => Promise.resolve({ data: null, error: null })
    builder.then = (resolve: (value: typeof result) => unknown) => Promise.resolve(resolve(result))
    return builder
  }

  return {
    state: { configured: true },
    client: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
      },
      rpc: vi.fn(),
      from: vi.fn(() => createQuery()),
    },
  }
})

vi.mock('@/lib/env', () => ({
  env: {
    get supabaseUrl() {
      return mocks.state.configured ? 'http://localhost:54321' : null
    },
    get supabaseKey() {
      return mocks.state.configured ? 'chave-de-teste' : null
    },
    githubUsername: 'erickmoura012',
  },
  get isSupabaseConfigured() {
    return mocks.state.configured
  },
}))

vi.mock('@/lib/supabase', () => ({
  getSupabase: () => (mocks.state.configured ? Promise.resolve(mocks.client) : null),
}))

const session = { user: { id: 'usuario-1', email: 'pessoa@example.com' } }

function renderAdmin(path = '/admin') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="admin/*" element={<AdminApp />} />
          <Route path="/" element={<p>site público</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  mocks.state.configured = true
  mocks.client.auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
  mocks.client.auth.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  })
  mocks.client.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null })
  mocks.client.auth.signOut.mockResolvedValue({ error: null })
  mocks.client.rpc.mockResolvedValue({ data: false, error: null })
})

describe('AdminApp — configuração', () => {
  it('mostra "Configuração pendente" quando o Supabase não está configurado', async () => {
    mocks.state.configured = false
    renderAdmin()

    expect(
      await screen.findByRole('heading', { name: 'Configuração pendente' }),
    ).toBeInTheDocument()
    expect(screen.getByText('VITE_SUPABASE_URL')).toBeInTheDocument()
    expect(screen.getAllByText('não definida')).toHaveLength(2)
    expect(mocks.client.auth.getSession).not.toHaveBeenCalled()
  })

  it('marca o painel como não indexável enquanto está montado', async () => {
    const { unmount } = renderAdmin()
    await screen.findByRole('heading', { name: 'Entrar no painel' })

    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    )
    unmount()
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
  })
})

describe('AdminApp — controle de acesso', () => {
  it('redireciona visitantes sem sessão para o login', async () => {
    renderAdmin('/admin/mensagens')

    expect(await screen.findByRole('heading', { name: 'Entrar no painel' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Mensagens' })).not.toBeInTheDocument()
    expect(mocks.client.rpc).not.toHaveBeenCalled()
  })

  it('nega acesso e encerra a sessão de quem está autenticado mas não é administrador', async () => {
    mocks.client.auth.getSession.mockResolvedValue({ data: { session }, error: null })
    mocks.client.rpc.mockResolvedValue({ data: false, error: null })
    renderAdmin()

    expect(await screen.findByRole('heading', { name: 'Acesso negado' })).toBeInTheDocument()
    expect(mocks.client.rpc).toHaveBeenCalledWith('is_admin')
    await waitFor(() => expect(mocks.client.auth.signOut).toHaveBeenCalled())
    expect(screen.queryByRole('heading', { name: 'Visão geral' })).not.toBeInTheDocument()
  })

  it('libera o painel para administradores', async () => {
    mocks.client.auth.getSession.mockResolvedValue({ data: { session }, error: null })
    mocks.client.rpc.mockResolvedValue({ data: true, error: null })
    renderAdmin()

    expect(await screen.findByRole('heading', { name: 'Visão geral' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute(
      'href',
      '/admin/projetos',
    )
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
    expect(mocks.client.auth.signOut).not.toHaveBeenCalled()
  })

  it('não libera o painel quando a verificação de permissão falha', async () => {
    mocks.client.auth.getSession.mockResolvedValue({ data: { session }, error: null })
    mocks.client.rpc.mockResolvedValue({ data: null, error: { message: 'falha de rede' } })
    renderAdmin()

    expect(
      await screen.findByRole('heading', { name: 'Não foi possível verificar o acesso' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Visão geral' })).not.toBeInTheDocument()
  })
})

describe('AdminApp — login', () => {
  it('valida os campos antes de chamar a autenticação', async () => {
    const user = userEvent.setup()
    renderAdmin('/admin/login')

    await user.click(await screen.findByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('Informe um e-mail válido.')).toBeInTheDocument()
    expect(screen.getByText('Informe sua senha.')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true')
    expect(mocks.client.auth.signInWithPassword).not.toHaveBeenCalled()
  })

  it('mostra uma mensagem genérica quando as credenciais são recusadas', async () => {
    mocks.client.auth.signInWithPassword.mockResolvedValue({
      data: {},
      error: { message: 'Invalid login credentials' },
    })
    const user = userEvent.setup()
    renderAdmin('/admin/login')

    await user.type(await screen.findByLabelText('E-mail'), 'pessoa@example.com')
    await user.type(screen.getByLabelText('Senha'), 'senha-incorreta')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha inválidos.')
    expect(mocks.client.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'pessoa@example.com',
      password: 'senha-incorreta',
    })
    expect(screen.queryByText(/Invalid login credentials/)).not.toBeInTheDocument()
  })

  it('não oferece cadastro de novos administradores', async () => {
    renderAdmin('/admin/login')
    await screen.findByRole('heading', { name: 'Entrar no painel' })

    expect(screen.queryByText(/cadastr|criar conta|sign up/i)).not.toBeInTheDocument()
  })
})
