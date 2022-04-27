import SecureLS from "secure-ls"
import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"

const ls = new SecureLS({
  encodingType: "rabbit",
  encryptionSecret: process.env.VUE_APP_SECRET,
  isCompression: false,
})

// SecureLS will throw a tantrum if the secret changes, this prevents it
try {
  ls.get("vuex")
} catch {
  localStorage.removeItem("vuex")
}

import notifications from "./notifications"
import reader from "./reader"
import settings from "./settings"
import user from "./user"

Vue.use(Vuex)

const persistedStateConf = {
  paths: ["user", "reader"],
  storage: {
    getItem: (key: string) => ls.get(key),
    removeItem: (key: string) => ls.remove(key),
    setItem: (key: string, value: any) => ls.set(key, value),
  },
}

export default new Vuex.Store({
  modules: { notifications, reader, settings, user },
  plugins: [createPersistedState(persistedStateConf)],
})
