/**
 * Cor por linguagem. A cor segue a entidade (a linguagem), nunca a posição no
 * ranking, e vem da paleta categórica definida em `index.css` — os matizes
 * lembram os do GitHub, mas os tons foram validados para daltonismo e contraste
 * nos dois temas. Linguagens fora do mapa usam o cinza neutro de "Outras".
 */
const LANGUAGE_SERIES: Record<string, string> = {
  TypeScript: 'blue',
  JavaScript: 'yellow',
  HTML: 'orange',
  CSS: 'violet',
  SCSS: 'aqua',
  Sass: 'aqua',
  Python: 'green',
  Shell: 'red',
  Dockerfile: 'magenta',
}

export const OTHER_LANGUAGES_COLOR = 'var(--series-other)'

export function languageColor(language: string): string {
  const series = LANGUAGE_SERIES[language]
  return series ? `var(--series-${series})` : OTHER_LANGUAGES_COLOR
}
