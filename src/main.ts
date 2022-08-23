import "./registerServiceWorker"
import "./app.scss"
import "./vee-validate"

import Vue from "vue"

import App from "./App.vue"
import i18n from "./i18n"
import vuetify from "./plugins/vuetify"
import router from "./router"
import store from "./store"
import VueDOMPurifyHTML from "vue-dompurify-html"

Vue.use(VueDOMPurifyHTML)

Vue.config.productionTip = false

new Vue({
  i18n,
  render: (h) => h(App),
  router,
  store,
  vuetify,
}).$mount("#app")
