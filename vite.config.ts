/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type PluginOption } from 'vite'
import { seoPlugin } from './build/seo-plugin.ts'
import { resolveSiteUrl } from './build/site-url.ts'

export default defineConfig(async ({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  const plugins: PluginOption[] = [
    react(),
    tailwindcss(),
    seoPlugin({ siteUrl: resolveSiteUrl(env) }),
  ]

  if (mode === 'analyze') {
    const { visualizer } = await import('rollup-plugin-visualizer')
    plugins.push(visualizer({ filename: 'stats.html', gzipSize: true, brotliSize: true }))
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@shared': fileURLToPath(new URL('./supabase/functions/_shared', import.meta.url)),
      },
    },
    build: {
      target: 'es2022',
      cssMinify: true,
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}', 'supabase/functions/_shared/**/*.test.ts'],
      css: false,
      restoreMocks: true,
    },
  }
})
