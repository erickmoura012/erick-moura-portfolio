import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { skills } from '@/content/pt-BR/skills'
import { renderWithProviders } from '@/test/render'
import { SkillsSection } from './SkillsSection'

describe('SkillsSection', () => {
  it('exibe todas as tecnologias e nenhum percentual arbitrário', () => {
    renderWithProviders(<SkillsSection />)
    expect(screen.getByText(`${skills.length} tecnologias`)).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/\d+\s?%/)
  })

  it('filtra por categoria e marca o filtro ativo', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SkillsSection />)

    const aiFilter = screen.getByRole('button', { name: 'Inteligência Artificial' })
    await user.click(aiFilter)

    const expected = skills.filter((skill) => skill.category === 'ai').length
    expect(aiFilter).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(`${expected} tecnologias`)).toBeInTheDocument()
    expect(screen.getByText('OpenAI API')).toBeInTheDocument()
  })

  it('"Em aprendizado" reúne itens de todas as categorias classificados como aprendizado', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SkillsSection />)
    await user.click(screen.getByRole('button', { name: 'Em aprendizado' }))

    const learning = skills.filter((skill) => skill.level === 'learning')
    expect(screen.getByText(`${learning.length} tecnologias`)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('React')).not.toBeInTheDocument())
  })
})
