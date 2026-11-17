import type { Plugin } from 'vite'

interface SeoPluginOptions {
  siteUrl: string | null
}

const PERSON = {
  name: 'Erick Moura',
  alternateName: 'Erick Moura Almeida',
  jobTitle: 'Desenvolvedor Full Stack | Automações & Inteligência Artificial',
  description:
    'Desenvolvedor Full Stack e Analista de Soluções com experiência em desenvolvimento web, automações, integrações de APIs e Inteligência Artificial.',
  sameAs: ['https://github.com/erickmoura012', 'https://www.linkedin.com/in/erickmouradev/'],
  worksFor: { '@type': 'Organization', name: 'Teté à Teté Marketing de Conversa' },
  knowsAbout: [
    'Desenvolvimento Web',
    'React',
    'TypeScript',
    'Automação de processos',
    'n8n',
    'APIs REST',
    'Inteligência Artificial',
    'Agentes conversacionais',
  ],
}

/** Injeta no index.html as tags que dependem da URL pública e os dados estruturados. */
export function seoPlugin({ siteUrl }: SeoPluginOptions): Plugin {
  return {
    name: 'portfolio-seo',
    transformIndexHtml(html) {
      const tags: string[] = []

      if (siteUrl) {
        tags.push(
          `<link rel="canonical" href="${siteUrl}/" />`,
          `<meta property="og:url" content="${siteUrl}/" />`,
          `<meta property="og:image" content="${siteUrl}/og-image.png" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          `<meta property="og:image:alt" content="Erick Moura — Desenvolvedor Full Stack, Automações e Inteligência Artificial" />`,
          `<meta name="twitter:image" content="${siteUrl}/og-image.png" />`,
        )
      }

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        ...PERSON,
        ...(siteUrl ? { url: `${siteUrl}/`, image: `${siteUrl}/og-image.png` } : {}),
      }
      tags.push(
        `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
      )

      return html.replace('<!--seo-head-->', tags.join('\n    '))
    },
  }
}
