import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/space-grotesk/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import './app/styles/index.css'

import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './app/App'

const container = document.getElementById('root')
if (!container) throw new Error('Elemento #root não encontrado.')

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/'

// O build pré-renderiza as páginas públicas e marca o caminho em `data-prerendered`.
// Só hidratamos quando o HTML corresponde à rota atual; em qualquer outro caso
// (ex.: fallback de SPA servindo outra rota) renderizamos do zero.
const prerenderedPath = container.dataset.prerendered
if (prerenderedPath && normalizePath(prerenderedPath) === normalizePath(window.location.pathname)) {
  // O HTML já está completo: deixamos o navegador pintá-lo antes de hidratar,
  // para que a hidratação não atrase o primeiro paint (FCP/LCP).
  requestAnimationFrame(() => {
    setTimeout(() => hydrateRoot(container, app), 0)
  })
} else {
  container.replaceChildren()
  createRoot(container).render(app)
}
