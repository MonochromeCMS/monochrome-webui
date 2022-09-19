import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Pages from 'vite-plugin-pages'
import { createHtmlPlugin } from 'vite-plugin-html'
import generateFile from 'vite-plugin-generate-file'

const protocol = process.env.PROTOCOL || 'http'
const domainName = process.env.DOMAIN_NAME || 'localhost'
let baseUrl = process.env.BASE_URL || '/'
baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
const title = process.env.TITLE || 'Monochrome'
const description = process.env.DESCRIPTION || 'A website for reading manga'
const fullUrl = `${protocol}://${domainName}${baseUrl}`

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
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
      entry: 'src/main.ts',
      inject: {
        data: {
          baseUrl,
          fullUrl,
          title,
          description,
        },
      },
    }),
    generateFile([{
      type: 'template',
      output: './opensearch.xml',
      template: './src/opensearch.ejs',
      data: {
        baseUrl,
        fullUrl,
        title,
        description,
      },
    }]),
  ],
})
