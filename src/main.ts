import { createApp } from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import { loadFonts } from './plugins/webfontloader'
import { router } from './plugins/router'
import { pinia } from './store'

import './main.scss'

const intervalMS = 60 * 60 * 1000

registerSW({
  onRegisteredSW(swUrl, r) {
    r && setInterval(async () => {
      if (!(!r.installing && navigator))
        return

      if (('connection' in navigator) && !navigator.onLine)
        return

      const resp = await fetch(swUrl, {
        cache: 'no-store',
        // 'cache-control': 'no-cache'
      })

      if (resp?.status === 200)
        await r.update()
    }, intervalMS)
  },
})

loadFonts()

createApp(App)
  .use(router)
  .use(pinia)
  .use(i18n)
  .use(vuetify)
  .use(VueDOMPurifyHTML)
  .mount('#app')
