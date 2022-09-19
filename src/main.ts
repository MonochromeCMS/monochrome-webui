import { createApp } from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import { loadFonts } from './plugins/webfontloader'
import { router } from './plugins/router'
import { pinia } from './store'

import './main.scss'

loadFonts()

createApp(App)
  .use(router)
  .use(pinia)
  .use(i18n)
  .use(vuetify)
  .use(VueDOMPurifyHTML)
  .mount('#app')
