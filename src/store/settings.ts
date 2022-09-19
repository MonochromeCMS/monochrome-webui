import { defineStore } from 'pinia'
import type { SettingsSchema } from '@/api/Settings'

export const useSettings = defineStore('settings', {
  state: () => ({
    about: '',
    title1: '',
    title2: '',
  }),
  actions: {
    set(payload: SettingsSchema) {
      this.$patch(payload)
    },
    async get() {
      const response = await Settings.get()

      if (response.data !== null) {
        this.$patch(response.data)

        this.title1 ||= 'Mono'
        this.title2 ||= 'chrome'
      }

      return response
    },
  },
})
