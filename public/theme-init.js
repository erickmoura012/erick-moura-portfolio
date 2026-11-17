// Aplica o tema salvo antes da primeira pintura para evitar flash de tema errado.
// O escuro é o padrão da identidade visual; o claro vale apenas por escolha do visitante.
// Arquivo externo (e não inline) para manter a Content-Security-Policy sem 'unsafe-inline'.
try {
  var stored = localStorage.getItem('em-theme')
  var theme = stored === 'light' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme
  if (theme === 'light') {
    var meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', '#f5f7fb')
  }
} catch (_) {
  // Armazenamento indisponível: mantém o tema escuro padrão.
}
