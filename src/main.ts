import { createApp } from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import { loadFonts } from './plugins/webfontloader'
import { router } from './plugins/router'
import { setupPWA } from './plugins/pwa'
import { pinia } from './store'

import './main.scss'

setupPWA()
loadFonts()

createApp(App)
  .use(router)
  .use(pinia)
  .use(i18n)
  .use(vuetify)
  .use(VueDOMPurifyHTML)
  .mount('#app')
