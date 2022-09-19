import { defineStore } from 'pinia'
import i18n from '@/plugins/i18n'

import type { LoginForm, TokenResponse } from '@/api/Auth'

import type { Role, UserResponse } from '@/api/User'

export const useAuth = defineStore('user', {
  state: () => ({
    token: '',
    refresh: '',

    id: '',
    role: 'guest' as Role,
    username: '',
  }),

  actions: {
    logout() {
      this.$patch({
        token: '',
        refresh: '',

        id: '',
        role: 'guest',
        username: '',
      })
    },
    setToken(payload: TokenResponse) {
      this.token = payload.access_token
      if (payload.refresh_token)
        this.refresh = payload.refresh_token
    },
    updateUser(payload: UserResponse) {
      this.$patch(payload)
    },
    async getUserData() {
      const response = await User.me(this.config)

      if (response.data !== null)
        this.updateUser(response.data)
      else
        this.logout()

      return response
    },
    async login(form: LoginForm) {
      const response = await Auth.login(form)

      if (response.data !== null) {
        this.setToken(response.data)
        await this.getUserData()
      }
      return response
    },
  },

  getters: {
    config: state =>
      state.token
        ? {
            headers: {
              Accept: '*/*',
              Authorization: 'Bearer '.concat(state.token),
            },
            withCredentials: true,
          }
        : {},
    displayUserRole: state =>
    // @ts-expect-error this returns a weird TS error
      state.role ? i18n.global.t(`roles.${state.role}`) : undefined,
    isConnected: state => !!state.token,
  },

  persist: {
    key: 'monochrome-state-user',
    paths: ['token', 'refresh'],
  },
})
