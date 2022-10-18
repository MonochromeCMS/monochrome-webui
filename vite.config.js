import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'url'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify' // Components library auto-import
import Components from 'unplugin-vue-components/vite' // Own components auto-import
import AutoImport from 'unplugin-auto-import/vite' // Auto-import for libraries
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite' // Internationalization
import Pages from 'vite-plugin-pages' // Replace views with pages
import { createHtmlPlugin } from 'vite-plugin-html' // Dynamic HTML
import generateFile from 'vite-plugin-generate-file' // Generate OpenSearch XML
import { VitePWA } from 'vite-plugin-pwa' // Progressive Web App

const protocol = process.env.PROTOCOL || 'http'
const domainName = process.env.DOMAIN_NAME || 'localhost'
let baseUrl = process.env.BASE_URL || '/'
baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
const title = process.env.TITLE || 'Monochrome'
const description = process.env.DESCRIPTION || 'A website for reading manga'
const fullUrl = `${protocol}://${domainName}${baseUrl}`

// https://vitejs.dev/config/
export default defineConfig({
  base: baseUrl,
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    splitVendorChunkPlugin(),
    vue(),
    vuetify({ autoImport: true }),
    Pages({ routeStyle: 'nuxt' }),
    Components({ dts: './src/components.d.ts', directoryAsNamespace: true }),
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core', 'vue-i18n'],
      dirs: ['./src/store', './src/composables', './src/api'],
      dts: './src/auto-imports.d.ts',
    }),
    VueI18nPlugin({
      include: resolve(
        dirname(fileURLToPath(import.meta.url)),
        './src/locales/**',
      ),
      defaultSFCLang: 'yaml',
    }),
    createHtmlPlugin({
      minify: false,
      entry: '/src/main.ts',
      inject: {
        data: {
          baseUrl,
          fullUrl,
          title,
          description,
        },
      },
    }),
    generateFile([
      {
        type: 'template',
        output: './opensearch.xml',
        template: './src/opensearch.ejs',
        data: {
          baseUrl,
          fullUrl,
          title,
          description,
        },
      },
    ]),
    VitePWA({
      scope: baseUrl,
      workbox: {
        navigateFallbackDenylist: [/^\/api/, /^\/media/],
      },
      includeAssets: ['favicon.ico', 'safari-pinned-tab.svg'],
      manifest: {
        name: title,
        short_name: title,
        description,
        theme_color: '#eeeeee',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
