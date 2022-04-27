import type { ActionContext } from "vuex"

import type { ApiResponse } from "@/api/Base"
import type { SettingsSchema } from "@/api/Settings"
import Settings from "@/api/Settings"

const state = (): SettingsSchema => ({
  about: undefined,
  title1: undefined,
  title2: undefined,
})

const mutations = {
  setSettings(state: SettingsSchema, payload: SettingsSchema): void {
    state.about = payload.about
    state.title1 = payload.title1
    state.title2 = payload.title2
  },
}

const getters = {
  settings(state: SettingsSchema): SettingsSchema {
    return state
  },
}

const actions = {
  async getSettings({
    commit,
  }: ActionContext<SettingsSchema, any>): Promise<ApiResponse<SettingsSchema>> {
    const response = await Settings.get()

    if (response.data) {
      commit("setSettings", response.data)
    }

    return response
  },
}

export default {
  actions,
  getters,
  mutations,
  state,
}
