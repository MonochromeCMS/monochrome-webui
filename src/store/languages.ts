import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'

export const useLangs = defineStore('languages', {
  state: () => {
    const { availableLocales: langs, locale } = useI18n()

    const userLangs = usePreferredLanguages()

    function localesToCode() {
      for (let locale of userLangs.value) {
        locale = locale.split('-')[0]
        if (langs.includes(locale))
          return locale
      }
      return langs[0]
    }

    const currentLang = useStorage('monochrome-lang', localesToCode())

    if (!langs.includes(currentLang.value))
      currentLang.value = langs[0]

    locale.value = currentLang.value

    return {
      langs,
      currentLang,
    }
  },
})
